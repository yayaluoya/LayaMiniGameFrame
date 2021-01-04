import RootProManager from './z_T/RootProManager';
import { EProcessor } from './c_Enum/EProcessor';
import CameraPro from './d_SpecialPro/CameraPro';
import ProManagerProxy from './ProManagerProxy';
import EnvironmentManager from '../Manager/EnvironmentManager';
import PrefabNames from '../ResList/PrefabNames';
import { EOtherLevelName } from '../Enum/EOtherLevelName';
import { IPrefabsGather } from 'src/aTGame/3D/SceneUtils';
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
        //
    }

    //分配预制体
    protected allotPrefab(_prefabs: IPrefabsGather) {
        //
        this.m_proList[EProcessor.CameraPro].startPor({ [PrefabNames.Camera]: [EnvironmentManager.instance.camera] });
        //开始分配
    }

    //分配调度者
    protected allotMediator() {
        //
    }

    //分配其他关卡预制体
    protected allotOtherScenePrefab(_sceneName: EOtherLevelName, _prefabs: IPrefabsGather) {
        //
    }

    //分配其他关卡加工者调度者
    protected allotOtherSceneMediator(_sceneName: EOtherLevelName) {
        //
    }
}