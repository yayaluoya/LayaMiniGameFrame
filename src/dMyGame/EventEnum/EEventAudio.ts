/**
 * 音效事件
 * * 只有音效管理类能监听和抛出
 */
export enum EEventAudio {
    //
    BGMSuspend = '_EEventAudio_BGMSuspend',//BGM暂停
    BGMGoOn = '_EEventAudio_BGMGoOn',//BGM继续
    SoundSuspend = '_EEventAudio_SoundSuspend',//音效暂停
    SoundGoOn = '_EEventAudio_SoundGoOn',//音效继续
    BGMVolumeChange = '_EEventAudio_BGMVolumeChange',//BGM音量改变
    SoundVolumeChange = '_EEventAudio_BGMVolumeChange',//Sound音量改变
}

/**
    事件定义规则
    只在产生事件时抛出事件
    不要被动抛出事件避免事件循环抛出
 */