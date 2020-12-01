import { SkinConfig } from "../_config/SkinConfig";
import BaseConfigDataProxy from "../../aTGame/Config/RootDataProxy";
/**
 * 皮肤数据处理类
 */
export default class SkinConfigProxy extends BaseConfigDataProxy<SkinConfig.config> {
    //
    private static _instance: SkinConfigProxy;
    /** 单例 */
    public static get instance(): SkinConfigProxy {
        if (this._instance == null) {
            this._instance = new SkinConfigProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    //初始化
    protected initData() {
        this.m_dataList = SkinConfig.dataList;
    }

    /**
     * 通过皮肤名字获取皮肤数据
     * @param _name 皮肤名字
     */
    public bySkinNameGetSkin(_name: string): SkinConfig.config {
        return this.m_dataList.find((item) => {
            return item.name == _name;
        });
    }

    /**
     * 根据皮肤id获取数据
     * @param _id 皮肤id
     */
    public bySkinIdGetSkin(_id: number): SkinConfig.config {
        return this.m_dataList.find((item) => {
            return item.id == _id;
        });
    }

    /**
     * 通过名字获取皮肤路径
     * @param _name 皮肤名字
     */
    public bySkinNameGetURL(_name: string): string {
        let _data: SkinConfig.config = this.bySkinNameGetSkin(_name);
        if (_data) {
            return _data.ImageURL;
        } else {
            //
            console.warn("没有找到该皮肤！");
            return "";
        }
    }

    /**
     * 通过皮肤id获取皮肤名字
     * @param _id 皮肤id
     */
    public bySkinIdGetName(_id: number): string {
        let _data: SkinConfig.config = this.bySkinIdGetSkin(_id);
        if (_data) {
            return _data.name;
        } else {
            console.warn("没有找到该皮肤！");
            return "";
        }
    }
}