import ResLoad from '../Res/ResLoad';
import Scene from "./Scene";
import SceneManagerProxy from "./SceneManagerProxy";
import FrameLevelConfig, { IFrameLevelData } from '../../cFrameBridge/Config/FrameLevelConfig';
import IRootManager from '../Manager/IRootManager';
import { ISceneConfig, ISceneNode } from './SceneUtils';
import ConsoleEx from '../Console/ConsoleEx';
import { ELevelSceneName } from '../../cFrameBridge/Config/ELevelSceneName';
import EssentialResUrls from '../Res/EssentialResUrls';
import FrameLevelConst from '../../cFrameBridge/Config/FrameLevelConst';

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
    private _levelConfig: {
        [_index: string]: { [index: string]: ISceneNode },
    } = {};

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
        let url: string;
        let config: ISceneConfig;
        for (let _i in ELevelSceneName) {
            url = ELevelSceneName[_i];
            if (!url) {
                continue;
            }
            url = EssentialResUrls.levelConfigURL(url);
            //这里必须不使用克隆资源
            config = ResLoad.Get(url, true);
            //判断有没有压缩
            if (config.zip) {
                //解压
                let _time = Date.now();
                config.root = JSON.parse(pako.inflate(config.root, { to: 'string' }));
                _time = Date.now() - _time;
                //判断解压时间差
                if (_time > 500) {
                    console.warn(...ConsoleEx.packWarn('配置表解压时间过长', url, _time));
                }
            }
            // console.log(config.root);
            //
            if (config.root) {
                this._levelConfig[ELevelSceneName[_i]] = {};
                //获取根节点下的节点
                for (let i = 0; i < config.root.length; i++) {
                    let data: ISceneNode = config.root[i] as ISceneNode;
                    this._levelConfig[ELevelSceneName[_i]][data.name] = data;
                }
            } else {
                console.error(...ConsoleEx.packError('找不到配置表root节点数据', url));
            }
            //清理资源缓存只使用一次
            ResLoad.Unload(url);
        }
    }

    /**
     * 获取所有预加载资源路径列表,在游戏开始前加载
     * @param urls 资源集
     */
    public Preload(urls: string[]) {
        let _preloadUrls: string[] = [];
        // 当前 关卡 初始化
        FrameLevelConst.PrestrainLeveId.forEach((item) => {
            _preloadUrls.push(...this.getOtherSceneByName(item).scenePrefabUrl());
        });
        //添加进数组
        urls.push(..._preloadUrls);
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
     * 根据场景名字预加载其它关卡资源
     * @param name 关卡名字
     */
    public preloadOtherSceneRes(name: string) {
        console.log(...ConsoleEx.packLog('预加载其它关卡->', name));
        //
        this.getOtherSceneByName(name).loadRes();
    }

    /**
     * 通过id获取关卡
     * @param id 关卡id
     */
    public getSceneByLv(id: number): Scene {
        let lvConfig: IFrameLevelData = FrameLevelConfig.byLevelIdGetLevelData(id);
        if (!lvConfig) {
            console.error(...ConsoleEx.packError("不存在此关卡->", id));
        }
        //查看缓存
        if (!this._scenes[lvConfig.key]) {
            //创建场景实例
            this._scenes[lvConfig.key] = this.getSceneByData(lvConfig);
        }
        return this._scenes[lvConfig.key];
    }

    /**
     * 通过关卡名字获取其他关卡
     * @param _name 关卡名字
     */
    public getOtherSceneByName(_name: string): Scene {
        let lvConfig: IFrameLevelData = FrameLevelConfig.byLevelNameGetOtherLevelData(_name);
        if (!lvConfig) {
            console.error(...ConsoleEx.packError("不存在此关卡->", _name));
        }
        //查看缓存
        if (!this._scenes[lvConfig.key]) {
            //创建场景实例
            this._scenes[lvConfig.key] = this.getSceneByData(lvConfig);
        }
        return this._scenes[lvConfig.key];
    }

    //通过关卡数据构建关卡
    private getSceneByData(_lvConfig: IFrameLevelData): Scene {
        let _data = this.getSceneConfig(_lvConfig);
        return new Scene(_data.sceneNodes, _data.sceneNodes_, _lvConfig);
    }

    // 获取场景配置数据
    private getSceneConfig(_lvConfig: IFrameLevelData): {
        sceneNodes: { [index: string]: ISceneNode },
        sceneNodes_: ISceneNode[],
    } {
        //获取该关卡名字
        let sceneName: string[] = _lvConfig.sceneName;
        //获取该关卡其他资源加载名字
        let _sceneName_: string[] = _lvConfig.sceneOtherRes;
        //
        let sceneNodes: { [index: string]: ISceneNode } = {};
        let sceneNodes_: ISceneNode[] = [];
        //获取需要加载和预加载的节点
        if (!this._levelConfig[_lvConfig.rootScene]) {
            console.error(...ConsoleEx.packError('没有找到场景-', _lvConfig.rootScene, ' 请先注册。'));
        }
        for (let _i in this._levelConfig[_lvConfig.rootScene]) {
            if (sceneName.findIndex((item) => { return item == _i }) != -1) {
                sceneNodes[_i] = this._levelConfig[_lvConfig.rootScene][_i];
            }
            if (_sceneName_.findIndex((item) => { return item == _i }) != -1) {
                sceneNodes_.push(this._levelConfig[_lvConfig.rootScene][_i]);
            }
        }
        //
        return {
            sceneNodes: sceneNodes,
            sceneNodes_: sceneNodes_,
        }
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