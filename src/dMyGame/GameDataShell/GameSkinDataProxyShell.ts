import RootDataProxyShell from "../../aTGame/Data/RootDataProxyShell";

/**
 * 游戏皮肤数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameSkinDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GameSkinDataProxyShell;
    /** 单例 */
    public static get instance(): GameSkinDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GameSkinDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }
}