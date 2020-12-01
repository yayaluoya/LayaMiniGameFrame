import { EEventUI } from "../../EventEnum/EEventUI";
import GamePropDataSave from "../../GameData/GamePropDataSave";
import MesManager from "../../Manager/MesManager";

/**
 * 游戏道具数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GamePropDataProxy {
    //
    private static m_instance: GamePropDataProxy;
    /** 单例 */
    public static get instance(): GamePropDataProxy {
        if (!this.m_instance) {
            this.m_instance = new GamePropDataProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { }

    /**
     * 加金币
     * @param num 金币数量
    */
    public addCoin(_num: number) {
        GamePropDataSave.addCoin(_num);
        //传出事件
        MesManager.instance.eventUI(EEventUI.GameCoinChange);
    }
}