/**
 * 游戏皮肤数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameSkinDataProxy {
    //
    private static m_instance: GameSkinDataProxy;
    /** 单例 */
    public static get instance(): GameSkinDataProxy {
        if (!this.m_instance) {
            this.m_instance = new GameSkinDataProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { }
}