import RootDataProxyShell from "../../../aTGame/Data/RootDataProxyShell";
import { EEventUI } from "../../EventEnum/EEventUI";
import GamePropDataProxy from "../../GameData/GamePropDataProxy";
import MesManager from "../../Manager/MesManager";

/**
 * 游戏道具数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GamePropDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GamePropDataProxyShell;
    /** 单例 */
    public static get instance(): GamePropDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GamePropDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    /**
     * 加金币
     * @param num 金币数量
    */
    public addCoin(_num: number) {
        GamePropDataProxy.addCoin(_num);
        //传出事件
        MesManager.instance.eventUI(EEventUI.GameCoinChange);
    }
}