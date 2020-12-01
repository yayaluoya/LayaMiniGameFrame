import RootProManager from './z_T/RootProManager';
import { EProcessor } from './c_Enum/EProcessor';
import CameraPro from './d_SpecialPro/CameraPro';
import HeightFogCubePro from './d_SpecialPro/HeightFogCubePro';
import { ProManagerSprList } from './z_T/RootProManager';
import ProManagerProxy from './ProManagerProxy';
import EnvironmentManager from '../Manager/EnvironmentManager';
import PrefabNames from '../ResList/PrefabNames';
/**
 * 预制体工管理类
 */
export default class ProManager extends RootProManager {
    //单例
    private static _instance: ProManager;
    /** 单例对象 */
    public static get instance(): ProManager {
        if (this._instance) {
            return this._instance;
        } else {
            this._instance = new ProManager();
            return this._instance;
        }
    }
    //
    private constructor() { super(); }

    //初始化
    protected init() {
        //设置加工者代理
        ProManagerProxy.instance.ProList = this.m_proList;
    }

    //注册加工者
    protected register() {
        //默认加工者
        this.m_proList[EProcessor.CameraPro] = new CameraPro(EProcessor.CameraPro);
        this.m_proList[EProcessor.HeightFogCubePro] = new HeightFogCubePro(EProcessor.HeightFogCubePro);
        //
    }

    //分配预制体
    protected allotPrefab(_prefabs: ProManagerSprList) {
        //
        this.m_proList[EProcessor.CameraPro].startPor({ [PrefabNames.Camera]: [EnvironmentManager.instance.camera] });
        this.m_proList[EProcessor.HeightFogCubePro].startPor({ [PrefabNames.HeightFog]: _prefabs[PrefabNames.HeightFog] });
        //开始分配
    }

    //分配调度者
    protected allotMediator() {
        //
    }
}