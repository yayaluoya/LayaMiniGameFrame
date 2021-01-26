import RootDataProxyShell from "../../aTGame/Data/RootDataProxyShell";
import NumberUtils from "../../aTGame/Utils/NumberUtils";
import { EEventUI } from "../EventEnum/EEventUI";
import GamePropData from "../GameData/GamePropData";
import GamePropDataProxy from "../GameData/GamePropDataProxy";
import MesManager from "../Manager/MesManager";

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

    //游戏主数据
    private m_propData: GamePropData;

    //初始化数据
    protected initData() {
        this.m_propData = GamePropDataProxy.instance.saveData;
        //
    }

    /**
     * 加金币
     * @param num 金币数量
     */
    public addCoin(num: number) {
        //化整
        num = Math.floor(num);
        //增加临时数据
        this.m_propData.coinCount = NumberUtils.getNumberAtScope(this.m_propData.coinCount + num, 0);
        //传出事件
        MesManager.instance.sendEvent(EEventUI.GameCoinChange);
    }
}