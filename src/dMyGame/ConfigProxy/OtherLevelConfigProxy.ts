import BaseConfigDataProxy from '../../aTGame/Config/RootDataProxy';
import { OtherLevelConfig } from "../_config/OtherLevelConfig";

/**
 * 其他非主关卡数据处理类
 */
export default class OtherLevelConfigProxy extends BaseConfigDataProxy<OtherLevelConfig.config>{
    //
    private static _instance: OtherLevelConfigProxy;
    /** 单例 */
    public static get instance(): OtherLevelConfigProxy {
        if (this._instance == null) {
            this._instance = new OtherLevelConfigProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    // 初始化
    protected initData() {
        //
        this.m_dataList = OtherLevelConfig.dataList;
    }

    /**
     * 通过关卡id获取关卡数据
     * @param _id id
     */
    public byIdGetData(_id: number): OtherLevelConfig.config {
        return this.m_dataList.find((item) => {
            return item.id == _id;
        });
    }

    /**
     * 通过关卡名字获取数据
     * @param _name 关卡名字
     */
    public byNameGetData(_name: string): OtherLevelConfig.config {
        return this.m_dataList.find((item) => {
            return item.name == _name;
        });
    }
}