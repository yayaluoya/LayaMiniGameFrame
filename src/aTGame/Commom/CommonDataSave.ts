import RootLocalStorageSave from '../Data/RootLocalStorageSave';
import ComData from './ComData';

/**
 * 公共数据保存类
 */
export default class CommonDataSave extends RootLocalStorageSave<ComData> {
    //
    private static _instance: CommonDataSave;
    /** 单例 */
    public static get instance(): CommonDataSave {
        if (this._instance == null) {
            this._instance = new CommonDataSave();
        }
        return this._instance;
    }
    /** 数据单例 */
    public static get comData(): ComData {
        return this._instance._saveData;
    }

    //本地保存的数据
    private _saveData: ComData;

    /** 不允许外界实例化 */
    private constructor() {
        super();
    }

    /** 获取保存名称 */
    protected get _saveName(): string {
        return "->CommonDataSave<-";
    }

    // ** -------------------------------------------------------------------------------------- ** //

    // ** -------------------------------------------------------------------------------------- ** //

    // 初始化数据
    public InitData() {
        this._saveData = this._ReadFromFile();
    }

    //获取一个新的数据
    protected getNewData(): ComData {
        return new ComData();
    }

    /**
     * 保存数据到本地
     */
    public static SaveToDisk() {
        this._instance._SaveToDisk(this._instance._saveData);
    }
}