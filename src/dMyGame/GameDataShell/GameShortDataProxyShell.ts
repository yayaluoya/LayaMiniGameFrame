import RootDataProxyShell from "../../aTGame/Data/RootDataProxyShell";

/**
 * 游戏临时数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameShortDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GameShortDataProxyShell;
    /** 单例 */
    public static get instance(): GameShortDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GameShortDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }
}