import RootLocalStorageSave from '../../aTGame/Data/RootLocalStorageSave';
import GameNewHandData from './GamePropData';

/**
 * 新手引导数据保存类
 */
export default class GameNewHandDataSave extends RootLocalStorageSave<GameNewHandData>{
    private _saveData: GameNewHandData; // 需要保存的数据
    //
    private static _instance: GameNewHandDataSave;
    /** 单例 */
    public static get instance(): GameNewHandDataSave {
        if (this._instance == null) {
            this._instance = new GameNewHandDataSave();
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
        return "->GameNewHandDataSave<-";
    }

    // 初始化
    public InitData() {
        this._saveData = this._ReadFromFile();
    }

    /** 
     * 获取数据的副本
     */
    public static get propData(): GameNewHandData {
        return this._instance._saveData.clone();
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