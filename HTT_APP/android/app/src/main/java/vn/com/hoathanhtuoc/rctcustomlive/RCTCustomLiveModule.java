package vn.com.hoathanhtuoc.rctcustomlive;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RCTCustomLiveModule extends ReactContextBaseJavaModule {

    private Context context;

    public RCTCustomLiveModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "CustomModule";
    }

    @ReactMethod
    public void switchCamera() {
        if (RCTCustomLiveManager.getInstance() != null) {
            RCTCustomLiveManager.getInstance().changeCameraClicked();
        }
    }

    @ReactMethod
    public void startLive() {
        if (RCTCustomLiveManager.getInstance() != null) {
            RCTCustomLiveManager.getInstance().goLiveClicked();
        }
    }

    @ReactMethod
    public void stopLive() {
        if (RCTCustomLiveManager.getInstance() != null) {
            RCTCustomLiveManager.getInstance().stopLive();
        }
    }
}
