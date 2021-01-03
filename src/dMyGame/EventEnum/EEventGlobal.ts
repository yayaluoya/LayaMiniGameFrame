/**
 * 全局事件
 */
export enum EEventGlobal {
    /** 游戏初始化 */
    GameInit = 'GameInit',
    /** 游戏初始化完成 */
    GameOnInit = 'GameOnInit',
    /** 游戏加载 */
    GameLoading = 'GameLoading',
    /** 游戏资源加载 */
    GameResLoading = 'GameResLoading',
}

/**
    事件定义规则
    只在产生事件时抛出事件
    不要被动抛出事件避免事件循环抛出
 */