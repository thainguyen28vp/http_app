//
//  RCTCustomStreamView.swift
//  iShowRN
//
//  Created by TuanTA on 10/11/21.
//

import Foundation
import HaishinKit
import AVFoundation
import VideoToolbox
import UIKit

@objc(RCTCustomStreamView)
class RCTCustomStreamView: MTHKView, RTMPStreamDelegate {

  public enum StreamStatus: Int {
      case connecting = 2000
      case ready = 1001
      case reconnect = 1002
      case start = 2001
      case closed = 2004
      case failed = 2002
      case aborted = 2005
  }

  @objc
  public var streamKey: String? {
    didSet {
      print("StreamKey \(streamKey)")
    }
  }

  @objc
  public var streamServer: String? {
    didSet {
      print("streamServer \(streamServer)")
    }
  }

  @objc var shouldSetup: Bool = false {
    didSet {
      if (shouldSetup && rtmpStream == nil) {
        setup()
      }
    }
  }

  @objc var videoPreset: Int = Preset.hd_720p_15fps_1130kbps.rawValue {
    didSet {
      guard let tempPreset = Preset(rawValue: videoPreset) else {
        return
      }
      self.preset = tempPreset
    }
  }


  @objc var onStatus: RCTBubblingEventBlock?
  @objc var onStreamError: RCTBubblingEventBlock?
  @objc var onStreamStats: RCTBubblingEventBlock?
  @objc var onReady: RCTBubblingEventBlock?

  // RTMP Connection & RTMP Stream
  private var rtmpConnection = RTMPConnection()
  private var rtmpStream: RTMPStream!

  // Default Camera
  private var defaultCamera: AVCaptureDevice.Position = .front

  // Flag indicates if we should be attempting to go live
  private var liveDesired = false

  // Reconnect attempt tracker
  private var reconnectAttempt = 0


  // The Preset to use
  public var preset: Preset! = .yt_hd_720p_30fps_1mbps {
    didSet {
      if (shouldSetup && rtmpStream == nil) {
        setup()
      } else if let rtmpStream = rtmpStream {
        let orientation = UIApplication.shared.statusBarOrientation
        let profile = presetToProfile(preset: self.preset)
        rtmpStream.videoSettings = [
            .width: (orientation.isPortrait) ? profile.height : profile.width,
            .height: (orientation.isPortrait) ? profile.width : profile.height,
            .bitrate: profile.bitrate,
        ]

        rtmpStream.captureSettings = [
          .sessionPreset: AVCaptureSession.Preset.vga640x480,
            .fps: profile.frameRate
        ]
      }
    }
  }

  // A tracker of the last time we changed the bitrate in ABR
  private var lastBwChange = 0
//
//  // The RTMP endpoint
//  let rtmpEndpoint = "rtmp://a.rtmp.youtube.com/live2"

  // Some basic presets for live streaming
  enum Preset: Int {
      case hd_1080p_30fps_5mbps = 1
      case hd_720p_30fps_3mbps
      case sd_540p_30fps_2mbps
      case sd_360p_30fps_1mbps

      case hd_1080p_15fps_1600kbps = 11
      case hd_720p_15fps_1130kbps
      case sd_540p_15fps_600bps
      case sd_360p_15fps_400kbps
      case sd_240p_15fps_200kbps

      case yt_4k_2160p_30fps_13mbps = 41
      case yt_hd_1440p_60fps_9mbps
      case yt_hd_1440p_30fps_6mbps
      case yt_hd_1080p_60fps_4_5mbps
      case yt_hd_1080p_30fps_3mbps
      case yt_hd_720p_60fps_2_3mbps
      case yt_hd_720p_30fps_2mbps
      case yt_hd_720p_30fps_1mbps
      case yt_sd_480p_30fps_1mbps
      case yt_sd_360p_30fps_500kbps
      case yt_sd_240p_30fps_300kbps
  }

  // An encoding profile - width, height, framerate, video bitrate
  private class Profile {
      public var width : Int = 0
      public var height : Int = 0
      public var frameRate : Int = 0
      public var bitrate : Int = 0

      init(width: Int, height: Int, frameRate: Int, bitrate: Int) {
          self.width = width
          self.height = height
          self.frameRate = frameRate
          self.bitrate = bitrate
      }
  }

  // Converts a Preset to a Profile
  private func presetToProfile(preset: Preset) -> Profile {
      switch preset {
      case .hd_1080p_30fps_5mbps:
          return Profile(width: 1920, height: 1080, frameRate: 30, bitrate: 5000000)
      case .hd_720p_30fps_3mbps:
          return Profile(width: 1280, height: 720, frameRate: 30, bitrate: 3000000)
      case .sd_540p_30fps_2mbps:
          return Profile(width: 960, height: 540, frameRate: 30, bitrate: 2000000)
      case .sd_360p_30fps_1mbps:
          return Profile(width: 640, height: 360, frameRate: 30, bitrate: 1000000)
      case .hd_1080p_15fps_1600kbps:
        return Profile(width: 1920, height: 1080, frameRate: 15, bitrate: 1600000)

//      case .hd_720p_15fps_1130kbps:
//        return Profile(width: 1280, height: 720, frameRate: 15, bitrate: 1130000)
      case .hd_720p_15fps_1130kbps:
        return Profile(width: 1280, height: 720, frameRate: 15, bitrate: 1000000)
      case .sd_540p_15fps_600bps:
        return Profile(width: 960, height: 540, frameRate: 15, bitrate: 600000)
      case .sd_360p_15fps_400kbps:
        return Profile(width: 640, height: 360, frameRate: 15, bitrate: 400000)
      case .sd_240p_15fps_200kbps:
        return Profile(width: 320, height: 240, frameRate: 15, bitrate: 200000)

      case .yt_4k_2160p_30fps_13mbps:
            return Profile(width: 3840, height: 2160, frameRate: 30, bitrate: 13 * 1024 * 1024)
      case .yt_hd_1440p_60fps_9mbps:
          return Profile(width: 2560, height: 1440, frameRate: 60, bitrate: 9 * 1024 * 1024)
      case .yt_hd_1440p_30fps_6mbps:
          return Profile(width: 2560, height: 1440, frameRate: 30, bitrate: 6 * 1024 * 1024)
      case .yt_hd_1080p_60fps_4_5mbps:
          return Profile(width: 1920, height: 1080, frameRate: 60, bitrate: 5 * 1024 * 1024)
      case .yt_hd_1080p_30fps_3mbps:
          return Profile(width: 1920, height: 1080, frameRate: 30, bitrate: 3 * 1024)
      case .yt_hd_720p_60fps_2_3mbps:
          return Profile(width: 1280, height: 720, frameRate: 60, bitrate: 2500 * 1024)
      case .yt_hd_720p_30fps_2mbps:
          return Profile(width: 1280, height: 720, frameRate: 30, bitrate: 1500 * 1024)
      case .yt_hd_720p_30fps_1mbps:
          return Profile(width: 1280, height: 720, frameRate: 30, bitrate: 1024 * 1024)
      case .yt_sd_480p_30fps_1mbps:
          return Profile(width: 854, height: 480, frameRate: 30, bitrate: 1024 * 1024)
      case .yt_sd_360p_30fps_500kbps:
          return Profile(width: 640, height: 320, frameRate: 30, bitrate: 500 * 1024)
      case .yt_sd_240p_30fps_300kbps:
          return Profile(width: 426, height: 240, frameRate: 30, bitrate: 300 * 1024)
      }
  }


  // Configures the live stream
  private func configureStream(preset: Preset) {
      let profile = presetToProfile(preset: preset)

      // Configure the capture settings from the camera
      rtmpStream.captureSettings = [
        .sessionPreset: AVCaptureSession.Preset.hd1280x720,
          .continuousAutofocus: true,
          .continuousExposure: true,
          .isVideoMirrored: defaultCamera == .front,
          .fps: profile.frameRate
      ]

      // Get the orientation of the app, and set the video orientation appropriately
      let orientation = UIApplication.shared.statusBarOrientation
          let videoOrientation = DeviceUtil.videoOrientation(by: orientation)
          rtmpStream.orientation = videoOrientation!
          rtmpStream.videoSettings = [
              .width: (orientation.isPortrait) ? profile.height : profile.width,
              .height: (orientation.isPortrait) ? profile.width : profile.height,
              .bitrate: profile.bitrate,
             .profileLevel: kVTProfileLevel_H264_Main_AutoLevel,
              // .profileLevel: kVTProfileLevel_H264_High_AutoLevel,
              .maxKeyFrameIntervalDuration: 2, // 2 seconds
          ]


      // Configure the RTMP audio stream
      rtmpStream.audioSettings = [
          // .bitrate: 44100 // Always use 128kbps
          .bitrate: 128000
      ]

//    rtmpStream.recorderSettings = [
//      AVMediaType.audio: [
//              AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
//              AVSampleRateKey: 0,
//              AVNumberOfChannelsKey: 0,
              // AVEncoderBitRateKey: 128000,
//          ]
//          AVMediaType.video: [
//              AVVideoCodecKey: AVVideoCodecH264,
//              AVVideoHeightKey: 0,
//              AVVideoWidthKey: 0,
//              /*
//              AVVideoCompressionPropertiesKey: [
//                  AVVideoMaxKeyFrameIntervalDurationKey: 2,
//                  AVVideoProfileLevelKey: AVVideoProfileLevelH264Baseline30,
//                  AVVideoAverageBitRateKey: 512000
//              ]
//              */
//          ],
//    ]

    rtmpStream.recorderSettings = [
      AVMediaType.audio: [
              AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
//            AVFormatIDKey: Int(kAudioFormatTimeCode),
              AVSampleRateKey: 0,
              AVNumberOfChannelsKey: 0,
//                   AVEncoderBitRateKey: 128000
            // AVEncoderBitRateKey: 44100

          ],
          AVMediaType.video: [
              AVVideoCodecKey: AVVideoCodecH264,
              AVVideoHeightKey: 0,
              AVVideoWidthKey: 0,
              /*
              AVVideoCompressionPropertiesKey: [
                  AVVideoMaxKeyFrameIntervalDurationKey: 2,
                  AVVideoProfileLevelKey: AVVideoProfileLevelH264Baseline30,
                  AVVideoAverageBitRateKey: 512000
              ]
              */
          ],
    ]

        setInputGain(gain: 0)
  }

  // Publishes the live stream
  private func publishStream() {
      print("Calling publish()")
      rtmpStream.publish(self.streamKey)
  }

  // Triggers and attempt to connect to an RTMP hostname
  private func connectRTMP() {
      print("Calling connect()")
    if let server = streamServer {
      rtmpConnection.connect(server)
    }
  }

  @objc public func setup() {
    // Work out the orientation of the device, and set this on the RTMP Stream
    rtmpStream = RTMPStream(connection: rtmpConnection)

    // Get the orientation of the app, and set the video orientation appropriately
    let orientation = UIApplication.shared.statusBarOrientation

        let videoOrientation = DeviceUtil.videoOrientation(by: orientation)
        rtmpStream.orientation = videoOrientation!


    // And a listener for orientation changes
    // Note: Changing the orientation once the stream has been started will not change the orientation of the live stream, only the preview.
//    NotificationCenter.default.addObserver(self, selector: #selector(on(_:)), name: UIDevice.orientationDidChangeNotification, object: nil)

    // Configure the encoder profile
    configureStream(preset: self.preset)

    // Attatch to the default audio device
    rtmpStream.attachAudio(AVCaptureDevice.default(for: .audio)) { error in
        print(error.description)
    }

    // Attatch to the default camera
    rtmpStream.attachCamera(DeviceUtil.device(withPosition: defaultCamera)) { error in
        print(error.description)
    }

//     rtmpStream.registerAudioEffect()
    // Register a tap gesture recogniser so we can use tap to focus
//    let tap = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:)))
//    previewView.addGestureRecognizer(tap)
//    previewView.isUserInteractionEnabled = true

    // Attatch the preview view
    self.attachStream(rtmpStream)

    // Add event listeners for RTMP status changes and IO Errors
    rtmpConnection.addEventListener(.rtmpStatus, selector: #selector(rtmpStatusHandler), observer: self)
    rtmpConnection.addEventListener(.ioError, selector: #selector(rtmpErrorHandler), observer: self)

    rtmpStream.delegate = self

//    startStopButton.setTitle("Go Live!", for: .normal)
  }
  func setInputGain(gain: Float) {
    let audioSession = AVAudioSession.sharedInstance()
    if audioSession.isInputGainSettable {
      do {
          let success = try audioSession.setInputGain(gain)
      } catch {
          print("error")
      }
    }
    else {
      print("Cannot set input gain")
    }
  }

  @objc func start() {
    print("CustomStreamView-start-\(liveDesired)")
    if !liveDesired {

        if rtmpConnection.connected {
            // If we're already connected to the RTMP server, wr can just call publish() to start the stream
            publishStream()
        } else {
            // Otherwise, we need to setup the RTMP connection and wait for a callback before we can safely
            // call publish() to start the stream
            connectRTMP()
        }

        // Modify application state to streaming
        liveDesired = true
//        startStopButton.setTitle("Connecting...", for: .normal)
    } else {
//        // Unpublish the live stream
//        rtmpStream.close()
//
//        // Modify application state to idle
//        liveDesired = false
////        startStopButton.setTitle("Go Live!", for: .normal)
    }
  }
  @objc func stop() {
    guard let rtmpStream = rtmpStream else {
      liveDesired = false
      return
    }
    rtmpStream.close()

  }
  @objc func switchCamera() {
    print("SwitchCamera")
    if defaultCamera == .back {
      defaultCamera = .front
    } else {
      defaultCamera = .back
    }
    rtmpStream.captureSettings[.isVideoMirrored] = defaultCamera == .front
    rtmpStream.attachCamera(DeviceUtil.device(withPosition: defaultCamera))
  }

  // Called when the RTMPStream or RTMPConnection changes status
  @objc
  private func rtmpStatusHandler(_ notification: Notification) {


      let e = Event.from(notification)
              guard let data: ASObject = e.data as? ASObject, let code: String = data["code"] as? String else {
                  return
              }
    print("RTMP Status Handler called. \(code)")

      switch code {
      case RTMPConnection.Code.connectSuccess.rawValue:
          reconnectAttempt = 0
        if let onReady = onReady {
          onReady(["ready": true])
        }
        if let onStatus = onStatus {
          onStatus(["code": code, "status": code, "data": data])
        }
          if liveDesired {
              // Publish our stream to our stream key
              publishStream()
          }
      case RTMPConnection.Code.connectFailed.rawValue, RTMPConnection.Code.connectClosed.rawValue:
          print("RTMP Connection was not successful.")

          // Retry the connection if "live" is still the desired state
          if liveDesired {

              reconnectAttempt += 1

//              DispatchQueue.main.async {
//                  self.startStopButton.setTitle("Reconnect attempt " + String(self.reconnectAttempt) + " (Cancel)" , for: .normal)
//              }
              // Retries the RTMP connection every 5 seconds
              DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                  self.connectRTMP()
              }
          } else {
            if let onStatus = onStatus {
              onStatus(["code": code, "status": code, "data": data])
            }
          }
      default:
        if let onStatus = onStatus {
          onStatus(["code": code, "status": code, "data": data])
        }
          break
      }
  }

  // Called when there's an RTMP Error
  @objc
  private func rtmpErrorHandler(_ notification: Notification) {
      print("RTMP Error Handler called. \(notification)")
//    if let onError = onError {
//      onError([notification.name])
//    }
    connectRTMP()
  }

  // Called when the device changes rotation
  @objc
  private func on(_ notification: Notification) {
      let orientation = UIApplication.shared.statusBarOrientation
          let videoOrientation = DeviceUtil.videoOrientation(by: orientation)
          rtmpStream.orientation = videoOrientation!
          // Do not change the outpur rotation if the stream has already started.
//          if liveDesired == false {
//              let profile = presetToProfile(preset: self.preset)
//              rtmpStream.videoSettings = [
//                  .width: (orientation.isPortrait) ? profile.height : profile.width,
//                  .height: (orientation.isPortrait) ? profile.width : profile.height
//              ]
//          }

  }


  // RTMPStreamDelegate callbacks

  func rtmpStreamDidClear(_ stream: RTMPStream) {
  }

  // Statistics callback
  func rtmpStream(_ stream: RTMPStream, didStatics connection: RTMPConnection) {
//      DispatchQueue.main.async {
//          self.fpsLabel.text = String(stream.currentFPS) + " fps"
//          self.bitrateLabel.text = String((connection.currentBytesOutPerSecond / 125)) + " kbps"
//      }

    if let onStats = onStreamStats {
      onStats(["fps": stream.currentFPS, "outKbps": connection.currentBytesOutPerSecond / 125, "data": stream.metadata])
    }
  }

  // Insufficient bandwidth callback
  func rtmpStream(_ stream: RTMPStream, didPublishInsufficientBW connection: RTMPConnection) {
//      print("ABR: didPublishInsufficientBW")

      // If we last changed bandwidth over 10 seconds ago
      if (Int(NSDate().timeIntervalSince1970) - lastBwChange) > 5 {
//          print("ABR: Will try to change bitrate DECREASE")
        let profile = presetToProfile(preset: preset)
        let currentB = stream.videoSettings[.bitrate] as! UInt32
        if (currentB < UInt32(Double(profile.bitrate) * Double(0.6))) {
            return
        }

          // Reduce bitrate by 30% every 10 seconds
          let b = Double(stream.videoSettings[.bitrate] as! UInt32) * Double(0.7)
//          print("ABR: Proposed bandwidth: " + String(b))
        print("ABR: Proposed bandwidth DECREASE: \(String(profile.bitrate/1024))--\(String(b/1024))")
          stream.videoSettings[.bitrate] = b
          lastBwChange = Int(NSDate().timeIntervalSince1970)

//          DispatchQueue.main.async {
//              Loaf("Insuffient Bandwidth, changing video bandwidth to: " + String(b), state: Loaf.State.warning, location: .top,  sender: self).show(.short)
//          }

      } else {
          print("ABR: Still giving grace time for last bandwidth change")
      }
  }

  // Today this example doesn't attempt to increase bandwidth to find a sweet spot.
  // An implementation might be to gently increase bandwidth by a few percent, but that's hard without getting into an aggressive cycle.
  func rtmpStream(_ stream: RTMPStream, didPublishSufficientBW connection: RTMPConnection) {
//    print("ABR: didPublishSufficientBW in: \(connection.currentBytesInPerSecond) - out: \(connection.currentBytesOutPerSecond)")
    if (Int(NSDate().timeIntervalSince1970) - lastBwChange) > 5 {
//        print("ABR: Will try to change bitrate INCREASE")

      let profile = presetToProfile(preset: preset)
        // Increase bitrate by 30% every 10 seconds
      let b = Double(stream.videoSettings[.bitrate] as! UInt32) * Double(1.3)
      let clampB = min(Int(b), profile.bitrate)
      print("ABR: Proposed bandwidth INCREASE: \(String(profile.bitrate/1024))--\(String(clampB/1024))")
      if clampB < profile.bitrate {
        stream.videoSettings[.bitrate] = clampB
        lastBwChange = Int(NSDate().timeIntervalSince1970)
      } else {

      }
//          DispatchQueue.main.async {
//              Loaf("Insuffient Bandwidth, changing video bandwidth to: " + String(b), state: Loaf.State.warning, location: .top,  sender: self).show(.short)
//          }

    } else {
        print("ABR: Still giving grace time for last bandwidth change")
    }
  }
}

