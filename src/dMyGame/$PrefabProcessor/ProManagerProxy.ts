import RootClassProxy from "../../aTGame/Root/RootClassProxy";
import BasePrefabPro from './z_T/pro/BasePrefabPro';
import { EProcessor } from './c_Enum/EProcessor';
import CameraPro from './d_SpecialPro/CameraPro';

/**
 * ProManager代理类 代理ProManager类的一些数据
 */
export default class ProManagerProxy extends RootClassProxy {
    //单例
    private static _instance: ProManagerProxy;
    /** 单例对象 */
    public static get instance(): ProManagerProxy {
        if (this._instance) {
            return this._instance;
        } else {
            this._instance = new ProManagerProxy();
            return this._instance;
        }
    }
    //
    private constructor() { super(); }

    //加工者列表
    public ProList: { [index: string]: BasePrefabPro };

    /**
     * 获取某个加工者
     * @param _pro 加工者名字枚举
     */
    public getPro<_Pro extends BasePrefabPro>(_pro: EProcessor): _Pro {
        return this.ProList[_pro] as _Pro;
    }

    //* ----- 默认加工者----- * //

    /** 获取摄像机加工者 */
    public get cameraPro(): CameraPro {
        return this.getPro<CameraPro>(EProcessor.CameraPro);
    }

    //* ----- 其他加工者----- * //
}