import RootShortProxy from '../../aTGame/Data/RootShortProxy';
import GameShortData from './GameShortData';

/**
 * 临时数据保存类
 */
export default class GameShortDataProxy extends RootShortProxy<GameShortData>{
    //
    private static _instance: GameShortDataProxy;
    /** 单例 */
    public static get instance(): GameShortDataProxy {
        if (this._instance == null) {
            this._instance = new GameShortDataProxy();
        }
        //
        return this._instance;
    }

    //
    private _shortData: GameShortData; // 临时数据

    /** 不允许外界实例化 */
    private constructor() {
        super();
    }

    // 初始化
    public InitData() {
        this._shortData = new GameShortData();
    }

    /** 临时数据 */
    public get shortData(): GameShortData {
        return this._shortData;
    }

    // ** -------------------------------------------------------------------------------------- ** //

    /**
     * 清空临时数据
     */
    public static emptyGameOnCustomData() {
        this._instance._shortData = new GameShortData();
    }
}