import { GameConst } from "../_config/GameConst";
import { BaseConstDataProxy } from "../../aTGame/Config/RootDataProxy";

/**
 * 游戏配置数据代理
 */
export default class GameConstProxy extends BaseConstDataProxy<GameConst.config> {
    //
    private static _instance: GameConstProxy;
    /** 单例 */
    public static get instance(): GameConstProxy {
        if (this._instance == null) {
            this._instance = new GameConstProxy();
        }
        return this._instance;
    }
    //
    private constructor() {
        super();
    }

    //初始化
    protected initData() {
        this.m_data = GameConst.data;
    }
}
