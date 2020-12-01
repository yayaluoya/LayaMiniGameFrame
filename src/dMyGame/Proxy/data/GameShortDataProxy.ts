/**
 * 游戏临时数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameShortDataProxy {
    //
    private static m_instance: GameShortDataProxy;
    /** 单例 */
    public static get instance(): GameShortDataProxy {
        if (!this.m_instance) {
            this.m_instance = new GameShortDataProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { }
}