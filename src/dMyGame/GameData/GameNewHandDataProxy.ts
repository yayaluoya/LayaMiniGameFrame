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

    /** 获取原始数据 */
    public static get rootData(): GameNewHandData {
        //
        return this._instance._saveData;
    }

    /** 
     * 获取数据的副本
     */
    public static get newHandData(): GameNewHandData {
        return this._instance._saveData.clone() as GameNewHandData;
    }

    // ** -------------------------------------------------------------------------------------- ** //

    // ** -------------------------------------------------------------------------------------- ** //

    //获取一个新的数据
    protected getNewData(): GameNewHandData {
        return new GameNewHandData();
    }

    /**
     * 保存到本地 （改变本地数据时调用）
     */
    public static SaveToDisk() {
        this._instance._SaveToDisk(this._instance._saveData);
    }
}