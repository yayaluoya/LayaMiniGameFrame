import ConManager from '../Control/ConManager';
import Scene from '../../aTGame/3D/Scene';
import SceneManager from '../../aTGame/3D/SceneManager';
import { Const } from '../Common/Const';
import EnvironmentManager from './EnvironmentManager';
import IRootManager from '../../aTGame/Manager/IRootManager';
import MesManager from './MesManager';
import { EEventScene } from '../EventEnum/EEventScene';
import { EEventUI } from '../EventEnum/EEventUI';
import LevelConfigProxy from '../ConfigProxy/LevelConfigProxy';
import { EOtherLevelName } from '../Enum/EOtherLevelName';
import GameDataProxyShell from '../GameDataShell/GameDataProxyShell';
/**
 * 关卡管理器
 * 3D游戏实际从这里开始，沟通外界创建和销毁场景
 */
export default class CustomsManager implements IRootManager {
    //
    private static m_instance: CustomsManager;
    /** 单例 */
    public static get instance(): CustomsManager {
        if (!this.m_instance) {
            this.m_instance = new CustomsManager();
        }
        return this.m_instance;
    }
    //
    private constructor() { }

    //是否初始化
    private m_ifInit: boolean = false;
    //记录场景
    private m_scene: Scene;
    //场景是否在加载
    private m_ifSceneBuild: boolean;
    //其他场景缓存
    private m_otherScene: { [index: string]: Scene } = {};

    /** 场景是否在加载 */
    public get ifSceneBuild(): boolean {
        return this.m_ifSceneBuild;
    }

    /**
     * 初始化,场景的一切都从这里开始
     */
    public init() {
        //
        this.m_ifSceneBuild = false;
        //初始化关卡数据
        GameDataProxyShell.instance.initCustoms(LevelConfigProxy.instance.getLevelNumber());
        //监听事件
        MesManager.instance.onEvent(EEventScene.GameLevelsBuild, this, this.gameLevelsBuild);
        MesManager.instance.onEvent(EEventScene.GameLevelsDelete, this, this.gameLevelsDelete);
        MesManager.instance.onEvent(EEventScene.GameOtherLevelsBuild, this, this.gameOtherLevelsBuild);
        MesManager.instance.onEvent(EEventScene.GameOtherLevelsDelete, this, this.gameOtherLevelsDelete);
    }

    /**
     * 初始场景构建
     */
    public initLevelBuild() {
        //直接构建关卡
        this.gameLevelsBuild();
    }

    /**
     * 游戏主场景构建
     */
    private gameLevelsBuild(_handler?: Laya.Handler) {
        //判断是否有场景在构建
        if (this.m_ifSceneBuild) {
            console.warn('有场景正在构建！');
            return;
        }
        //
        let lvId: number;
        //判断游戏是否已经初始化
        if (this.m_ifInit) {
            lvId = GameDataProxyShell.instance.gameData.onCustoms;
        } else {
            this.m_ifInit = true;
            // 获取默认关卡
            lvId = GameDataProxyShell.instance.getDefaultCustoms();
        }
        //
        let scene = SceneManager.instance.getSceneByLv(lvId);
        this.m_scene = scene;
        //构建场景
        this.m_ifSceneBuild = true;//开始加载
        //显示loading页面
        MesManager.instance.sendEvent(EEventScene.GameLevelsBuildBefore);
        MesManager.instance.sendEvent(EEventUI.SceneGameCustomsLoading, [-1]);
        scene.buildScene(Laya.Handler.create(this, this.customsProgress, null, false)).then((_sceneSpr: Laya.Sprite3D) => {
            //
            this.m_ifSceneBuild = false;//加载结束
            //设置环境管理器
            EnvironmentManager.instance.setEnvironment(this.m_scene.scene);
            //添加控制器
            ConManager.addScrCon(scene.scene);//依赖脚本的控制器
            ConManager.addCommonCon();//没有任何依赖的控制器
            //预加载场景
            if (Const.ifPreloadCustoms) {
                let _preloadCustoms: number = GameDataProxyShell.instance.getPreloadCustoms();
                SceneManager.instance.preloadSceneRes(_preloadCustoms);
            }
            this.onCustomsInit(lvId);
            //判断是否有构建完成回调
            if (_handler) {
                _handler.run();
            }
            //抛出事件场景初始化完成
            MesManager.instance.sendEvent(EEventScene.GameLevelsOnBuild);
        });
    }

    //关卡加载完成执行
    private onCustomsInit(_lvId: number) {
        //
    }

    /**
     * 关卡加载进度
     * @param _number 进度值，在0~1之间 
     */
    private customsProgress(_number: number) {
        //判断是否在加载
        if (!this.m_ifSceneBuild) return;
        if (typeof _number == 'undefined') {
            _number = 1;
        }
        //发送关卡加载事件
        MesManager.instance.sendEvent(EEventUI.SceneGameCustomsLoading, [_number * 100]);
    }

    //游戏结束销毁关卡
    private gameLevelsDelete() {
        //关卡删除前事件
        MesManager.instance.sendEvent(EEventScene.GameLevelsDeleteBefore);
        //销毁上一个场景
        if (this.m_scene && this.m_scene.scene) {
            this.m_scene.clearScene();
        }
        //
        this.m_scene = null;
        //抛出事件
        MesManager.instance.sendEvent(EEventScene.GameLevelsOnDelete);
    }

    /**
     * 游戏其他场景构建
     */
    private gameOtherLevelsBuild(_name: EOtherLevelName, _handler?: Laya.Handler) {
        //判断是否有场景在构建
        if (this.m_ifSceneBuild) {
            console.warn('有场景正在构建！');
            return;
        }
        let _scene: Scene = SceneManager.instance.getOtherSceneByName(_name);
        this.m_otherScene[_name] = _scene;
        //构建场景
        this.m_ifSceneBuild = true;//开始加载
        //显示loading页面
        MesManager.instance.sendEvent(EEventScene.GameLevelsBuildBefore);
        MesManager.instance.sendEvent(EEventUI.SceneGameCustomsLoading, [-1]);
        _scene.buildScene(Laya.Handler.create(this, this.customsProgress, null, false)).then((_sceneSpr: Laya.Sprite3D) => {
            //
            this.m_ifSceneBuild = false;//加载结束
            //设置环境
            EnvironmentManager.instance.setOtherEnvironment(_name, _sceneSpr);
            //判断是否有构建完成回调
            if (_handler) {
                _handler.run();
            }
        });
    }

    /**
     * 游戏其他场景销毁
     */
    private gameOtherLevelsDelete(_name: EOtherLevelName) {
        let _scene = this.m_otherScene[_name];
        if (_scene) {
            _scene.clearScene();
            this.m_otherScene[_name] = undefined;
            //其他操作
        } else {
            console.warn('试图清除不存在的场景！');
        }
    }
}