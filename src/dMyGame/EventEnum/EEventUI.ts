/**
 * 所有的UI事件
 * ! 都能抛出，但是不能被Scene监听
 */
export enum EEventUI {
    /** 看广告 */
    LookAd = 'LookAd',
    /** 看完广告 */
    UnLookAd = 'UnLookAd',
    /** 关卡改变 */
    CustomsChange = 'CustomsChange',
    /** 游戏开始 */
    GameStart = 'Start',
    /** 游戏结束 */
    GameEnd = 'GameEnd',
    /** 游戏暂停 */
    GamePasue = 'GamePause',
    /** 游戏继续 */
    GameResume = 'GameResume',
    /** 游戏完成 */
    GameCom = 'GameCom',
    /** 游戏胜利 */
    GameWin = "GameWin",
    /** 游戏失败 */
    GameFail = "GameFail",
    /** 角色死亡 */
    RoleDie = 'RoleDie',
    /** 角色复活 */
    RoleRevive = 'RoleRevive',
    /** 金币改变 */
    GameCoinChange = "GameCoinChange",
    /** 音效状态改变 */
    SoundStateChange = 'SoundStateChange',
    /** 振动状态改变 */
    VibrateStateChange = 'VibrateStateChange',

    //场景相关

    /** 初始化关卡 */
    SceneGameCustomsInit = 'SceneGameCustomsInit',
    /** 关卡加载事件 */
    SceneGameCustomsLoading = 'SceneGameCustomsLoading',
    /** 场景关卡销毁 */
    SceneGameCustomDelete = 'SceneGameCustomDelete',
}