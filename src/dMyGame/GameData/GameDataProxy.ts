import RootLocalStorageProxy from '../../aTGame/Data/RootLocalStorageProxy';
import GameData from './GameData';

/**
 * 数据保存类
 */
export default class GameDataProxy extends RootLocalStorageProxy<GameData>{
    //
    private static _instance: GameDataProxy;
    /** 单例 */
    public static get instance(): GameDataProxy {
        if (this._instance == null) {
            this._instance = new GameDataProxy();
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
        return "Game";
    }

    //获取一个新的数据
    protected getNewData(): GameData {
        return new GameData();
    }
}