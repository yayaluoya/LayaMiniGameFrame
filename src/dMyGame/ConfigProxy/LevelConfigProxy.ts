import { LevelConfig } from "../_config/LevelConfig";
import BaseConfigDataProxy from '../../aTGame/Config/RootDataProxy';

/**
 * 关卡数据处理类
 */
export default class LevelConfigProxy extends BaseConfigDataProxy<LevelConfig.config>{
    //
    private static _instance: LevelConfigProxy;
    /** 单例 */
    public static get instance(): LevelConfigProxy {
        if (this._instance == null) {
            this._instance = new LevelConfigProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    // 初始化
    protected initData() {
        //
        this.m_dataList = LevelConfig.dataList;
    }

    /**
     * 获取关卡数量
     */
    public getLevelNumber(): number {
        let _number: number = 0;
        this.m_dataList.forEach((item) => {
            if (item.id > 0) {
                _number++;
            }
        });
        //
        return _number;
    }

    /**
     * 通过关卡id获取关卡数据
     * @param _id id
     */
    public byIdGetData(_id: number): LevelConfig.config {
        return this.m_dataList.find((item) => {
            return item.id == _id;
        });
    }
}