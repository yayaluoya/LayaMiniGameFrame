import RootLocalStorageProxy from '../../aTGame/Data/RootLocalStorageProxy';
import GameTestData from './GameTestData';


/**
 * 测试数据保存类
 */
export default class GameTestDataProxy extends RootLocalStorageProxy<GameTestData>{
    //
    private static _instance: GameTestDataProxy;
    /** 单例 */
    public static get instance(): GameTestDataProxy {
        if (this._instance == null) {
            this._instance = new GameTestDataProxy();
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
        return "GameTest";
    }

    //获取一个新的数据
    protected getNewData(): GameTestData {
        return new GameTestData();
    }
}