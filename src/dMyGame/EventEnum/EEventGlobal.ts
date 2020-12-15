/**
 * 全局事件
 * * 都能抛出和监听
 */
export enum EEventGlobal {
    /** 游戏初始化 */
    GameInit = '_EEventGlobal_GameInit',
    /** 游戏初始化完成 */
    GameOnInit = '_EEventGlobal_GameOnInit',
    /** 游戏加载 */
    GameLoading = '_EEventGlobal_GameLoading',
    /** 游戏资源加载 */
    GameResLoading = '_EEventGlobal_GameResLoading',
}

/**
    事件定义规则
    只在产生事件时抛出事件
    不要被动抛出事件避免事件循环抛出
 */