/**
 * 所有的UI事件
 * ! 都能抛出，但是不能被Scene监听
 */
export enum EEventUI {
    LookAd = '_EEventUI_LookAd',//看广告
    UnLookAd = '_EEventUI_UnLookAd',//看完广告
    CustomsChange = '_EEventUI_CustomsChange',//关卡改变
    GameStart = '_EEventUI_Start', // 游戏开始
    GameEnd = '_EEventUI_GameEnd',//游戏结束
    GamePasue = '_EEventUI_GamePause', //游戏暂停
    GameResume = '_EEventUI_GameResume',//游戏继续
    GameCom = '_EEventUI_GameCom',//游戏完成
    GameWin = "_EEventUI_GameWin", // 游戏胜利
    GameFail = "_EEventUI_GameFail", // 游戏失败
    RoleDie = '_EEventUI_RoleDie',//角色死亡
    RoleRevive = '_EEventUI_RoleRevive',//角色复活
    GameCoinChange = "_EEventUI_GameCoinChange",// 金币改变
    //
    SoundStateChange = '_EEventUI_SoundStateChange',//音效状态改变
    VibrateStateChange = '_EEventUI_VibrateStateChange',//振动状态改变
    //场景相关
    SceneGameCustomsInit = '_EEventUI_SceneGameCustomsInit',//初始化关卡
    SceneGameCustomsLoading = '_EEventUI_SceneGameCustomsLoading',//关卡加载事件
    SceneGameCustomDelete = '_EEventUI_SceneGameCustomDelete',//场景关卡销毁
    //道具相关
}