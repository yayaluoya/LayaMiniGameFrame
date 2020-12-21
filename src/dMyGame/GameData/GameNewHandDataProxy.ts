import RootLocalStorageProxy from '../../aTGame/Data/RootLocalStorageProxy';
import GameNewHandData from './GameNewHandData';

/**
 * 新手引导数据保存类
 */
export default class GameNewHandDataProxy extends RootLocalStorageProxy<GameNewHandData>{
    //
    private static _instance: GameNewHandDataProxy;
    /** 单例 */
    public static get instance(): GameNewHandDataProxy {
        if (this._instance == null) {
            this._instance = new GameNewHandDataProxy();
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
        return "GameNewHand";
    }

    //获取一个新的数据
    protected getNewData(): GameNewHandData {
        return new GameNewHandData();
    }
}