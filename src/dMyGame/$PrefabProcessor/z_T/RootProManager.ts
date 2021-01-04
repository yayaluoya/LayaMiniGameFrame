import BasePrefabPro from './pro/BasePrefabPro';
import { EProcessor } from '../c_Enum/EProcessor';
import { EOtherLevelName } from '../../Enum/EOtherLevelName';
import { IPrefabsGather } from 'src/aTGame/3D/SceneUtils';
/**
 * 加工者管理类基类
 */
export default class RootProManager {
    //加工者列表
    protected m_proList: { [index: string]: BasePrefabPro };

    /**
     * 获取某个加工者
     * @param _pro 加工者名字枚举
     */
    public getPro<_Pro extends BasePrefabPro>(_pro: EProcessor): _Pro {
        return this.m_proList[_pro] as _Pro;
    }

    /**
     * 初始化方法，在注册加工者前，初始化加工者列表后
     */
    protected init() {
        //
    }

    /**
     * 初始化加工者管理器
     */
    public constructor() {
        this.m_proList = {};
        //
        this.init();
        //注册所有的加工者
        this.register();
    }

    //注册所有加工者
    protected register() {
        //
    }

    /**
     * 分配场景中的所有精灵
     * @param _prefabs 精灵列表
     */
    public AllotPre(_prefabs: IPrefabsGather) {
        //分配预制体
        this.allotPrefab(_prefabs);
        //分配调度者
        this.allotMediator();
    }

    //分配预制体
    protected allotPrefab(_prefabs: IPrefabsGather) {
        //
    }

    //分配调度者
    protected allotMediator() {
        //
    }

    /**
     * 分配其他场景中的所有精灵
     * @param _prefabs 精灵列表
     */
    public AllotOtherScenePre(_sceneName: EOtherLevelName, _prefabs: IPrefabsGather) {
        //分配预制体
        this.allotOtherScenePrefab(_sceneName, _prefabs);
        //分配调度者
        this.allotOtherSceneMediator(_sceneName);
    }

    //分配其他关卡预制体
    protected allotOtherScenePrefab(_sceneName: EOtherLevelName, _prefabs: IPrefabsGather) {
        //
    }

    //分配其他关卡调度者
    protected allotOtherSceneMediator(_sceneName: EOtherLevelName) {
        //
    }
}