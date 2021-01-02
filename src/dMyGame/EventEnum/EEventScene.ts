/**
 * 所有的场景事件
 */
export enum EEventScene {
    /** 游戏关卡构建事件 */
    GameLevelsBuild = 'GameLevelsBuild',
    /** 游戏其他关卡构建事件 */
    GameOtherLevelsBuild = 'GameOtherLevelsBuild',
    /** 游戏关卡构建前事件 */
    GameLevelsBuildBefore = 'GameLevelsBuildBefore',
    /** 游戏关卡构建完成事件 */
    GameLevelsOnBuild = 'GameLevelsOnBuild',
    /** 游戏清除关卡事件 */
    GameLevelsDelete = 'GameLevelsDelete',
    /** 游戏清除其他关卡事件 */
    GameOtherLevelsDelete = 'GameOtherLevelsDelete',
    /** 游戏清除关卡前 */
    GameLevelsDeleteBefore = 'GameLevelsDeleteBefore',
    /** 游戏清除完成 */
    GameLevelsOnDelete = 'GameLevelsOnDelete',
    /** 游戏开始 */
    GameStart = "Start",
    /** 游戏暂停 */
    GameSuspend = 'GameSuspend',
    /** 游戏继续 */
    GameGoOn = 'GameGoOn',
    /** 游戏重新开始 */
    GameRestart = 'GameRestart',
    /** 游戏结束 */
    GameEnd = 'GameEnd',
    /** 游戏完成 */
    GameCom = 'GameCom',
    /** 游戏失败 */
    GameFail = "gameFail",
    /** 角色死亡 */
    RoleDie = 'RoleDie',
    /** 角色复活 */
    RoleRevive = 'Revive',
}