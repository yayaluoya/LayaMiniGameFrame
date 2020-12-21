import RootLocalStorageProxy from '../../aTGame/Data/RootLocalStorageProxy';
import GamePropData from './GamePropData';

/**
 * 道具数据保存类
 */
export default class GamePropDataProxy extends RootLocalStorageProxy<GamePropData>{
    //
    private static _instance: GamePropDataProxy;
    /** 单例 */
    public static get instance(): GamePropDataProxy {
        if (this._instance == null) {
            this._instance = new GamePropDataProxy();
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
        return "GameProp";
    }

    //获取一个新的数据
    protected getNewData(): GamePropData {
        return new GamePropData();
    }
}