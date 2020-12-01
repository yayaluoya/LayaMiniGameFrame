import { BaseConstDataProxy } from '../../aTGame/Config/RootDataProxy';
import { LightingConst } from '../_config/LightingConst';

/**
 * 摄像机配置数据代理
 */
export default class LightingConstProxy extends BaseConstDataProxy<LightingConst.config>{
    //
    private static _instance: LightingConstProxy;
    /** 单例 */
    public static get instance(): LightingConstProxy {
        if (this._instance == null) {
            this._instance = new LightingConstProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    //初始化
    protected initData() {
        this.m_data = LightingConst.data;
    }
}