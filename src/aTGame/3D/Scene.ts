import ResLoad from '../Res/ResLoad';
import SceneUtils, { IPrefabsGather, ISceneNode, IScenePrefab } from "./SceneUtils";
import GlobalUnitClassProxy from "./GlobalUnitClassProxy";
import EssentialResUrls from '../Res/EssentialResUrls';
import ConsoleEx from '../Console/ConsoleEx';
import ArrayUtils from '../Utils/ArrayUtils';
import { IFrameLevelData } from '../../cFrameBridge/Config/FrameLevelConfig';
/**
 * 场景类
 */
export default class Scene {
    //
    private _lvConfig: IFrameLevelData;//关卡数据
    private sceneNode: { [index: string]: ISceneNode };//关卡加载节点
    private sceneNode_: ISceneNode[];//关卡其他资源加载节点
    //预制体资源列表
    private _prefabRes: string[] = [];
    //场景根节点
    private _scene: Laya.Sprite3D;

    //附属资源列表
    private m_affiliateResURLs: string[] = [];

    /** 根据预制体分类的物品列表 */
    public prefabs: IPrefabsGather = {};

    /** 所有的物品 */
    public sprite3Ds: Laya.Sprite3D[] = [];

    /**
     * 初始化
     * @param sceneNode 关卡构建节点
     * @param sceneNode_ 关卡其他资源加载节点
     */
    constructor(sceneNode: { [index: string]: ISceneNode }, sceneNode_: ISceneNode[], _lvConfig: IFrameLevelData) {
        this.sceneNode = sceneNode;
        this.sceneNode_ = sceneNode_;
        this._lvConfig = _lvConfig;
    }

    /** 获取是否清除 */
    public get ifDestroy() {
        return !Boolean(this._scene);
    }

    /** 获取场景 */
    public get scene(): Laya.Sprite3D {
        return this._scene;
    }

    /** 设置附属资源列表 */
    public set affiliateResURLs(_URLs: string[]) {
        this.m_affiliateResURLs = _URLs;
    }

    /** 获取附属资源列表 */
    public get affiliateResURLs(): string[] {
        return this.m_affiliateResURLs;
    }

    /** 获取所有的资源路径列表 */
    public get allResURLs(): string[] {
        let _URLs: string[] = this.scenePrefabUrl();
        _URLs.push(...this.m_affiliateResURLs);
        return _URLs;
    }

    /**
     * 添加附属资源
     * @param _URLs 资源列表
     */
    public addAffiliateResURLs(_URLs: string[]) {
        if (_URLs.length <= 0) { return; }
        this.m_affiliateResURLs.push(..._URLs);
        //去重
        this.m_affiliateResURLs = ArrayUtils.Unique<string>(this.m_affiliateResURLs);
    }

    /**
     * 异步加载资源
     * @param onProgress 加载进度回调
     */
    public loadRes(onProgress: Laya.Handler = null): Promise<void> {
        return ResLoad.LoadAsync(this.allResURLs, onProgress);
    }

    /**
     * 异步构建场景
     * @param onProgress 构建进度
     */
    public buildScene(onProgress: Laya.Handler = null): Promise<Laya.Sprite3D> {
        return new Promise<Laya.Sprite3D>((r: Function) => {
            if (this._scene) {
                console.warn(...ConsoleEx.packWarn('重复构建关卡，请注意'));
                r(this._scene);
                return;
            }
            console.log(...ConsoleEx.packLog('开始构建关卡->' + this._lvConfig.key));
            //同步加载资源
            this.loadRes(onProgress).then(() => {
                //
                let _time = Date.now();
                //
                this._scene = new Laya.Sprite3D();
                GlobalUnitClassProxy.s3d.addChild(this._scene);
                //构建场景
                for (let _i in this.sceneNode) {
                    let _spr: Laya.Sprite3D = new Laya.Sprite3D();
                    _spr.name = _i;
                    this._scene.addChild(_spr);
                    this._buildScene(this.sceneNode[_i], _spr);
                }
                //
                console.log(...ConsoleEx.packLog('关卡->' + this._lvConfig.key + '构建完成'));
                console.log('关卡->' + this._lvConfig.key, '\n场景->', this._scene, '\n预制体->', this.prefabs, '\n物体->', this.sprite3Ds);
                //返回场景
                r(this._scene);
                //
                _time = Date.now() - _time;
                //判断构建时间差
                if (_time > 1000) {
                    console.warn(...ConsoleEx.packWarn('场景构建时间过长', this._lvConfig.key, _time));
                }
            });
        });
    }

    /**
     * 清除场景
     */
    public clearScene() {
        //判断是否有场景
        if (this._scene) {
            console.log(...ConsoleEx.packLog('清除关卡->' + this._lvConfig.key));
            //
            this._scene.destroy();
            //
            this._prefabRes = [];
            this.prefabs = {};
            this._scene = null;
            this.sprite3Ds = [];
        }
    }

    //* ---------- *//

    /**
     * 场景所有预制体资源地址列表
     */
    public scenePrefabUrl(): string[] {
        let resUrl: string[] = [];
        let resName: string[] = this.scenePrefabResName();
        resName && resName.forEach((name: string) => {
            resUrl.push(EssentialResUrls.prefab_url(name));
        })
        return resUrl;
    }

    /**
     * 获取场景中所有直接加载预制体名字
     */
    public sceneDirectPrefabUrl(): string[] {
        let resUrl: string[] = [];
        let resName: string[] = this.sceneDirectPrefabResName();
        resName && resName.forEach((name: string) => {
            resUrl.push(EssentialResUrls.prefab_url(name));
        })
        return resUrl;
    }

    /**
     * 获取场景中所有预加载预制体名字
     */
    public scenePreloadPrefabUrl(): string[] {
        let resUrl: string[] = [];
        let resName: string[] = this.scenePreloadPrefabResName();
        resName && resName.forEach((name: string) => {
            resUrl.push(EssentialResUrls.prefab_url(name));
        })
        return resUrl;
    }

    /**
     * 关卡预制体资源名字列表
     */
    public scenePrefabResName(): string[] {
        //判断长度
        let _length: number = 0;
        for (let _i in this.sceneNode) {
            _length++;
        }
        if (_length == 0) { console.error(...ConsoleEx.packError('关卡->' + this._lvConfig.key + '<-不存在,或者是没有内容')); return; }
        if (!this._prefabRes || this._prefabRes.length <= 0) {
            //判断需要构建的节点
            for (let _i in this.sceneNode) {
                this._getPrefabName(this._prefabRes, this.sceneNode[_i]);
            }
            //判断是否有其它资源需要加载
            if (this.sceneNode_ && this.sceneNode_.length > 0) {
                //
                this.sceneNode_.forEach((item) => {
                    this._getPrefabName(this._prefabRes, item);
                });
            }
        }
        return this._prefabRes;
    }

    /**
     * 获取场景中所有直接加载的预制体名字列表
     */
    public sceneDirectPrefabResName(): string[] {
        let _prefabNames: string[] = [];
        //
        for (let _i in this.sceneNode) {
            this._getPrefabName(_prefabNames, this.sceneNode[_i]);
        }
        //
        return _prefabNames;
    }

    /**
     * 获取场景中所有预加载预制体名字列表
     */
    public scenePreloadPrefabResName(): string[] {
        let _prefabNames: string[] = [];
        //
        this.sceneNode_.forEach((item) => {
            this._getPrefabName(_prefabNames, item);
        });
        //
        return _prefabNames;
    }

    //* ------------------------------------------------------ *//

    // 获取预制体名字
    private _getPrefabName(spArr: string[], node: ISceneNode | IScenePrefab) {
        if (node) {
            let prefabName = (node as IScenePrefab).prefabName;
            if (prefabName) {
                node = node as IScenePrefab;
                if (spArr.indexOf(prefabName) < 0) {
                    spArr.push(prefabName);
                }
            }
            else {
                node = node as ISceneNode;
                if (node.child) {
                    node.child.forEach((nodeChild: ISceneNode | IScenePrefab) => {
                        this._getPrefabName(spArr, nodeChild as any);
                    });
                }
            }
        }
    }

    // 构建场景
    private _buildScene(node: ISceneNode | IScenePrefab, parent: Laya.Sprite3D) {
        //获取预制体名字
        let prefabName = (node as IScenePrefab).prefabName;
        if (prefabName) {
            node = node as IScenePrefab;
            let sprite: Laya.Sprite3D = ResLoad.Get(EssentialResUrls.prefab_url(prefabName));
            if (sprite) {
                SceneUtils.initNode(sprite, node);
                parent.addChild(sprite);
                this.prefabs[prefabName] = this.prefabs[prefabName] || [];
                this.prefabs[prefabName].push(sprite);
                this.sprite3Ds.push(sprite);
            }
        }
        else {
            node = node as ISceneNode;
            if (node.child) {
                let nodeSp = new Laya.Sprite3D();
                SceneUtils.initNode(nodeSp, node);
                parent.addChild(nodeSp);
                node.child.forEach((nodeChild: ISceneNode | IScenePrefab) => {
                    this._buildScene(nodeChild, nodeSp);
                })
            }
        }
    }
}