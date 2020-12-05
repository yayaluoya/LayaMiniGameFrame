import { EnvironmentConfig } from "../_config/EnvironmentConfig";
import BaseConfigDataProxy from "../../aTGame/Config/RootDataProxy";
/**
 * 环境数据处理类
 */
export default class EnvironmentConfigProxy extends BaseConfigDataProxy<EnvironmentConfig.config> {
    //
    private static _instance: EnvironmentConfigProxy;
    /** 单例 */
    public static get instance(): EnvironmentConfigProxy {
        if (this._instance == null) {
            this._instance = new EnvironmentConfigProxy();
        }
        return this._instance;
    }
    //
    private constructor() {
        super();
    }

    //初始化
    protected initData() {
        this.m_dataList = EnvironmentConfig.dataList;
    }

    /**
     * 通过关卡id获取环境数据
     * @param _id id
     */
    public byLevelIdGetData(_id: number): EnvironmentConfig.config {
        return this.m_dataList.find((item) => {
            return item.id == _id;
        });
    }
}
