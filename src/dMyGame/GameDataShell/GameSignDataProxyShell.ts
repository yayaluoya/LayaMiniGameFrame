import RootDataProxyShell from "../../aTGame/Data/RootDataProxyShell";

/**
 * 游戏签到数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameSignDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GameSignDataProxyShell;
    /** 单例 */
    public static get instance(): GameSignDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GameSignDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }
}