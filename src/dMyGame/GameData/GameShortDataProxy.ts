import RootShortProxy from '../../aTGame/Data/RootShortProxy';
import GameOnCustomData from './shortData/GameOnCustomData';
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

    /**
     * 获取当前游戏临时数据的副本
     */
    public static get shortData(): GameShortData {
        //
        return this._instance._shortData.clone() as GameShortData;
    }

    // ** -------------------------------------------------------------------------------------- ** //

    /**
     * 获取当前关卡数据的可编辑版本
     */
    public static get getEditableOnCustomData(): GameOnCustomData {
        return this._instance._shortData.onCustomsData;
    }

    /**
     * 初始化临时数据
     */
    public static initShortData() {
        //
    }

    /**
     * 同步临时数据
     */
    public static syncShortData() { }

    /**
     * 清空临时数据
     */
    public static emptyGameOnCustomData() {
        this._instance._shortData = new GameShortData();
    }
}