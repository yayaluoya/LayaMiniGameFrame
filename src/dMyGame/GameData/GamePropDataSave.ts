import RootLocalStorageSave from '../../aTGame/Data/RootLocalStorageSave';
import GamePropData from './GamePropData';

/**
 * 道具数据保存类
 */
export default class GamePropDataSave extends RootLocalStorageSave<GamePropData>{
    private _saveData: GamePropData; // 需要保存的数据
    //
    private static _instance: GamePropDataSave;
    /** 单例 */
    public static get instance(): GamePropDataSave {
        if (this._instance == null) {
            this._instance = new GamePropDataSave();
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
        return "->GamePropDataSave<-";
    }

    // 初始化
    public InitData() {
        this._saveData = this._ReadFromFile();
    }

    /** 
     * 获取数据的副本
     */
    public static get propData(): GamePropData {
        return this._instance._saveData.clone();
    }

    // ** -------------------------------------------------------------------------------------- ** //

    /**
     * 加金币
     * @param num 金币数量
     */
    public static addCoin(num: number) {
        //化整
        num = Math.floor(num);
        //增加临时数据
        this._instance._saveData.coinCount += num;
        if (this._instance._saveData.coinCount < 0) {
            this._instance._saveData.coinCount = 0;
        }
        this.SaveToDisk();
    }

    // ** -------------------------------------------------------------------------------------- ** //

    //获取一个新的数据
    protected getNewData(): GamePropData {
        return new GamePropData();
    }

    /**
     * 保存到本地 （改变本地数据时调用）
     */
    public static SaveToDisk() {
        this._instance._SaveToDisk(this._instance._saveData);
    }
}