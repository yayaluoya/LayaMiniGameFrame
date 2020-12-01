
/**
 * 新手引导数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameNewHandDataProxy {
    //
    private static m_instance: GameNewHandDataProxy;
    /** 单例 */
    public static get instance(): GameNewHandDataProxy {
        if (!this.m_instance) {
            this.m_instance = new GameNewHandDataProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { }
}