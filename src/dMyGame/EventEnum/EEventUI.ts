/**
 * 所有的UI事件
 */
export enum EEventUI {
    /** 关卡改变 */
    CustomsChange = 'CustomsChange',
    /** 金币改变 */
    GameCoinChange = "GameCoinChange",
    /** 音效状态改变 */
    SoundStateChange = 'SoundStateChange',
    /** 振动状态改变 */
    VibrateStateChange = 'VibrateStateChange',

    //

    /** 关卡构建进度 */
    SceneGameCustomsLoading = 'SceneGameCustomsLoading',
    /** 3D更新事件 */
    Updata3D = 'Updata3D',
}