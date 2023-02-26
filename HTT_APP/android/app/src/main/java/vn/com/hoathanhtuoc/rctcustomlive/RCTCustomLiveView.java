package vn.com.hoathanhtuoc.rctcustomlive;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import vn.com.hoathanhtuoc.R;
import com.pedro.encoder.input.video.CameraHelper;
import com.pedro.rtplibrary.rtmp.RtmpCamera1;

import net.ossrs.rtmp.ConnectCheckerRtmp;

public class RCTCustomLiveView extends LinearLayout implements SurfaceHolder.Callback, ConnectCheckerRtmp, View.OnTouchListener {

    private static final String TAG = "CameraView";
    private static Context mcontext;
    private View rootView;
    private SurfaceView surfaceView;
    private RtmpCamera1 rtmpCamera;
    private String rtmpEndpoint;
    private String streamKey;
    private Preset preset = Preset.hd_720p_30fps_2mbps;
    private boolean destroy = false;

    public enum Preset {
        hd_1080p_30fps_5mbps(5000 * 1024, 1920, 1080, 30),
        hd_720p_30fps_3mbps(3000 * 1024, 1280, 720, 30),
        sd_540p_30fps_2mbps(2000 * 1024, 960, 540, 30),
        sd_360p_30fps_1mbps(1000 * 1024, 640, 360, 30),
        hd_720p_30fps_2mbps(2000 * 1024, 1280, 720, 30),
        ;

        Preset(int bitrate, int width, int height, int frameRate) {
            this.bitrate = bitrate;
            this.height = height;
            this.width = width;
            this.frameRate = frameRate;
        }

        public int bitrate;
        public int height;
        public int width;
        public int frameRate;
    }

    public void setStreamKey(String streamKey) {
        this.streamKey = streamKey;

    }

    public void setStreamServer(String streamServer) {
        this.rtmpEndpoint = streamServer;
    }

    private void startStream() {
        rtmpCamera.prepareVideo(
                preset.width,
                preset.height,
                preset.frameRate,
                preset.bitrate,
                2, // Fixed 2s keyframe interval
                CameraHelper.getCameraOrientation(mcontext)
        );
        rtmpCamera.prepareAudio(
                128 * 1024, // 128kbps
                48000, // 48k
                true // Stereo
        );
        Log.d(TAG, "here!");
        rtmpCamera.startStream(rtmpEndpoint + "/" + streamKey);
    }


    public RCTCustomLiveView(Context context) {
        super(context);
        init(context);
        mcontext = context;
    }

    public RCTCustomLiveView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public RCTCustomLiveView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private void init(Context context) {
        rootView = inflate(context, R.layout.camera_layout, this);

        // Init the Surface View for the camera preview
        surfaceView = findViewById(R.id.surfaceView);
        surfaceView.getHolder().addCallback(this);

        //Setup the camera
        rtmpCamera = new RtmpCamera1(surfaceView, this);
        rtmpCamera.setReTries(1000); // Effectively retry forever

    }

    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
        if (!destroy) {
            return;
        }
        destroy = false;
        startStream();

    }

    @Override
    public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {
        rtmpCamera.stopPreview();
        rtmpCamera.startPreview(1920, 1080);
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
        destroy = true;
        rtmpCamera.stopStream();
    }

    @Override
    public boolean onTouch(View view, MotionEvent motionEvent) {
        return false;
    }

    @Override
    public void onConnectionSuccessRtmp() {
        dispatchOnStatus(2001);
    }

    @Override
    public void onConnectionFailedRtmp(@NonNull String reason) {
        dispatchOnStatus(2002);
        rtmpCamera.reTry(5000, reason);
    }

    @Override
    public void onNewBitrateRtmp(long bitrate) {
        dispatchOnStats(bitrate);
    }

    @Override
    public void onDisconnectRtmp() {
        dispatchOnStatus(2004);

    }

    @Override
    public void onAuthErrorRtmp() {

    }

    @Override
    public void onAuthSuccessRtmp() {

    }

    public void changeCameraClicked() {
        Log.i(TAG, "Change Camera Button tapped");
        rtmpCamera.switchCamera();
    }

    public void goLiveClicked() {
        Log.i(TAG, "Go Live Button tapped");
        Log.d(TAG, "goLiveClicked: " + rtmpEndpoint + streamKey);
        startStream();

    }

    public void stopLive() {
        rtmpCamera.stopStream();
    }


    // callback props
    void dispatchOnStatus(int status) {
        WritableMap event = Arguments.createMap();
        event.putInt("status", status);
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                RCTCustomLiveManager.CALL_BACK_ON_STATUS,
                event);
    }

    void dispatchOnError() {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                RCTCustomLiveManager.CALL_BACK_ON_STREAM_ERROR,
                event);
    }

    void dispatchOnStats(long bitrate) {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = (ReactContext)getContext();
        event.putDouble("videodatarate", bitrate);
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                RCTCustomLiveManager.CALL_BACK_ON_STREAM_STATS,
                event);
    }

    void dispatchOnReady(boolean ready) {
        WritableMap event = Arguments.createMap();
        event.putBoolean("ready", ready);
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                RCTCustomLiveManager.CALL_BACK_ON_READY,
                event);
    }
}
