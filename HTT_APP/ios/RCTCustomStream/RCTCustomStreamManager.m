//
//  RCTCustomStreamManager.m
//  iShowRN
//
//  Created by TuanTA on 10/12/21.
//

#import "RCTCustomStreamManager.h"
#import "HTT-Swift.h"
#import <React/RCTUIManager.h>

@implementation RCTCustomStreamManager

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_MODULE()
- (UIView *)view {
  RCTCustomStreamView *view = [RCTCustomStreamView new];
//  [view setup];
  return view;
}
RCT_EXPORT_VIEW_PROPERTY(streamKey, NSString)
RCT_EXPORT_VIEW_PROPERTY(shouldSetup, BOOL)
RCT_EXPORT_VIEW_PROPERTY(streamServer, NSString)
RCT_EXPORT_VIEW_PROPERTY(onStatus, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStreamError, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStreamStats, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(videoPreset, int);

RCT_EXPORT_METHOD(start: (nonnull NSNumber *) reactTag)
{
  [self.bridge.uiManager addUIBlock:
   ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTCustomStreamView *> *viewRegistry){
    RCTLog(@"start");
    RCTCustomStreamView *component = [self.bridge.uiManager viewForReactTag:reactTag];
    [component start];
   }];
}

RCT_EXPORT_METHOD(stop: (nonnull NSNumber *) reactTag)
{
  [self.bridge.uiManager addUIBlock:
   ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTCustomStreamView *> *viewRegistry){
    RCTLog(@"StopStream");
    RCTCustomStreamView *component = [self.bridge.uiManager viewForReactTag:reactTag];
    [component stop];
   }];
}

RCT_EXPORT_METHOD(switchCamera: (nonnull NSNumber *) reactTag)
{
  [self.bridge.uiManager addUIBlock:
   ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTCustomStreamView *> *viewRegistry){
    RCTLog(@"switchCamera");
    RCTCustomStreamView *component = [self.bridge.uiManager viewForReactTag:reactTag];
    [component switchCamera];
   }];
}

@end
