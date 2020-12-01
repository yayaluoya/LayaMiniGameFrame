/**
 * 游戏签到数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameSignDataProxy {
    //
    private static m_instance: GameSignDataProxy;
    /** 单例 */
    public static get instance(): GameSignDataProxy {
        if (!this.m_instance) {
            this.m_instance = new GameSignDataProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { }
}