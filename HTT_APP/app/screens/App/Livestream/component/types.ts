export type LiveStreamViewHandles = {
  switchCamera: () => void
  changeBeautySettings: (options: any) => void
  stopLive: () => void
  startLive: () => void
}

export enum VideoState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  UNSTARTED = 'unstarted',
  ENDED = 'ended',
  ERROR = 'error',
}

export enum StreamStatus {
  connecting = 2000,
  failed = 2002,
  closed = 2004,
  start = 2001,
  aborted = 2005,
}

export enum StreamVideoPreset {
  hd_1080p_30fps_5mbps = 1,
  hd_720p_30fps_3mbps = 2,
  sd_540p_30fps_2mbps = 3,
  sd_360p_30fps_1mbps = 4,
  hd_1080p_15fps_1600kbps = 11,
  hd_720p_15fps_1130kbps = 12,
  sd_540p_15fps_600bps = 13,
  sd_360p_15fps_400kbps = 14,
  sd_240p_15fps_200kbps = 15,

  yt_4k_2160p_30fps_13mbps = 41,
  yt_hd_1440p_60fps_9mbps,
  yt_hd_1440p_30fps_6mbps,
  yt_hd_1080p_60fps_4_5mbps,
  yt_hd_1080p_30fps_3mbps,
  yt_hd_720p_60fps_2_3mbps,
  yt_hd_720p_30fps_2mbps,
  yt_hd_720p_30fps_1mbps,
  yt_sd_480p_30fps_1mbps,
  yt_sd_360p_30fps_500kbps,
  yt_sd_240p_30fps_300kbps,
}
