import { BaseConstDataProxy } from '../../aTGame/Config/RootDataProxy';
import { CameraConst } from '../_config/CameraConst';

/**
 * 摄像机配置数据代理
 */
export default class CameraConstProxy extends BaseConstDataProxy<CameraConst.config>{
    //
    private static _instance: CameraConstProxy;
    /** 单例 */
    public static get instance(): CameraConstProxy {
        if (this._instance == null) {
            this._instance = new CameraConstProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    //初始化
    protected initData() {
        this.m_data = CameraConst.data;
    }
}