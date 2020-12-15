/**
 * 音效事件
 * * 只有音效管理类能监听和抛出
 */
export enum EEventAudio {
    /** BGM暂停 */
    BGMSuspend = '_EEventAudio_BGMSuspend',
    /** BGM继续 */
    BGMGoOn = '_EEventAudio_BGMGoOn',
    /** 音效暂停 */
    SoundSuspend = '_EEventAudio_SoundSuspend',
    /** 音效继续 */
    SoundGoOn = '_EEventAudio_SoundGoOn',
    /** BGM音量改变 */
    BGMVolumeChange = '_EEventAudio_BGMVolumeChange',
    /** Sound音量改变 */
    SoundVolumeChange = '_EEventAudio_BGMVolumeChange',
}

/**
    事件定义规则
    只在产生事件时抛出事件
    不要被动抛出事件避免事件循环抛出
 */