package vn.com.hoathanhtuoc.rctcustomlive;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;


public class RCTCustomLiveManager extends SimpleViewManager<RCTCustomLiveView> {
    public static RCTCustomLiveView rctCustomView;
    public static final String REACT_CLASS = "RCTCameraAndroid";
    public static final String CALL_BACK_ON_STATUS = "onStatus";
    public static final String CALL_BACK_ON_STREAM_ERROR = "onStreamError";
    public static final String CALL_BACK_ON_STREAM_STATS = "onStreamStats";
    public static final String CALL_BACK_ON_READY = "onReady";


    public static RCTCustomLiveView getInstance() {
        return rctCustomView;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected RCTCustomLiveView createViewInstance(@NonNull ThemedReactContext reactContext) {
        RCTCustomLiveView v = new RCTCustomLiveView(reactContext);
        rctCustomView = v;
        return v;
    }

    @ReactProp(name = "streamKey")
    public void setStreamKey(RCTCustomLiveView view, @Nullable String sources) {
        view.setStreamKey(sources);

    }

    @ReactProp(name = "streamServer")
    public void setStreamServer(RCTCustomLiveView view, @Nullable String sources) {
        view.setStreamServer(sources);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
//        return super.getExportedCustomBubblingEventTypeConstants();
        return MapBuilder.<String, Object>builder()
                .put(
                        CALL_BACK_ON_STATUS,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled", CALL_BACK_ON_STATUS)))
                .put(
                        CALL_BACK_ON_READY,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        CALL_BACK_ON_READY)))
                .put(
                        CALL_BACK_ON_STREAM_ERROR,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        CALL_BACK_ON_STREAM_ERROR)))
                .put(
                        CALL_BACK_ON_STREAM_STATS,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        CALL_BACK_ON_STREAM_STATS)))
                .build();
    }

}
