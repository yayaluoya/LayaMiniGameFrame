import RootLocalStorageProxy from '../Data/RootLocalStorageProxy';
import ComData from './ComData';

/**
 * 公共数据保存类
 */
export default class CommonDataProxy extends RootLocalStorageProxy<ComData> {
    //
    private static _instance: CommonDataProxy;
    /** 单例 */
    public static get instance(): CommonDataProxy {
        if (this._instance == null) {
            this._instance = new CommonDataProxy();
        }
        return this._instance;
    }
    /** 数据单例 */
    public static get comData(): ComData {
        return this._instance._saveData;
    }

    /** 不允许外界实例化 */
    private constructor() {
        super();
    }

    /** 获取保存名称 */
    protected get _saveName(): string {
        return "->CommonData<-";
    }

    // ** -------------------------------------------------------------------------------------- ** //

    // ** -------------------------------------------------------------------------------------- ** //

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