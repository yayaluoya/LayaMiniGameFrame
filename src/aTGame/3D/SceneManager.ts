import ResLoad from '../Res/ResLoad';
import Scene from "./Scene";
import SceneManagerProxy from "./SceneManagerProxy";
import { ECommonLeve } from '../Commom/CommonLeveEnum';
import FrameLevelConfig, { IFrameLevelData } from '../../cFrameBridge/Config/FrameLevelConfig';
import EssentialResUrls from '../Res/EssentialResUrls';
import IRootManager from '../Manager/IRootManager';
import { ISceneNode } from './SceneUtils';
import ConsoleEx from '../Console/ConsoleEx';

/**
 * 场景3d可取出关卡中的所有东西
 */
export default class SceneManager implements IRootManager {
    //
    private static _instance: SceneManager;
    /** 单例 */
    public static get instance(): SceneManager {
        if (this._instance == null) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }

    // 关卡配置数据
    private _levelConfig: { [index: string]: ISceneNode } = {};

    // 场景实例缓存
    private _scenes: { [index: string]: Scene } = {};

    //初始化
    private constructor() {
        //设置代理类代理数据
        SceneManagerProxy.sevelConfig = this._levelConfig;
    }

    //
    public init() { }

    /**
     * 初始化配置
     */
    public initConfig() {
        let url: string = EssentialResUrls.levelConfigURL;
        //这里必须不使用克隆资源
        let config = ResLoad.Get(url, true);
        //
        if (config.root) {
            //获取根节点下的节点
            for (let i = 0; i < config.root.length; i++) {
                let data: ISceneNode = config.root[i] as ISceneNode;
                this._levelConfig[data.name] = data;
            }
        }
        //清理资源缓存只使用一次
        ResLoad.Unload(url);
    }

    /**
     * 获取所有预加载资源路径列表,在游戏开始前加载
     * @param urls 资源集
     */
    public Preload(urls: string[]) {
        // 当前 关卡 初始化
        let preloadUrls = this.getSceneByLv(ECommonLeve.PrestrainLeveId).scenePrefabUrl();
        //添加进数组
        urls.push(...preloadUrls);
    }

    /**
     * 根据场景id预加载关卡资源
     * @param id 关卡id
     */
    public preloadSceneRes(id: number) {
        console.log(...ConsoleEx.packLog('预加载关卡->', id));
        //
        this.getSceneByLv(id).loadRes();
    }

    /**
     * 通过id获取关卡
     * @param id 关卡id
     */
    public getSceneByLv(id: number): Scene {
        let lvConfig: IFrameLevelData = FrameLevelConfig.byLevelIdGetLevelData(id);
        if (!lvConfig) {
            console.log(...ConsoleEx.packError("不存在此关卡->", id));
        }
        let _key: string = id + '$ID';//加一个后缀避免重名
        //查看缓存
        if (!this._scenes[_key]) {
            //创建场景实例
            this._scenes[_key] = this.getSceneByData(lvConfig);
        }
        return this._scenes[_key];
    }

    /**
     * 通过关卡名字获取其他关卡
     * @param _name 关卡名字
     */
    public getOtherSceneByName(_name: string): Scene {
        let lvConfig: IFrameLevelData = FrameLevelConfig.byLevelNameGetOtherLevelData(_name);
        if (!lvConfig) {
            console.log(...ConsoleEx.packError("不存在此关卡->", _name));
        }
        let _key: string = _name + '$NAME';//加一个后缀避免重名
        //查看缓存
        if (!this._scenes[_key]) {
            //创建场景实例
            this._scenes[_key] = this.getSceneByData(lvConfig);
        }
        return this._scenes[_key];
    }

    //通过关卡数据构建关卡
    private getSceneByData(_lvConfig: IFrameLevelData): Scene {
        //获取该关卡名字
        let sceneName: string[] = _lvConfig.sceneName;
        //获取该关卡其他资源加载名字
        let _sceneName_: string[] = _lvConfig.sceneOtherRes;
        //
        let sceneNodes: { [index: string]: ISceneNode } = {};
        let sceneNodes_: ISceneNode[] = [];
        //获取需要加载和预加载的节点
        for (let _i in this._levelConfig) {
            if (sceneName.findIndex((item) => { return item == _i }) != -1) {
                sceneNodes[_i] = this._levelConfig[_i];
            }
            if (_sceneName_.findIndex((item) => { return item == _i }) != -1) {
                sceneNodes_.push(this._levelConfig[_i]);
            }
        }
        return new Scene(sceneNodes, sceneNodes_, _lvConfig.sceneKey);
    }

    /**
     * 通过关卡id获取该关卡所有预制体资源名字
     * @param id 关卡id
     */
    public getLvResName(id: number): string[] {
        return this.getSceneByLv(id).scenePrefabResName();
    }

    /**
     * 通过关卡id获取该关卡所有预制体资源路径列表
     * @param id 关卡id
     */
    public getLvResUrl(id: number): string[] {
        return this.getSceneByLv(id).scenePrefabUrl();
    }
}