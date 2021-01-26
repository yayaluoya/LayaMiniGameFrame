import RootDataProxyShell from "../../aTGame/Data/RootDataProxyShell";

/**
 * 新手引导数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameNewHandDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GameNewHandDataProxyShell;
    /** 单例 */
    public static get instance(): GameNewHandDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GameNewHandDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }
}