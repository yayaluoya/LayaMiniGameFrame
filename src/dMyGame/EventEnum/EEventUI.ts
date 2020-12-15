/**
 * 所有的UI事件
 * ! 都能抛出，但是不能被Scene监听
 */
export enum EEventUI {
    /** 看广告 */
    LookAd = '_EEventUI_LookAd',
    /** 看完广告 */
    UnLookAd = '_EEventUI_UnLookAd',
    /** 关卡改变 */
    CustomsChange = '_EEventUI_CustomsChange',
    /** 游戏开始 */
    GameStart = '_EEventUI_Start',
    /** 游戏结束 */
    GameEnd = '_EEventUI_GameEnd',
    /** 游戏暂停 */
    GamePasue = '_EEventUI_GamePause',
    /** 游戏继续 */
    GameResume = '_EEventUI_GameResume',
    /** 游戏完成 */
    GameCom = '_EEventUI_GameCom',
    /** 游戏胜利 */
    GameWin = "_EEventUI_GameWin",
    /** 游戏失败 */
    GameFail = "_EEventUI_GameFail",
    /** 角色死亡 */
    RoleDie = '_EEventUI_RoleDie',
    /** 角色复活 */
    RoleRevive = '_EEventUI_RoleRevive',
    /** 金币改变 */
    GameCoinChange = "_EEventUI_GameCoinChange",
    /** 音效状态改变 */
    SoundStateChange = '_EEventUI_SoundStateChange',
    /** 振动状态改变 */
    VibrateStateChange = '_EEventUI_VibrateStateChange',

    //场景相关

    /** 初始化关卡 */
    SceneGameCustomsInit = '_EEventUI_SceneGameCustomsInit',
    /** 关卡加载事件 */
    SceneGameCustomsLoading = '_EEventUI_SceneGameCustomsLoading',
    /** 场景关卡销毁 */
    SceneGameCustomDelete = '_EEventUI_SceneGameCustomDelete',
}