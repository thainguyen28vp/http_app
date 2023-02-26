//
//  AudioManager.swift
//  RNWS
//
//  Created by TuanTA on 10/14/21.
//

import Foundation
import AVFoundation
import VideoToolbox

@objc
public class RNAudioManager: NSObject {
  @objc public static let shared: RNAudioManager = RNAudioManager()

  var processingGraph: AUGraph?


  @objc public func initAudio() {
    let session = AVAudioSession.sharedInstance()
    do {
        // https://stackoverflow.com/questions/51010390/avaudiosession-setcategory-swift-4-2-ios-12-play-sound-on-silent
        setupEchoCancellation()
        if #available(iOS 10.0, *) {
            try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
        } else {
            session.perform(NSSelectorFromString("setCategory:withOptions:error:"), with: AVAudioSession.Category.playAndRecord, with: [
                AVAudioSession.CategoryOptions.allowBluetooth,
                AVAudioSession.CategoryOptions.defaultToSpeaker
            ])
            try session.setMode(.default)
        }
        try session.setInputGain(0)
        try session.setActive(true)
    } catch {
        print(error)
    }
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
  func setupEchoCancellation() {
          if let error = NewAUGraph(&self.processingGraph).error {
            print("Fail to create processing graph. Error: \(error.localizedDescription)")
            return
//              fatalError("Fail to create processing graph. Error: \(error.localizedDescription)")
          }

          if let error = AUGraphOpen(self.processingGraph!).error {
//              fatalError("Fail to open processing graph. Error: \(error.localizedDescription)")
            print("Fail to open processing graph. Error: \(error.localizedDescription)")
            return
          }

          var description: AudioComponentDescription = AudioComponentDescription()
          description.componentType = kAudioUnitType_Output
          description.componentSubType = kAudioUnitSubType_VoiceProcessingIO
          description.componentManufacturer = kAudioUnitManufacturer_Apple

          var remoteIONode: AUNode = AUNode()

          if let error = AUGraphAddNode(self.processingGraph!, &description, &remoteIONode).error {
//              fatalError("Fail to add remote io node to processing graph. Error: \(error.localizedDescription)")
            print("Fail to add remote io node to processing graph. Error: \(error.localizedDescription)")
            return
          }

          if let error = AUGraphInitialize(self.processingGraph!).error {
//              fatalError("Initialize processing graph failed. " +
//                  "Error: \(error.localizedDescription)")
            print("Initialize processing graph failed. " +
                "Error: \(error.localizedDescription)")
            return
          }
      }
}


extension OSStatus {
    var error: NSError? {
        guard self != noErr else { return nil }

        let message = self.asString() ?? "Unrecognized OSStatus"

        return NSError(
            domain: NSOSStatusErrorDomain,
            code: Int(self),
            userInfo: [
                NSLocalizedDescriptionKey: message
            ])
    }

    private func asString() -> String? {
        let n = UInt32(bitPattern: self.littleEndian)
        guard let n1 = UnicodeScalar((n >> 24) & 255), n1.isASCII else { return nil }
        guard let n2 = UnicodeScalar((n >> 16) & 255), n2.isASCII else { return nil }
        guard let n3 = UnicodeScalar((n >> 8) & 255), n3.isASCII else { return nil }
        guard let n4 = UnicodeScalar(n & 255), n4.isASCII else { return nil }
        return String(n1) + String(n2) + String(n3) + String(n4)
    }
}
