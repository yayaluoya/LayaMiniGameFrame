import BaseConfigDataProxy from "../../aTGame/Config/RootDataProxy";
import { OtherEnvironmentConfig } from "../_config/OtherEnvironmentConfig";
/**
 * 其他关卡环境数据处理类
 */
export default class OtherEnvironmentConfigProxy extends BaseConfigDataProxy<OtherEnvironmentConfig.config> {
    //
    private static _instance: OtherEnvironmentConfigProxy;
    /** 单例 */
    public static get instance(): OtherEnvironmentConfigProxy {
        if (this._instance == null) {
            this._instance = new OtherEnvironmentConfigProxy();
        }
        return this._instance;
    }
    //
    private constructor() {
        super();
    }

    //初始化
    protected initData() {
        this.m_dataList = OtherEnvironmentConfig.dataList;
    }

    /**
     * 通过关卡id获取环境数据
     * @param _id id
     */
    public byLevelIdGetData(_id: number): OtherEnvironmentConfig.config {
        return this.m_dataList.find((item) => {
            return item.id == _id;
        });
    }

    /**
     * 关卡名字获取数据
     * @param _name 关卡名字
     */
    public byLevelNameGetData(_name: string): OtherEnvironmentConfig.config {
        return this.m_dataList.find((item) => {
            return item.name == _name;
        });
    }
}
