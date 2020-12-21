import RootLocalStorageProxy from '../../aTGame/Data/RootLocalStorageProxy';
import GameSignData from './GameSignData';

/**
 * 签到数据保存类
 */
export default class GameSignDataProxy extends RootLocalStorageProxy<GameSignData>{
    //
    private static _instance: GameSignDataProxy;
    /** 单例 */
    public static get instance(): GameSignDataProxy {
        if (this._instance == null) {
            this._instance = new GameSignDataProxy();
        }
        //
        return this._instance;
    }

    /** 不允许外界实例化 */
    private constructor() {
        super();
    }

    /** 获取保存名称 */
    protected get _saveName(): string {
        return "GameSign";
    }

    //获取一个新的数据
    protected getNewData(): GameSignData {
        return new GameSignData();
    }
}