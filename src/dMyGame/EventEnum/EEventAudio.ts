/**
 * 音效事件
 */
export enum EEventAudio {
    /** BGM暂停 */
    BGMSuspend = 'BGMSuspend',
    /** BGM继续 */
    BGMGoOn = 'BGMGoOn',
    /** 音效暂停 */
    SoundSuspend = 'SoundSuspend',
    /** 音效继续 */
    SoundGoOn = 'SoundGoOn',
    /** BGM音量改变 */
    BGMVolumeChange = 'BGMVolumeChange',
    /** Sound音量改变 */
    SoundVolumeChange = 'BGMVolumeChange',
}

/**
    事件定义规则
    只在产生事件时抛出事件
    不要被动抛出事件避免事件循环抛出
 */