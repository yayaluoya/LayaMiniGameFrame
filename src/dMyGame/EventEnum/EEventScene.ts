/**
 * 所有的场景事件
 * ! 都能抛出，但是不能被UI监听
 */
export enum EEventScene {
    /** 看广告 */
    LookAd = '_EEventScene_LookAd',
    /** 看完广告 */
    UnLookAd = '_EEventScene_UnLookAd',
    /** 游戏关卡构建事件 */
    GameLevelsBuild = '_EEventScene_GameLevelsBuild',
    /** 游戏其他关卡构建事件 */
    GameOtherLevelsBuild = '_EEventScene_GameOtherLevelsBuild',
    /** 游戏关卡构建前事件 */
    GameLevelsBuildBefore = '_EEventScene_GameLevelsBuildBefore',
    /** 游戏关卡构建完成事件 */
    GameLevelsOnBuild = '_EEventScene_GameLevelsOnBuild',
    /** 游戏清除关卡事件 */
    GameLevelsDelete = '_EEventScene_GameLevelsDelete',
    /** 游戏清除其他关卡事件 */
    GameOtherLevelsDelete = '_EEventScene_GameOtherLevelsDelete',
    /** 游戏清除关卡前 */
    GameLevelsDeleteBefore = '_EEventScene_GameLevelsDeleteBefore',
    /** 游戏清除完成 */
    GameLevelsOnDelete = '_EEventScene_GameLevelsOnDelete',
    /** 游戏开始 */
    GameStart = "_EEventScene_Start",
    /** 游戏暂停 */
    GameSuspend = '_EEventScene_GameSuspend',
    /** 游戏继续 */
    GameGoOn = '_EEventScene_GameGoOn',
    /** 游戏重新开始 */
    GameRestart = '_EEventScene_GameRestart',
    /** 游戏结束 */
    GameEnd = '_EEventScene_GameEnd',
    /** 游戏完成 */
    GameCom = '_EEventScene_GameCom',
    /** 游戏胜利 */
    GameWin = "_EEventScene_gameWin",
    /** 游戏失败 */
    GameFail = "_EEventScene_gameFail",
    /** 角色死亡 */
    RoleDie = '_EEventScene_RoleDie',
    /** 角色复活 */
    RoleRevive = '_EEventScene_Revive',

    //其他道具

    /** 鼠标点击事件 */
    MouseClick = '_EEventScene_MouseClick',
    /** 鼠标移动事件 */
    MouseMove = '_EEventScene_MouseMove',
    /** 鼠标离开 */
    MouseUp = '_EEventScene_MouseUp',
}