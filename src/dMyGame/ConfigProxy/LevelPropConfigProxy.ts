import BaseConfigDataProxy from '../../aTGame/Config/RootDataProxy';
import { LevelPropConfig } from "../_config/LevelPropConfig";

/**
 * 关卡道具处理类
 */
export default class LevelPropConfigProxy extends BaseConfigDataProxy<LevelPropConfig.config>{
    //
    private static _instance: LevelPropConfigProxy;
    /** 单例 */
    public static get instance(): LevelPropConfigProxy {
        if (this._instance == null) {
            this._instance = new LevelPropConfigProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    // 初始化
    protected initData() {
        //
        this.m_dataList = LevelPropConfig.dataList;
    }

    //根据关卡id获取数据
    private byLevelIdGetData(_id: number): LevelPropConfig.config {
        return this.m_dataList.find((item) => {
            return item.id == _id;
        });
    }
}