(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class ConManager {
        static addScrCon(_scene) {
        }
        static addCommonCon() {
        }
    }

    class ConsoleConst {
    }
    ConsoleConst.logStyle = `
        color: #fff;
        background-color: #8d93ab;
        border-radius: 3px;
        line-height: 15px;
        `;
    ConsoleConst.logLightStyle = `
        color: #52575d;
        background-color: #EBEBEB;
        border-radius: 3px;
        line-height: 15px;
        `;
    ConsoleConst.comStyle = `
        color: #fff;
        background-color: #ade498;
        border-radius: 3px;
        line-height: 15px;
        `;
    ConsoleConst.warnStyle = `
        color: #5c6e06;
        background-color: #ffa931;
        border-radius: 3px;
        line-height: 15px;
        `;
    ConsoleConst.errorStyle = `
        color: #fff;
        background-color: #ec0101;
        border-radius: 3px;
        line-height: 15px;
        `;
    ConsoleConst.platformStyle = `
        color: #52575d;
        background-color: #e3fdfd;
        border-radius: 3px;
        line-height: 15px;
        `;

    class ConsoleEx {
        static log(...any) {
            console.log(`%c ${any}`, ConsoleConst.logStyle);
        }
        static warn(...any) {
            console.log(`%c ${any}`, ConsoleConst.warnStyle);
        }
        static error(...any) {
            console.log(`%c ${any}`, ConsoleConst.errorStyle);
        }
        static packLog(...any) {
            return [`%c ${any} `, ConsoleConst.logStyle];
        }
        static packLogLight(...any) {
            return [`%c ${any} `, ConsoleConst.logLightStyle];
        }
        static comLog(...any) {
            return [`%c ${any} `, ConsoleConst.comStyle];
        }
        static packWarn(...any) {
            return [`%c 警告: ${any} `, ConsoleConst.warnStyle];
        }
        static packError(...any) {
            return [`%c 错误: ${any} `, ConsoleConst.errorStyle];
        }
        static packPlatform(...any) {
            return [`%c 平台: ${any} `, ConsoleConst.platformStyle];
        }
    }

    class ResLoad {
        static Load(urls, onCompleted, onProgress = null) {
            if (onProgress && onProgress.once) {
                onProgress.once = false;
            }
            if (!urls || urls.length == 0) {
                onCompleted.run();
                onProgress.run();
                return;
            }
            Laya.loader.create(urls, onCompleted, onProgress);
        }
        static Load2d(urls, onCompleted, onProgress = null) {
            if (onProgress && onProgress.once) {
                onProgress.once = false;
            }
            if (!urls || urls.length == 0) {
                onCompleted.run();
                onProgress.run();
                return;
            }
            Laya.loader.load(urls, onCompleted, onProgress);
        }
        static LoadAsync(urls, onProgress = null) {
            return new Promise((resolve) => {
                ResLoad.Load(urls, Laya.Handler.create(null, () => {
                    resolve();
                }), onProgress);
            });
        }
        static Load2dAsync(urls, onProgress = null) {
            return new Promise(function (resolve) {
                ResLoad.Load2d(urls, Laya.Handler.create(null, () => {
                    resolve();
                }), onProgress);
            });
        }
        static Get(resUrl, noClone = false) {
            let getRes = Laya.loader.getRes(resUrl);
            if (getRes == null) {
                console.log(...ConsoleEx.packError("资源尚未加载", resUrl));
                return null;
            }
            return noClone ? getRes : getRes.clone();
        }
        static LoadAndGet(resUrl, noClone = false) {
            return new Promise((r) => {
                ResLoad.LoadAsync(resUrl).then((_data) => {
                    r(ResLoad.Get(resUrl, noClone));
                });
            });
        }
        static Unload(resUrl) {
            Laya.loader.clearRes(resUrl);
        }
    }

    class V3Utils {
        static parseVector3(str) {
            var strs = str.split(',');
            return new Laya.Vector3(Number(strs[0]), Number(strs[1]), Number(strs[2]));
        }
        static setV3Length(_v3, _l) {
            let _a = _l / Laya.Vector3.scalarLength(_v3);
            _v3.x = _v3.x * _a;
            _v3.y = _v3.y * _a;
            _v3.z = _v3.z * _a;
        }
        static PotLerpMove(_pos, _tragetPot, _lerp, _outV3, _initialLength) {
            if (!_outV3) {
                console.error('必须有一个输出的向量！');
                return;
            }
            let _distance = Laya.Vector3.distance(_pos, _tragetPot);
            Laya.Vector3.lerp(_pos, _tragetPot, _lerp, _outV3);
            return 1 - (_distance / _initialLength);
        }
        static PotConstantSpeedMove(_pos, _tragetPot, _speed, _outV3) {
            if (!_outV3) {
                console.error('必须有一个输出的向量！');
                return;
            }
            let _ifEnd;
            let _differV3 = new Laya.Vector3();
            Laya.Vector3.subtract(_tragetPot, _pos, _differV3);
            let _distance = Laya.Vector3.scalarLength(_differV3);
            if (_distance > _speed) {
                this.setV3Length(_differV3, _speed);
                _ifEnd = false;
            }
            else {
                _ifEnd = true;
            }
            Laya.Vector3.add(_pos, _differV3, _outV3);
            return _ifEnd;
        }
    }

    class SceneUtils {
        static initNode(_spr, _target) {
            _spr.name = _target.name;
            if (!_target.position) {
                _spr.transform.localPosition = new Laya.Vector3(0, 0, 0);
            }
            else {
                _spr.transform.localPosition = V3Utils.parseVector3(_target.position);
            }
            if (!_target.euler) {
                _spr.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            }
            else {
                _spr.transform.localRotationEuler = V3Utils.parseVector3(_target.euler);
            }
            if (!_target.scale) {
                _spr.transform.localScale = new Laya.Vector3(1, 1, 1);
            }
            else {
                _spr.transform.localScale = V3Utils.parseVector3(_target.scale);
            }
        }
    }

    class RootClassProxy {
        static get Datas() {
            return this.m_datas;
        }
        static set Datas(_data) {
            this.m_datas = _data;
        }
        static get Handlers() {
            return this.m_handlers;
        }
        static set Handlers(_handler) {
            this.m_handlers = _handler;
        }
    }
    RootClassProxy.m_ifSetProxy = false;

    class GlobalUnitClassProxy extends RootClassProxy {
    }

    class _AllPrefabNames {
        constructor() {
            this.Prefabs = '@Camera@@DirectionalLight@';
            this.Prefabs2 = '@Cube@@Sphere@@Cylinder@';
        }
    }

    var ELevelSceneName;
    (function (ELevelSceneName) {
        ELevelSceneName["Export"] = "export";
    })(ELevelSceneName || (ELevelSceneName = {}));
    class AllPrefabsNames extends _AllPrefabNames {
    }
    class LevelSceneNameConst {
        static get defaultLevelSceneName() {
            return ELevelSceneName.Export;
        }
    }

    var EKeyResName;
    (function (EKeyResName) {
        EKeyResName["RootRes"] = "res";
        EKeyResName["Config"] = "Config";
        EKeyResName["Font"] = "Font";
        EKeyResName["FGUI"] = "FGUI";
        EKeyResName["LvConfig"] = "LvConfig";
        EKeyResName["Other"] = "Other";
        EKeyResName["icon"] = "icon";
        EKeyResName["img"] = "img";
        EKeyResName["music"] = "music";
        EKeyResName["sound"] = "sound";
        EKeyResName["skin"] = "skin";
    })(EKeyResName || (EKeyResName = {}));

    class FrameCDNURL {
    }
    FrameCDNURL.CDNURLs = [];

    class FrameSubpackages {
    }
    FrameSubpackages.subpackages = [];

    class KeyResManager {
        constructor() {
            this.m_KeyResList = {};
            this.m_KeyResList_ = {};
            this.m_KeyResList = {
                [EKeyResName.RootRes]: EKeyResName.RootRes + '/',
                [EKeyResName.Config]: EKeyResName.RootRes + '/' + EKeyResName.Config + '/',
                [EKeyResName.FGUI]: EKeyResName.RootRes + '/' + EKeyResName.FGUI + '/',
                [EKeyResName.LvConfig]: EKeyResName.RootRes + '/' + EKeyResName.LvConfig + '/',
                [EKeyResName.Font]: EKeyResName.RootRes + '/' + EKeyResName.Font + '/',
                [EKeyResName.Other]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/',
                [EKeyResName.icon]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.icon + '/',
                [EKeyResName.img]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.img + '/',
                [EKeyResName.music]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.music + '/',
                [EKeyResName.sound]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.sound + '/',
                [EKeyResName.skin]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.skin + '/',
            };
            let _AllPrefabNames = new AllPrefabsNames();
            for (let _i in _AllPrefabNames) {
                EKeyResName[_i] = _i;
                this.m_KeyResList[EKeyResName[_i]] = EKeyResName.RootRes + '/' + EKeyResName[_i] + '/';
                console.log(...ConsoleEx.packLogLight('注入预制体资源路径', this.m_KeyResList[EKeyResName[_i]]));
            }
            for (let _i in this.m_KeyResList) {
                this.m_KeyResList_[_i] = this.m_KeyResList[_i];
            }
            this.setRes();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new KeyResManager();
            }
            return this._instance;
        }
        ;
        setRes() {
            for (let _o of FrameSubpackages.subpackages) {
                this.editKeyResList(_o.name, _o.root);
            }
            for (let _o of FrameCDNURL.CDNURLs) {
                this.editKeyResList(_o.name, _o.root);
            }
        }
        ifKeyRes(_key) {
            let _if = false;
            for (let _i in EKeyResName) {
                if (_key == EKeyResName[_i]) {
                    _if = true;
                    break;
                }
            }
            return _if;
        }
        getResURL(_key) {
            return this.m_KeyResList[_key];
        }
        editKeyResList(_key, _str) {
            let _replace = this.m_KeyResList_[_key];
            if (!_replace) {
                console.log(...ConsoleEx.packWarn('修改资源路径失败，没有' + _key + '这个关键路径！'));
                return;
            }
            else {
                console.log(...ConsoleEx.packLog('修改关键点资源路径', _replace, '替换成', _str));
            }
            for (let _i in this.m_KeyResList) {
                this.m_KeyResList[_i] = this.m_KeyResList[_i].replace(_replace, _str);
            }
            this.m_KeyResList_[_key] = _str;
        }
    }

    class EssentialResUrls {
        static EssentialOtherResUrl() {
            let _URLs = [];
            return _URLs;
        }
        static levelConfigURL(_name) {
            return KeyResManager.instance.getResURL(EKeyResName.LvConfig) + _name + '.json';
        }
        static ConfigURL(_name) {
            return KeyResManager.instance.getResURL(EKeyResName.Config) + _name;
        }
        static FGUIPack(_name) {
            return KeyResManager.instance.getResURL(EKeyResName.FGUI) + _name;
        }
        static fontURL(_name) {
            return KeyResManager.instance.getResURL(EKeyResName.Font) + _name;
        }
        static prefab_url(prefab) {
            for (let _i in this._AllPrefabsNames) {
                if (this._AllPrefabsNames[_i].indexOf('@' + prefab + '@') != -1) {
                    return KeyResManager.instance.getResURL(EKeyResName[_i]) + 'Conventional/' + prefab + '.lh';
                }
            }
            console.log(...ConsoleEx.packError('没有在场景找到预制体', prefab, '可能是没有导出场景预制体列表导致的。'));
        }
    }
    EssentialResUrls._AllPrefabsNames = new AllPrefabsNames();

    class ArrayUtils {
        static Unique(arr) {
            return Array.from(new Set(arr));
        }
        static ReverseReserveUnique(arr) {
            return Array.from(new Set(arr.reverse())).reverse();
        }
        static ObjUnique(arr, _F) {
            for (let i = 0, len = arr.length; i < len; i++) {
                for (let j = i + 1, len = arr.length; j < len; j++) {
                    if (_F(arr[i]) === _F(arr[j])) {
                        arr.splice(j, 1);
                        j--;
                        len--;
                    }
                }
            }
            return arr;
        }
        static Replace(arr, oldObj, newObj) {
            let index = arr.indexOf(oldObj);
            if (index < 0)
                return false;
            arr.splice(index, 1, newObj);
            return true;
        }
        static RemoveItem(arr, obj) {
            let index = arr.indexOf(obj);
            if (index < 0)
                return false;
            arr.splice(index, 1);
            return true;
        }
        static RemoveAt(arr, index) {
            if (arr.length <= index)
                return false;
            arr.splice(index, 1);
            return true;
        }
        static Contains(arr, obj) {
            let index = arr.indexOf(obj);
            return index >= 0;
        }
        static Copy(arr) {
            let result = [];
            for (let i = 0; i < arr.length; ++i) {
                result.push(arr[i]);
            }
            return result;
        }
        static upsetArray(_array) {
            _array.sort(() => {
                return Math.random() - 0.5;
            });
        }
        static RandomGet(_array, _n = 1, _weight = _array.map((item) => { return 1; })) {
            if (_array.length <= 0) {
                return;
            }
            let _rootArray = [];
            let _newArray = [];
            let _indexArray = [];
            let _minWeight = _weight[0];
            _weight.forEach((item) => {
                _minWeight = Math.min(_minWeight, item);
            });
            _weight = _weight.map((item) => {
                return Math.floor(item * (1 / _minWeight));
            });
            _array.forEach((item, index) => {
                _rootArray.push(item);
                for (let _i = 0; _i < _weight[index]; _i++) {
                    _indexArray.push(index);
                }
            });
            let _index;
            for (let _i = 0; _i < _n; _i++) {
                if (_rootArray.length <= 0) {
                    break;
                }
                _index = Math.floor(Math.random() * _indexArray.length);
                _indexArray = _indexArray.filter((item) => {
                    return item != _index;
                });
                _newArray.push(_rootArray.splice(_indexArray[_index], 1)[0]);
            }
            return _newArray;
        }
    }

    class Scene {
        constructor(sceneNode, sceneNode_, _lvConfig) {
            this._prefabRes = [];
            this.m_affiliateResURLs = [];
            this.prefabs = {};
            this.sprite3Ds = [];
            this.sceneNode = sceneNode;
            this.sceneNode_ = sceneNode_;
            this._lvConfig = _lvConfig;
        }
        get ifDestroy() {
            return !Boolean(this._scene);
        }
        get scene() {
            return this._scene;
        }
        set affiliateResURLs(_URLs) {
            this.m_affiliateResURLs = _URLs;
        }
        get affiliateResURLs() {
            return this.m_affiliateResURLs;
        }
        get allResURLs() {
            let _URLs = this.scenePrefabUrl();
            _URLs.push(...this.m_affiliateResURLs);
            return _URLs;
        }
        addAffiliateResURLs(_URLs) {
            if (_URLs.length <= 0) {
                return;
            }
            this.m_affiliateResURLs.push(..._URLs);
            this.m_affiliateResURLs = ArrayUtils.Unique(this.m_affiliateResURLs);
        }
        loadRes(onProgress = null) {
            return ResLoad.LoadAsync(this.allResURLs, onProgress);
        }
        buildScene(onProgress = null) {
            return new Promise((r) => {
                if (this._scene) {
                    console.log(...ConsoleEx.packWarn('重复构建关卡，请注意'));
                    r(this._scene);
                    return;
                }
                console.log(...ConsoleEx.packLog('开始构建关卡->' + this._lvConfig.key));
                this.loadRes(onProgress).then(() => {
                    this._scene = new Laya.Sprite3D();
                    GlobalUnitClassProxy.s3d.addChild(this._scene);
                    for (let _i in this.sceneNode) {
                        let _spr = new Laya.Sprite3D();
                        _spr.name = _i;
                        this._scene.addChild(_spr);
                        this._buildScene(this.sceneNode[_i], _spr);
                    }
                    console.log(...ConsoleEx.packLog('关卡->' + this._lvConfig.key + '构建完成'));
                    console.log('关卡->' + this._lvConfig.key, '\n场景->', this._scene, '\n预制体->', this.prefabs, '\n物体->', this.sprite3Ds);
                    r(this._scene);
                });
            });
        }
        clearScene() {
            if (this._scene) {
                console.log(...ConsoleEx.packLog('清除关卡->' + this._lvConfig.key));
                this._scene.destroy();
                this._prefabRes = [];
                this.prefabs = {};
                this._scene = null;
                this.sprite3Ds = [];
            }
        }
        scenePrefabUrl() {
            let resUrl = [];
            let resName = this.scenePrefabResName();
            resName && resName.forEach((name) => {
                resUrl.push(EssentialResUrls.prefab_url(name));
            });
            return resUrl;
        }
        sceneDirectPrefabUrl() {
            let resUrl = [];
            let resName = this.sceneDirectPrefabResName();
            resName && resName.forEach((name) => {
                resUrl.push(EssentialResUrls.prefab_url(name));
            });
            return resUrl;
        }
        scenePreloadPrefabUrl() {
            let resUrl = [];
            let resName = this.scenePreloadPrefabResName();
            resName && resName.forEach((name) => {
                resUrl.push(EssentialResUrls.prefab_url(name));
            });
            return resUrl;
        }
        scenePrefabResName() {
            let _length = 0;
            for (let _i in this.sceneNode) {
                _length++;
            }
            if (_length == 0) {
                console.log(...ConsoleEx.packError('关卡->' + this._lvConfig.key + '<-不存在,或者是没有内容'));
                return;
            }
            if (!this._prefabRes || this._prefabRes.length <= 0) {
                for (let _i in this.sceneNode) {
                    this._getPrefabName(this._prefabRes, this.sceneNode[_i]);
                }
                if (this.sceneNode_ && this.sceneNode_.length > 0) {
                    this.sceneNode_.forEach((item) => {
                        this._getPrefabName(this._prefabRes, item);
                    });
                }
            }
            return this._prefabRes;
        }
        sceneDirectPrefabResName() {
            let _prefabNames = [];
            for (let _i in this.sceneNode) {
                this._getPrefabName(_prefabNames, this.sceneNode[_i]);
            }
            return _prefabNames;
        }
        scenePreloadPrefabResName() {
            let _prefabNames = [];
            this.sceneNode_.forEach((item) => {
                this._getPrefabName(_prefabNames, item);
            });
            return _prefabNames;
        }
        _getPrefabName(spArr, node) {
            if (node) {
                let prefabName = node['prefabName'];
                if (prefabName) {
                    node = node;
                    if (spArr.indexOf(prefabName) < 0) {
                        spArr.push(prefabName);
                    }
                }
                else {
                    node = node;
                    if (node.child) {
                        node.child.forEach((nodeChild) => {
                            this._getPrefabName(spArr, nodeChild);
                        });
                    }
                }
            }
        }
        _buildScene(node, parent) {
            let prefabName = node["prefabName"];
            if (prefabName) {
                node = node;
                let sprite = ResLoad.Get(EssentialResUrls.prefab_url(prefabName));
                if (sprite) {
                    SceneUtils.initNode(sprite, node);
                    parent.addChild(sprite);
                    this.prefabs[prefabName] = this.prefabs[prefabName] || [];
                    this.prefabs[prefabName].push(sprite);
                    this.sprite3Ds.push(sprite);
                }
            }
            else {
                node = node;
                if (node.child) {
                    let nodeSp = new Laya.Sprite3D();
                    SceneUtils.initNode(nodeSp, node);
                    parent.addChild(nodeSp);
                    node.child.forEach((nodeChild) => {
                        this._buildScene(nodeChild, nodeSp);
                    });
                }
            }
        }
    }

    class SceneManagerProxy {
        static set sevelConfig(_data) {
            this.m_sevelConfig = _data;
        }
        static initCamera(camera, _sceneName = LevelSceneNameConst.defaultLevelSceneName) {
            let cameraData = this.m_sevelConfig[_sceneName]["camera"];
            if (cameraData) {
                SceneUtils.initNode(camera, cameraData);
            }
        }
        static initLight(light, _sceneName = LevelSceneNameConst.defaultLevelSceneName) {
            let lightData = this.m_sevelConfig[_sceneName]["light"];
            if (lightData) {
                SceneUtils.initNode(light, lightData);
            }
        }
    }
    SceneManagerProxy.m_sevelConfig = {};

    var LevelConfig;
    (function (LevelConfig) {
        class config {
        }
        LevelConfig.config = config;
        LevelConfig.path = "res/config/LevelConfig.json";
    })(LevelConfig || (LevelConfig = {}));

    class BaseDataProxy {
        constructor() {
            this.initData();
        }
        initData() {
        }
    }
    class BaseConfigDataProxy extends BaseDataProxy {
        get dataList() {
            return this.m_dataList;
        }
    }
    class BaseConstDataProxy extends BaseDataProxy {
        get data() {
            return this.m_data;
        }
    }

    class LevelConfigProxy extends BaseConfigDataProxy {
        constructor() { super(); }
        static get instance() {
            if (this._instance == null) {
                this._instance = new LevelConfigProxy();
            }
            return this._instance;
        }
        initData() {
            this.m_dataList = LevelConfig.dataList;
        }
        getLevelNumber() {
            let _number = 0;
            this.m_dataList.forEach((item) => {
                if (item.id > 0) {
                    _number++;
                }
            });
            return _number;
        }
        byIdGetData(_id) {
            return this.m_dataList.find((item) => {
                return item.id == _id;
            });
        }
    }

    var OtherLevelConfig;
    (function (OtherLevelConfig) {
        class config {
        }
        OtherLevelConfig.config = config;
        OtherLevelConfig.path = "res/config/OtherLevelConfig.json";
    })(OtherLevelConfig || (OtherLevelConfig = {}));

    class OtherLevelConfigProxy extends BaseConfigDataProxy {
        constructor() { super(); }
        static get instance() {
            if (this._instance == null) {
                this._instance = new OtherLevelConfigProxy();
            }
            return this._instance;
        }
        initData() {
            this.m_dataList = OtherLevelConfig.dataList;
        }
        byIdGetData(_id) {
            return this.m_dataList.find((item) => {
                return item.id == _id;
            });
        }
        byNameGetData(_name) {
            return this.m_dataList.find((item) => {
                return item.name == _name;
            });
        }
    }

    class FrameLevelConfig {
        static byLevelIdGetLevelData(_id) {
            let _levelConfigData = LevelConfigProxy.instance.byIdGetData(_id);
            return this.getLevelData('ID', _levelConfigData.sceneName, _levelConfigData.sceneOtherRes, _levelConfigData.rootScene);
        }
        static byLevelNameGetOtherLevelData(_name) {
            let _levelConfigData = OtherLevelConfigProxy.instance.byNameGetData(_name);
            return this.getLevelData('Name', _levelConfigData.sceneName, _levelConfigData.sceneOtherRes, _levelConfigData.rootScene);
        }
        static getLevelData(_key, _sceneName, _sceneOtherRes, _rootScene) {
            _sceneName.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
            _sceneOtherRes.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
            return {
                key: '$' + _rootScene + ':' + _key + '-' + _sceneName,
                rootScene: _rootScene,
                sceneName: _sceneName.split(','),
                sceneOtherRes: _sceneOtherRes.split(','),
            };
        }
    }

    class FrameLevelConst {
    }
    FrameLevelConst.PrestrainLeveId = ['prestrain'];

    class SceneManager {
        constructor() {
            this._levelConfig = {};
            this._scenes = {};
            SceneManagerProxy.sevelConfig = this._levelConfig;
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new SceneManager();
            }
            return this._instance;
        }
        init() { }
        initConfig() {
            let url;
            let config;
            for (let _i in ELevelSceneName) {
                url = ELevelSceneName[_i];
                if (!url) {
                    continue;
                }
                url = EssentialResUrls.levelConfigURL(url);
                config = ResLoad.Get(url, true);
                if (config.root) {
                    this._levelConfig[ELevelSceneName[_i]] = {};
                    for (let i = 0; i < config.root.length; i++) {
                        let data = config.root[i];
                        this._levelConfig[ELevelSceneName[_i]][data.name] = data;
                    }
                }
                ResLoad.Unload(url);
            }
        }
        Preload(urls) {
            let _preloadUrls = [];
            FrameLevelConst.PrestrainLeveId.forEach((item) => {
                _preloadUrls.push(...this.getOtherSceneByName(item).scenePrefabUrl());
            });
            urls.push(..._preloadUrls);
        }
        preloadSceneRes(id) {
            console.log(...ConsoleEx.packLog('预加载关卡->', id));
            this.getSceneByLv(id).loadRes();
        }
        preloadOtherSceneRes(name) {
            console.log(...ConsoleEx.packLog('预加载其它关卡->', name));
            this.getOtherSceneByName(name).loadRes();
        }
        getSceneByLv(id) {
            let lvConfig = FrameLevelConfig.byLevelIdGetLevelData(id);
            if (!lvConfig) {
                console.log(...ConsoleEx.packError("不存在此关卡->", id));
            }
            if (!this._scenes[lvConfig.key]) {
                this._scenes[lvConfig.key] = this.getSceneByData(lvConfig.key, lvConfig);
            }
            return this._scenes[lvConfig.key];
        }
        getOtherSceneByName(_name) {
            let lvConfig = FrameLevelConfig.byLevelNameGetOtherLevelData(_name);
            if (!lvConfig) {
                console.log(...ConsoleEx.packError("不存在此关卡->", _name));
            }
            if (!this._scenes[lvConfig.key]) {
                this._scenes[lvConfig.key] = this.getSceneByData(lvConfig.key, lvConfig);
            }
            return this._scenes[lvConfig.key];
        }
        getSceneByData(_key, _lvConfig) {
            let sceneName = _lvConfig.sceneName;
            let _sceneName_ = _lvConfig.sceneOtherRes;
            let sceneNodes = {};
            let sceneNodes_ = [];
            if (!this._levelConfig[_lvConfig.rootScene]) {
                console.log(...ConsoleEx.packError('没有找到场景-', _lvConfig.rootScene, ' 请先注册。'));
            }
            for (let _i in this._levelConfig[_lvConfig.rootScene]) {
                if (sceneName.findIndex((item) => { return item == _i; }) != -1) {
                    sceneNodes[_i] = this._levelConfig[_lvConfig.rootScene][_i];
                }
                if (_sceneName_.findIndex((item) => { return item == _i; }) != -1) {
                    sceneNodes_.push(this._levelConfig[_lvConfig.rootScene][_i]);
                }
            }
            return new Scene(sceneNodes, sceneNodes_, _lvConfig);
        }
        getLvResName(id) {
            return this.getSceneByLv(id).scenePrefabResName();
        }
        getLvResUrl(id) {
            return this.getSceneByLv(id).scenePrefabUrl();
        }
    }

    class Const {
    }
    Const.gravity = -10;
    Const.ifPreloadCustoms = false;

    class RootProManager {
        constructor() {
            this.m_proList = {};
            this.init();
            this.register();
        }
        getPro(_pro) {
            return this.m_proList[_pro];
        }
        init() {
        }
        register() {
        }
        AllotPre(_prefabs) {
            this.allotPrefab(_prefabs);
            this.allotMediator();
        }
        allotPrefab(_prefabs) {
        }
        allotMediator() {
        }
        AllotOtherScenePre(_sceneName, _prefabs) {
            this.allotOtherScenePrefab(_sceneName, _prefabs);
            this.allotOtherSceneMediator(_sceneName);
        }
        allotOtherScenePrefab(_sceneName, _prefabs) {
        }
        allotOtherSceneMediator(_sceneName) {
        }
    }

    var EProcessor;
    (function (EProcessor) {
        EProcessor["CameraPro"] = "EProcessor_CameraPro";
    })(EProcessor || (EProcessor = {}));

    class ProScriptLink {
        constructor(_plantTypeof) {
            this.m_proTypeof = _plantTypeof;
        }
        get proTypeof() {
            return this.m_proTypeof;
        }
        addScript(_o, _com, _data) {
            let _scr = _o.addComponent(_com);
            _scr.setPro(this);
            _scr.setData(_data);
            return _scr;
        }
    }

    class ProStampScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.m_proStamp = [];
        }
        addProStamp(_pro) {
            if (this.m_proStamp.findIndex((item) => { return item == _pro; }) == -1) {
                this.m_proStamp.push(_pro);
            }
        }
        get proStamp() {
            return this.m_proStamp;
        }
        ifAtPro(_pro) {
            return this.m_proStamp.findIndex((item) => { return item == _pro; }) != -1;
        }
    }

    class BasePrefabPro extends ProScriptLink {
        constructor(_plantTypeof) {
            super(_plantTypeof);
            this.ifAddProStampScript = false;
            this.ifAddParentNode = false;
            this.onlyInit();
        }
        get sprList() {
            return this.m_sprList;
        }
        get parentNode() {
            return this.m_parentNode;
        }
        set _vo(_vo) {
            this.m_vo = _vo;
            this.m_vo._initPro(this);
        }
        set _mediator(_me) {
            this.m_mediator = _me;
            this.m_mediator._initPro(this);
        }
        onlyInit() { }
        _init() {
            if (this.ifAddParentNode) {
                this.m_parentNode = new Laya.Sprite3D();
            }
        }
        startPor(_content) {
            this._init();
            this.initExtend();
            this.init();
            this.m_sprList = this.proSpr(_content);
            this.sprInitExtend();
            this.sprInit();
        }
        addSprAndPor(_content) {
            let _sprList = this.proSpr(_content);
            this.m_sprList.push(..._sprList);
            this.addSprAndProCom(_sprList);
        }
        addSprAndProCom(_sprs) { }
        init() { }
        initExtend() { }
        setSpr(_spr) { }
        setSprExtend(_spr) { }
        sprInit() { }
        sprInitExtend() { }
        getSprClass({ id }) {
            for (let _class in this.m_sprIdClassList) {
                if (this.m_sprIdClassList[_class].findIndex((item) => { return item == id; }) != -1) {
                    return _class;
                }
            }
        }
        getAddCommonScrSpr(_spr) {
            return _spr;
        }
        static getProStamp(_spr) {
            let _scr = _spr.getComponent(ProStampScript);
            if (_scr) {
                return _scr.proStamp;
            }
            else {
                return [];
            }
        }
        proSpr(_content) {
            let _sprList = [];
            for (let _class in _content) {
                if (_content[_class]) {
                    _sprList.push(..._content[_class]);
                    this.addSprIdClassList(_class, _content[_class]);
                }
            }
            _sprList.forEach((item) => {
                if (this.ifAddParentNode) {
                    this.m_parentNode.addChild(item);
                }
                this.addProStampCommonScr(this.getAddCommonScrSpr(item));
                this.setSprExtend(item);
                this.setSpr(item);
            });
            return _sprList;
        }
        addSprIdClassList(_class, _sprs) {
            if (!_sprs)
                return;
            if (!this.m_sprIdClassList) {
                this.m_sprIdClassList = {};
            }
            if (!this.m_sprIdClassList[_class]) {
                this.m_sprIdClassList[_class] = [];
            }
            let _ids = _sprs.map((item) => {
                return item.id;
            });
            this.m_sprIdClassList[_class].push(..._ids);
            let _sets = new Set(this.m_sprIdClassList[_class]);
            this.m_sprIdClassList[_class] = Array.from(_sets);
        }
        addProStampCommonScr(_spr) {
            if (!this.ifAddProStampScript)
                return;
            let _scr;
            let __scr;
            __scr = _spr.getComponent(ProStampScript);
            if (__scr) {
                _scr = __scr;
            }
            else {
                _scr = _spr.addComponent(ProStampScript);
            }
            _scr.addProStamp(this.proTypeof);
        }
    }

    class RootScript extends Laya.Script3D {
    }

    class BaseProScript extends RootScript {
        get pro() {
            if (this.m_Pro) {
                return this.m_Pro;
            }
            else {
                console.log(...ConsoleEx.packWarn('->没有找到Pro!<-'));
            }
        }
        get data() {
            return this.m_data;
        }
        setPro(_Pro) {
            this.m_Pro = _Pro;
        }
        setData(_data) {
            this.m_data = _data;
        }
    }

    class CameraScr extends BaseProScript {
        set cameraNode(_spr) {
            this.m_cameraNode = _spr;
            this.m_cameraNodeTransform = _spr.transform;
        }
        init() {
        }
        onAwake() {
            this.m_transform = this.owner.transform;
        }
        onUpdate() {
        }
    }

    class ValueConst {
        static get zeroV3() {
            return ValueConst.m_zeroV3.clone();
        }
        static get zeroV2() {
            return ValueConst.m_zeroV2.clone();
        }
    }
    ValueConst.m_zeroV3 = new Laya.Vector3(0, 0, 0);
    ValueConst.m_zeroV2 = new Laya.Vector2(0, 0);

    class ColorUtils {
        static RgbToHex(r, g, b) {
            var color = r << 16 | g << 8 | b;
            var str = color.toString(16);
            while (str.length < 6)
                str = "0" + str;
            return "#" + str;
        }
        static ColorToHex(color) {
            return this.RgbToHex(color.r * 255, color.g * 255, color.b * 255);
        }
        static HexToColor(colorHex, alpha = null) {
            if (colorHex.startsWith("#")) {
                colorHex = colorHex.substring(1);
            }
            let cr = colorHex.substring(0, 2);
            let cg = colorHex.substring(2, 4);
            let cb = colorHex.substring(4, 6);
            let ca = colorHex.substring(6, 8);
            let nr = parseInt(cr, 16);
            let ng = parseInt(cg, 16);
            let nb = parseInt(cb, 16);
            let na = alpha ? alpha : parseInt(ca, 16);
            return new Laya.Color(nr / 255, ng / 255, nb / 255, na);
        }
        static ToV3(color) {
            return new Laya.Vector3(color.r, color.g, color.b);
        }
        static ToV4(color) {
            return new Laya.Vector4(color.r, color.g, color.b, color.a);
        }
        static HexToV3(colorHex) {
            if (colorHex.startsWith("#")) {
                colorHex = colorHex.substring(1);
            }
            let cr = colorHex.substring(0, 2);
            let cg = colorHex.substring(2, 4);
            let cb = colorHex.substring(4, 6);
            let nr = parseInt(cr, 16);
            let ng = parseInt(cg, 16);
            let nb = parseInt(cb, 16);
            return new Laya.Vector3(nr / 255, ng / 255, nb / 255);
        }
        static HexToV4(colorHex, alpha = null) {
            if (colorHex.startsWith("#")) {
                colorHex = colorHex.substring(1);
            }
            let cr = colorHex.substring(0, 2);
            let cg = colorHex.substring(2, 4);
            let cb = colorHex.substring(4, 6);
            let ca = colorHex.substring(6, 8);
            let nr = parseInt(cr, 16);
            let ng = parseInt(cg, 16);
            let nb = parseInt(cb, 16);
            let na = alpha ? alpha : parseInt(ca, 16);
            return new Laya.Vector4(nr / 255, ng / 255, nb / 255, na);
        }
    }

    class Dictionary {
        constructor() {
            this.items = {};
        }
        set(key, value) {
            this.items[key] = value;
            return true;
        }
        has(key) {
            return this.items.hasOwnProperty(key);
        }
        remove(key) {
            if (!this.has(key))
                return false;
            delete this.items[key];
            return true;
        }
        get(key) {
            return this.has(key) ? this.items[key] : undefined;
        }
        keys() {
            return Object.keys(this.items);
        }
        get length() {
            return this.keys().length;
        }
        clear() {
            this.items = {};
        }
    }

    class OimoConst {
    }
    OimoConst.timestep = 1 / 60;
    OimoConst.iterations = 24;
    OimoConst.broadphase = 2;
    OimoConst.worldscale = 1;
    OimoConst.random = true;
    OimoConst.info = false;
    OimoConst.gravity = [0, -9.8, 0];

    class OimoManager {
        constructor() {
            this._oimoRigDic = new Dictionary();
            this._transformDic = new Dictionary();
            this._oimoOffset = new Dictionary();
            this._oimoRigDicR = new Dictionary();
            this._transformDicR = new Dictionary();
            this._oimoOffsetR = new Dictionary();
            this._tempOimoV3 = new OIMO.Vec3;
            this._tempOimoQuat = new OIMO.Quat;
            this._tempQuaternion = new Laya.Quaternion();
            this._init();
        }
        get oimoWorld() {
            return this._oimoWorld;
        }
        static get instance() {
            if (!OimoManager._instance) {
                OimoManager._instance = new OimoManager();
            }
            return OimoManager._instance;
        }
        _init() {
            this._oimoWorld = this.CreateWolrd();
            window['oimoWorld'] = this._oimoWorld;
        }
        CreateWolrd() {
            let wolrd = new OIMO.World({
                timestep: OimoConst.timestep,
                iterations: OimoConst.iterations,
                broadphase: OimoConst.broadphase,
                worldscale: OimoConst.worldscale,
                random: OimoConst.random,
                info: OimoConst.info,
                gravity: OimoConst.gravity,
            });
            return wolrd;
        }
        _createRigBox(world, pos, eulerRot, size, isMove, type = 'box') {
            let addRig = world.add({
                type: type,
                size: [size.x, size.y, size.z],
                pos: [pos.x, pos.y, pos.z],
                rot: [eulerRot.x, eulerRot.y, eulerRot.z],
                move: isMove,
                density: 10,
                belongsTo: 1,
                collidesWith: 0xffffffff
            });
            return addRig;
        }
        CreateCompoundRig(ts, shapes, isMove = true, update = true, reverseUpdate = false, isKinematic = false, density = 10, belongsTo = 1, collidesWith = 0xffffffff) {
            var type = [];
            var posShape = [];
            var rotShape = [];
            var size = [];
            for (var i = 0; i < shapes.length; i++) {
                let shape = shapes[i];
                type.push(shape.type);
                posShape.push(shape.pos.x, shape.pos.y, shape.pos.z);
                rotShape.push(shape.eular.x, shape.eular.y, shape.eular.z);
                size.push(shape.size.x, shape.size.y, shape.size.z);
            }
            let rig = this.oimoWorld.add({
                type: type,
                pos: [ts.position.x, ts.position.y, ts.position.z],
                rot: [ts.rotationEuler.x, ts.rotationEuler.y, ts.rotationEuler.z],
                posShape: posShape,
                rotShape: rotShape,
                size: size,
                move: isMove,
                density: density,
                friction: 0.999,
                restitution: 0.1,
                isKinematic: isKinematic,
                belongsTo: belongsTo,
                collidesWith: collidesWith,
            });
            rig.id = OimoManager.m_rigId;
            OimoManager.m_rigId++;
            if (update) {
                this._oimoRigDic.set(rig.id, rig);
                this._transformDic.set(rig.id, ts);
                this._oimoOffset.set(rig.id, new Laya.Vector3());
            }
            if (reverseUpdate) {
                this._oimoRigDicR.set(rig.id, rig);
                this._transformDicR.set(rig.id, ts);
                this._oimoOffsetR.set(rig.id, new Laya.Vector3());
            }
            return rig;
        }
        static SetCollideData(rig, belongsTo, collidesWith, restitution, friction) {
            for (var shape = rig.shapes; shape !== null; shape = shape.next) {
                if (belongsTo != null)
                    shape.belongsTo = belongsTo;
                if (collidesWith != null)
                    shape.collidesWith = collidesWith;
                if (restitution != null)
                    shape.restitution = restitution;
                if (friction != null)
                    shape.friction = friction;
            }
        }
        setCanMove(rig, can) {
            if (can) {
                rig.setupMass(OIMO.BODY_DYNAMIC, false);
            }
            else {
                rig.setupMass(OIMO.BODY_STATIC, false);
            }
        }
        clearRig() {
            this._oimoWorld.clear();
            this._oimoRigDic.clear();
            this._transformDic.clear();
            this._oimoOffset.clear();
            this._oimoRigDicR.clear();
            this._transformDicR.clear();
            this._oimoOffsetR.clear();
        }
        addRig(rig, world = this._oimoWorld) {
            if (rig) {
                world.addRigidBody(rig);
            }
        }
        RemoveRig(rig, world = this._oimoWorld, offList = false) {
            if (rig) {
                if (offList) {
                    this._oimoRigDic.remove(rig.id);
                    this._transformDic.remove(rig.id);
                    this._oimoOffset.remove(rig.id);
                    this._oimoRigDicR.remove(rig.id);
                    this._transformDicR.remove(rig.id);
                    this._oimoOffsetR.remove(rig.id);
                }
                world.removeRigidBody(rig);
            }
        }
        AddJoint(type, rig1, rig2, pos1, pos2, spring) {
            return this.oimoWorld.add({
                type: type,
                body1: rig1,
                body2: rig2,
                pos1: pos1 != null ? [pos1.x, pos1.y, pos1.z] : pos1,
                pos2: pos2 != null ? [pos2.x, pos2.y, pos2.z] : pos2,
                spring: spring,
            });
        }
        RemoveJoint(joint) {
            this.oimoWorld.removeJoint(joint);
        }
        updateAllTrans() {
            let keys = this._oimoRigDic.keys();
            keys.forEach((key) => {
                this.UpdateTrans(this._transformDic.get(key), this._oimoRigDic.get(key), this._oimoOffset.get(key));
            });
        }
        updateAllTransReverse() {
            let keys = this._oimoRigDicR.keys();
            keys.forEach((key) => {
                this.UpdateTransReverse(this._transformDicR.get(key), this._oimoRigDicR.get(key));
            });
        }
        UpdateTransReverse(transform, rig) {
            if (!transform || !rig || !rig.parent)
                return;
            let pos = transform.position;
            this._tempOimoV3.set(pos.x, pos.y, pos.z);
            rig.awake();
            rig.setPosition(this._tempOimoV3);
            let rotate = transform.rotation;
            this._tempOimoQuat.set(rotate.x, rotate.y, rotate.z, rotate.w);
            rig.setQuaternion(this._tempOimoQuat);
        }
        UpdateTrans(transform, rig, posOffset) {
            if (!transform || !rig || !rig.parent)
                return;
            let getPos = rig.getPosition();
            transform.position.x = getPos.x;
            transform.position.y = getPos.y;
            transform.position.z = getPos.z;
            if (posOffset && !this.isZero(posOffset)) {
                let offset = posOffset.clone();
                Laya.Quaternion.createFromYawPitchRoll(this.deg2rad(transform.rotationEuler.y), this.deg2rad(transform.rotationEuler.x), this.deg2rad(transform.rotationEuler.z), this._tempQuaternion);
                Laya.Vector3.transformQuat(offset, this._tempQuaternion, offset);
                Laya.Vector3.subtract(transform.position, offset, transform.position);
            }
            transform.position = transform.position;
            let getRot = rig.getQuaternion();
            transform.rotation.x = getRot.x;
            transform.rotation.y = getRot.y;
            transform.rotation.z = getRot.z;
            transform.rotation.w = getRot.w;
            transform.rotation = transform.rotation;
        }
        isZero(pos) {
            return Laya.MathUtils3D.isZero(pos.x) && Laya.MathUtils3D.isZero(pos.y) && Laya.MathUtils3D.isZero(pos.z);
        }
        deg2rad(p_y) {
            return p_y * Math.PI / 180.0;
        }
        GetRig(name) {
            return this._oimoRigDic.get(name);
        }
    }
    OimoManager.m_rigId = 0;

    class OimoSystem extends Laya.Script3D {
        onUpdate() {
            OimoManager.instance.oimoWorld.timeStep = Laya.timer.delta / 1000;
            OimoManager.instance.oimoWorld.step();
            OimoManager.instance.updateAllTrans();
            OimoManager.instance.updateAllTransReverse();
        }
    }

    class MainConfig {
    }
    MainConfig.GameWhatTeam = '小小游戏';
    MainConfig.GameName = 'LayaMiniGame';
    MainConfig.GameName_ = 'LayaBox小游戏';
    MainConfig.GameExplain = 'LayaBox小游戏';
    MainConfig.versions = '0.0.0';
    MainConfig.OnLine = false;

    class MainGameConfig {
    }
    MainGameConfig.support2D = false;
    MainGameConfig.support3D = true;
    MainGameConfig.ifAddOimoSystem = false;
    MainGameConfig.ifGameTest = (!MainConfig.OnLine) && false;
    MainGameConfig.ifTest = (!MainConfig.OnLine) && false;
    MainGameConfig.ifDebug = (!MainConfig.OnLine) && true;
    MainGameConfig.ifOpenWindowDebug = (!MainConfig.OnLine) && false;

    class DebugWindowCommunication {
        constructor() {
            this.m_mesList = [];
        }
        onMes(_this, _key, _f) {
            this.m_mesList.push({
                this: _this,
                key: _key,
                f: _f,
            });
        }
        eventMes(_key, ..._data) {
            this.m_mesList.forEach((item) => {
                if (item.key == _key) {
                    item.f.call(item.this, ..._data);
                }
            });
        }
        removeMes(_this, _key) {
            this.m_mesList = this.m_mesList.filter((item) => {
                if (typeof _key != "undefined") {
                    return item.this != _this && item.key != _key;
                }
                else {
                    return item.this != _this;
                }
            });
        }
    }

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico"><title>DebugWindow</title><link href="/css/app.d6b301ef.css" rel="preload" as="style"><link href="/css/chunk-vendors.84bb20f7.css" rel="preload" as="style"><link href="/js/app.2e279fb7.js" rel="preload" as="script"><link href="/js/chunk-vendors.ee9c6a8c.js" rel="preload" as="script"><link href="/css/chunk-vendors.84bb20f7.css" rel="stylesheet"><link href="/css/app.d6b301ef.css" rel="stylesheet"></head><body><noscript><strong>We're sorry but DebugWindow doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div id="app"></div><script src="/js/chunk-vendors.ee9c6a8c.js"></script><script src="/js/app.2e279fb7.js"></script></body></html>`;

    var EDebugWindow;
    (function (EDebugWindow) {
        EDebugWindow["DebugWindow"] = "$DebugWindow";
        EDebugWindow["Mes"] = "$Mes";
    })(EDebugWindow || (EDebugWindow = {}));

    class RootDebug {
        constructor() {
            this._ifStart = false;
        }
        static addItem(_key, _item) {
            let _rootKey = this.prefix + ':' + _key;
            if (this[_rootKey]) {
                console.log(...ConsoleEx.packWarn('该调试对象已经存在了，将会被第二个覆盖', _rootKey));
            }
            this[_rootKey] = _item;
        }
        startDebug() {
            this._ifStart = true;
            if (window[RootDebug.prefix][this._name]) {
                console.log(...ConsoleEx.packWarn('有一个调试对象名字重名了，将会被第二个覆盖', this._name));
            }
            window[RootDebug.prefix][this._name] = this;
            this._startDebug();
        }
        addItem(_key, _item) {
            if (!this._ifStart) {
                return;
            }
            if (this[_key]) {
                console.log(...ConsoleEx.packWarn('该调试对象已经存在了，将会被第二个覆盖', this._name, '-', _key));
            }
            this[_key] = _item;
        }
        _startDebug() { }
        static openWindowDebug() {
            let _win = window.open('', MainConfig.GameName);
            window[EDebugWindow.DebugWindow] = _win;
            let _url = window.location.href.replace('bin/index.html', 'DebugWindow/dist/');
            _win.document.getElementsByTagName('html')[0].innerHTML = html.replace(/"\//g, '"' + _url);
            console.log(...ConsoleEx.packWarn('打开调式窗口。'));
            let _HTMLCollection = _win.document.getElementsByTagName('body')[0].getElementsByTagName('script');
            _win[EDebugWindow.Mes] = new DebugWindowCommunication();
            let _scriptSrc = [];
            for (let item of _HTMLCollection) {
                _scriptSrc.push(item.src);
            }
            ;
            _scriptSrc.forEach((item) => {
                let script = _win.document.createElement("script");
                script.async = false;
                script.src = item;
                _win.document.body.appendChild(script);
            });
        }
        static fendDebugWindow(_mes, ..._data) {
            window[EDebugWindow.DebugWindow][EDebugWindow.Mes].eventMes(_mes, ..._data);
        }
    }
    RootDebug.prefix = '$Debug';
    window[RootDebug.prefix] = {};
    if (MainGameConfig.ifDebug) {
        console.log(...ConsoleEx.packWarn('开启调试模式，通过', RootDebug.prefix, '访问'));
    }

    class EnvironmentDebug extends RootDebug {
        constructor() {
            super();
            this._name = 'Environment';
        }
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            else {
                this._instance = new EnvironmentDebug();
                return this._instance;
            }
        }
        _startDebug() {
            console.log('开启环境调试');
        }
    }

    class Global3D {
        static InitAll() {
            if (MainGameConfig.support3D) {
                this.s3d = Laya.stage.addChildAt(new Laya.Scene3D(), 0);
                this.camera = new Laya.Camera();
                this.s3d.addChild(this.camera);
                SceneManagerProxy.initCamera(this.camera);
                this.light = new Laya.DirectionLight;
                this.s3d.addChild(this.light);
                SceneManagerProxy.initLight(this.light);
                if (MainGameConfig.ifAddOimoSystem) {
                    this.addOimoSystem();
                }
                GlobalUnitClassProxy.s3d = this.s3d;
                GlobalUnitClassProxy.camera = this.camera;
                GlobalUnitClassProxy.light = this.light;
                EnvironmentDebug.instance.s3d = this.s3d;
                EnvironmentDebug.instance.camera = this.camera;
                EnvironmentDebug.instance.light = this.light;
            }
            else {
                console.log(...ConsoleEx.packLog('请设置支持3D!'));
            }
        }
        static addOimoSystem() {
            let oimoNode = new Laya.Sprite3D();
            this.s3d.addChild(oimoNode);
            oimoNode.addComponent(OimoSystem);
        }
    }

    var EEventScene;
    (function (EEventScene) {
        EEventScene["LookAd"] = "LookAd";
        EEventScene["UnLookAd"] = "UnLookAd";
        EEventScene["GameLevelsBuild"] = "GameLevelsBuild";
        EEventScene["GameOtherLevelsBuild"] = "GameOtherLevelsBuild";
        EEventScene["GameLevelsBuildBefore"] = "GameLevelsBuildBefore";
        EEventScene["GameLevelsOnBuild"] = "GameLevelsOnBuild";
        EEventScene["GameLevelsDelete"] = "GameLevelsDelete";
        EEventScene["GameOtherLevelsDelete"] = "GameOtherLevelsDelete";
        EEventScene["GameLevelsDeleteBefore"] = "GameLevelsDeleteBefore";
        EEventScene["GameLevelsOnDelete"] = "GameLevelsOnDelete";
        EEventScene["GameStart"] = "Start";
        EEventScene["GameSuspend"] = "GameSuspend";
        EEventScene["GameGoOn"] = "GameGoOn";
        EEventScene["GameRestart"] = "GameRestart";
        EEventScene["GameEnd"] = "GameEnd";
        EEventScene["GameCom"] = "GameCom";
        EEventScene["GameWin"] = "gameWin";
        EEventScene["GameFail"] = "gameFail";
        EEventScene["RoleDie"] = "RoleDie";
        EEventScene["RoleRevive"] = "Revive";
        EEventScene["MouseClick"] = "MouseClick";
        EEventScene["MouseMove"] = "MouseMove";
        EEventScene["MouseUp"] = "MouseUp";
    })(EEventScene || (EEventScene = {}));

    var EEventAudio;
    (function (EEventAudio) {
        EEventAudio["BGMSuspend"] = "BGMSuspend";
        EEventAudio["BGMGoOn"] = "BGMGoOn";
        EEventAudio["SoundSuspend"] = "SoundSuspend";
        EEventAudio["SoundGoOn"] = "SoundGoOn";
        EEventAudio["BGMVolumeChange"] = "BGMVolumeChange";
        EEventAudio["SoundVolumeChange"] = "BGMVolumeChange";
    })(EEventAudio || (EEventAudio = {}));

    var EEventGlobal;
    (function (EEventGlobal) {
        EEventGlobal["GameInit"] = "GameInit";
        EEventGlobal["GameOnInit"] = "GameOnInit";
        EEventGlobal["GameLoading"] = "GameLoading";
        EEventGlobal["GameResLoading"] = "GameResLoading";
    })(EEventGlobal || (EEventGlobal = {}));

    var EEventUI;
    (function (EEventUI) {
        EEventUI["LookAd"] = "LookAd";
        EEventUI["UnLookAd"] = "UnLookAd";
        EEventUI["CustomsChange"] = "CustomsChange";
        EEventUI["GameStart"] = "Start";
        EEventUI["GameEnd"] = "GameEnd";
        EEventUI["GamePasue"] = "GamePause";
        EEventUI["GameResume"] = "GameResume";
        EEventUI["GameCom"] = "GameCom";
        EEventUI["GameWin"] = "GameWin";
        EEventUI["GameFail"] = "GameFail";
        EEventUI["RoleDie"] = "RoleDie";
        EEventUI["RoleRevive"] = "RoleRevive";
        EEventUI["GameCoinChange"] = "GameCoinChange";
        EEventUI["SoundStateChange"] = "SoundStateChange";
        EEventUI["VibrateStateChange"] = "VibrateStateChange";
        EEventUI["SceneGameCustomsInit"] = "SceneGameCustomsInit";
        EEventUI["SceneGameCustomsLoading"] = "SceneGameCustomsLoading";
        EEventUI["SceneGameCustomDelete"] = "SceneGameCustomDelete";
    })(EEventUI || (EEventUI = {}));

    class MesManager extends Laya.EventDispatcher {
        constructor() {
            super();
            this.enumerationEegistrationMes();
        }
        static get onlyKey() {
            MesManager._onlyKey++;
            return '$key' + MesManager._onlyKey;
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new MesManager();
            }
            return this._instance;
        }
        init() { }
        enumerationEegistrationMes() {
            this.enumerationEegistrationMes_(EEventGlobal);
            this.enumerationEegistrationMes_(EEventUI);
            this.enumerationEegistrationMes_(EEventScene);
            this.enumerationEegistrationMes_(EEventAudio);
        }
        enumerationEegistrationMes_(_mes) {
            for (let _i in _mes) {
                _mes[_i] = {
                    value: _mes[_i],
                    [MesManager._mesKey]: MesManager.onlyKey,
                };
            }
        }
        sendEvent(event, data) {
            if (typeof event[MesManager._mesKey] == 'undefined') {
                console.log('事件', event, '没有被注册。');
                return;
            }
            MesManager.instance.event(event[MesManager._mesKey], data);
        }
        onEvent(type, caller, listener, args) {
            if (typeof type[MesManager._mesKey] == 'undefined') {
                console.log('事件', type, '没有被注册。');
                return;
            }
            MesManager.instance.on(type[MesManager._mesKey], caller, listener, args);
        }
        offEnent(type, caller, listener) {
            if (typeof type[MesManager._mesKey] == 'undefined') {
                console.log('事件', type, '没有被注册。');
                return;
            }
            MesManager.instance.off(type[MesManager._mesKey], caller, listener);
        }
    }
    MesManager._mesKey = Symbol('$MesKey');
    MesManager._onlyKey = 0;

    class StringUtils {
        static SplitToIntArray(str, splitStr) {
            var splits = str.split(splitStr);
            var result = [];
            for (var i = 0; i < splits.length; ++i) {
                var parseNum = parseInt(splits[i]);
                if (isNaN(parseNum)) {
                    parseNum = 0;
                }
                result.push(parseNum);
            }
            return result;
        }
        static IntArrToStr(arr) {
            var str = "";
            for (var i = 0; i < arr.length; ++i) {
                str += arr[i].toFixed(0);
                if (i < arr.length - 1) {
                    str += ",";
                }
            }
            return str;
        }
        static IsNullOrEmpty(str) {
            if (str == null)
                return true;
            if (str == "")
                return true;
            return false;
        }
    }

    class Md5 {
        constructor() {
            this._state = new Int32Array(4);
            this._buffer = new ArrayBuffer(68);
            this._buffer8 = new Uint8Array(this._buffer, 0, 68);
            this._buffer32 = new Uint32Array(this._buffer, 0, 17);
            this.start();
        }
        static hashStr(str, raw = false) {
            return this.onePassHasher
                .start()
                .appendStr(str)
                .end(raw);
        }
        static hashAsciiStr(str, raw = false) {
            return this.onePassHasher
                .start()
                .appendAsciiStr(str)
                .end(raw);
        }
        static _hex(x) {
            const hc = Md5.hexChars;
            const ho = Md5.hexOut;
            let n;
            let offset;
            let j;
            let i;
            for (i = 0; i < 4; i += 1) {
                offset = i * 8;
                n = x[i];
                for (j = 0; j < 8; j += 2) {
                    ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                    n >>>= 4;
                    ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                    n >>>= 4;
                }
            }
            return ho.join('');
        }
        static _md5cycle(x, k) {
            let a = x[0];
            let b = x[1];
            let c = x[2];
            let d = x[3];
            a += (b & c | ~b & d) + k[0] - 680876936 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[1] - 389564586 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[2] + 606105819 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & c | ~b & d) + k[4] - 176418897 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[7] - 45705983 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[10] - 42063 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[13] - 40341101 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & d | c & ~d) + k[1] - 165796510 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[11] + 643717713 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[0] - 373897302 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b & d | c & ~d) + k[5] - 701558691 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[10] + 38016083 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[15] - 660478335 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[4] - 405537848 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b & d | c & ~d) + k[9] + 568446438 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[3] - 187363961 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[2] - 51403784 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b ^ c ^ d) + k[5] - 378558 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[14] - 35309556 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[7] - 155497632 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (b ^ c ^ d) + k[13] + 681279174 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[0] - 358537222 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[3] - 722521979 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[6] + 76029189 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (b ^ c ^ d) + k[9] - 640364487 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[12] - 421815835 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[15] + 530742520 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[2] - 995338651 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            x[0] = a + x[0] | 0;
            x[1] = b + x[1] | 0;
            x[2] = c + x[2] | 0;
            x[3] = d + x[3] | 0;
        }
        start() {
            this._dataLength = 0;
            this._bufferLength = 0;
            this._state.set(Md5.stateIdentity);
            return this;
        }
        appendStr(str) {
            const buf8 = this._buffer8;
            const buf32 = this._buffer32;
            let bufLen = this._bufferLength;
            let code;
            let i;
            for (i = 0; i < str.length; i += 1) {
                code = str.charCodeAt(i);
                if (code < 128) {
                    buf8[bufLen++] = code;
                }
                else if (code < 0x800) {
                    buf8[bufLen++] = (code >>> 6) + 0xC0;
                    buf8[bufLen++] = code & 0x3F | 0x80;
                }
                else if (code < 0xD800 || code > 0xDBFF) {
                    buf8[bufLen++] = (code >>> 12) + 0xE0;
                    buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                    buf8[bufLen++] = (code & 0x3F) | 0x80;
                }
                else {
                    code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                    if (code > 0x10FFFF) {
                        throw new Error('Unicode standard supports code points up to U+10FFFF');
                    }
                    buf8[bufLen++] = (code >>> 18) + 0xF0;
                    buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                    buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                    buf8[bufLen++] = (code & 0x3F) | 0x80;
                }
                if (bufLen >= 64) {
                    this._dataLength += 64;
                    Md5._md5cycle(this._state, buf32);
                    bufLen -= 64;
                    buf32[0] = buf32[16];
                }
            }
            this._bufferLength = bufLen;
            return this;
        }
        appendAsciiStr(str) {
            const buf8 = this._buffer8;
            const buf32 = this._buffer32;
            let bufLen = this._bufferLength;
            let i;
            let j = 0;
            for (;;) {
                i = Math.min(str.length - j, 64 - bufLen);
                while (i--) {
                    buf8[bufLen++] = str.charCodeAt(j++);
                }
                if (bufLen < 64) {
                    break;
                }
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen = 0;
            }
            this._bufferLength = bufLen;
            return this;
        }
        appendByteArray(input) {
            const buf8 = this._buffer8;
            const buf32 = this._buffer32;
            let bufLen = this._bufferLength;
            let i;
            let j = 0;
            for (;;) {
                i = Math.min(input.length - j, 64 - bufLen);
                while (i--) {
                    buf8[bufLen++] = input[j++];
                }
                if (bufLen < 64) {
                    break;
                }
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen = 0;
            }
            this._bufferLength = bufLen;
            return this;
        }
        getState() {
            const self = this;
            const s = self._state;
            return {
                buffer: String.fromCharCode.apply(null, self._buffer8),
                buflen: self._bufferLength,
                length: self._dataLength,
                state: [s[0], s[1], s[2], s[3]]
            };
        }
        setState(state) {
            const buf = state.buffer;
            const x = state.state;
            const s = this._state;
            let i;
            this._dataLength = state.length;
            this._bufferLength = state.buflen;
            s[0] = x[0];
            s[1] = x[1];
            s[2] = x[2];
            s[3] = x[3];
            for (i = 0; i < buf.length; i += 1) {
                this._buffer8[i] = buf.charCodeAt(i);
            }
        }
        end(raw = false) {
            const bufLen = this._bufferLength;
            const buf8 = this._buffer8;
            const buf32 = this._buffer32;
            const i = (bufLen >> 2) + 1;
            let dataBitsLen;
            this._dataLength += bufLen;
            buf8[bufLen] = 0x80;
            buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
            buf32.set(Md5.buffer32Identity.subarray(i), i);
            if (bufLen > 55) {
                Md5._md5cycle(this._state, buf32);
                buf32.set(Md5.buffer32Identity);
            }
            dataBitsLen = this._dataLength * 8;
            if (dataBitsLen <= 0xFFFFFFFF) {
                buf32[14] = dataBitsLen;
            }
            else {
                const matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
                if (matches === null) {
                    return;
                }
                const lo = parseInt(matches[2], 16);
                const hi = parseInt(matches[1], 16) || 0;
                buf32[14] = lo;
                buf32[15] = hi;
            }
            Md5._md5cycle(this._state, buf32);
            return raw ? this._state : Md5._hex(this._state);
        }
    }
    Md5.ifUse = true;
    Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
    Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    Md5.hexChars = '0123456789abcdef';
    Md5.hexOut = [];
    Md5.onePassHasher = new Md5();
    if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
        Md5.ifUse = false;
        console.warn('Md5 self test failed.');
    }

    class RootDataManger {
    }

    class Base64 {
        static encode(input) {
            let output = '';
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;
            input = this._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                }
                else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        }
        static decode(input) {
            let output = '';
            let chr1, chr2, chr3;
            let enc1, enc2, enc3, enc4;
            let i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = this._utf8_decode(output);
            return output;
        }
        static _utf8_encode(string) {
            string = string.replace(/\r\n/g, '\n');
            let utftext = '';
            for (let n = 0; n < string.length; n++) {
                const c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        static _utf8_decode(utftext) {
            let string = '';
            let i = 0;
            let c = 0, c2 = 0, c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }
    Base64._keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    class DataDebug extends RootDebug {
        constructor() {
            super();
            this._name = 'Data';
        }
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            else {
                this._instance = new DataDebug();
                return this._instance;
            }
        }
        _startDebug() {
            console.log('开启数据调试');
        }
    }

    class RootLocalStorageProxy extends RootDataManger {
        constructor() {
            super(...arguments);
            this._ifSetDataProxy = true;
            this._dataSetMonitor = [];
            this._ifDifferData = true;
        }
        get saveName() {
            return MainConfig.GameName + '->' + this._saveName + '->' + MainConfig.versions;
        }
        get differName() {
            return this.encrypt(this.saveName + '__verify');
        }
        get saveData() {
            return this._saveData;
        }
        get rootData() {
            return this._rootData;
        }
        addDataSetMonitor(_this, _dataSetMonitor, _rootData, _key) {
            if (!this._ifSetDataProxy) {
                console.log(...ConsoleEx.packWarn('没有设置数据代理，数据被设置时不会被监听！'));
            }
            else {
                if (_key && typeof _key == 'object') {
                    if (_key[RootLocalStorageProxy.$RootParentDataKey] != _rootData) {
                        console.log(...ConsoleEx.packError('监听的对象属性不存在该对象属性列表中！'));
                    }
                    _key = _key[RootLocalStorageProxy.$RootDataCruxKey];
                }
                this._dataSetMonitor.push({
                    _this: _this,
                    _f: _dataSetMonitor,
                    _rootData: _rootData,
                    _key: _key,
                });
            }
        }
        offDataSetMonitor(_this, _dataSetMonitor) {
            this._dataSetMonitor = this._dataSetMonitor.filter((item) => {
                return item._this !== _this && item._f !== _dataSetMonitor;
            });
        }
        offAllDataSetMonitor(_this) {
            this._dataSetMonitor = this._dataSetMonitor.filter((item) => {
                return item._this !== _this;
            });
        }
        InitData() {
            this._saveData = this._ReadFromFile();
            this._rootData = this._saveData;
            if (this._ifSetDataProxy) {
                this._saveData = this.getProxyData(this._saveData);
            }
            DataDebug.instance.addItem(this._saveName, this);
            this._initData();
        }
        getProxyData(_obj) {
            let _rootObj = {};
            if (typeof _obj == 'object' && _obj) {
                if (!Array.prototype.isPrototypeOf(_obj)) {
                    for (let _i in _obj) {
                        if (typeof _obj[_i] == 'object' && _obj[_i]) {
                            _rootObj[_i] = this.getProxyData(_obj[_i]);
                        }
                        else {
                            _rootObj[_i] = _obj[_i];
                            _obj[_i] = {
                                [RootLocalStorageProxy.$RootDataCruxKey]: Symbol('$key'),
                                [RootLocalStorageProxy.$RootParentDataKey]: _obj,
                                value: _obj[_i],
                            };
                        }
                    }
                }
                else {
                    _rootObj = _obj;
                }
            }
            else {
                return _obj;
            }
            _rootObj[RootLocalStorageProxy.$RootObjectKey] = _obj;
            return new Proxy(_rootObj, {
                set: (target, key, value) => {
                    this.proxyDataSet(target, key, value);
                    return true;
                },
            });
        }
        proxyDataSet(target, key, value) {
            if (key == RootLocalStorageProxy.$RootObjectKey) {
                console.warn('试图更改数据的原始对象，被阻止', target, key, value);
                return;
            }
            let _rotValue = target[key];
            if (typeof value == 'object' && value && !Array.prototype.isPrototypeOf(target)) {
                target[key] = this.getProxyData(value);
            }
            else {
                target[key] = value;
                if (Array.prototype.isPrototypeOf(target) && key == 'length') {
                    return;
                }
            }
            for (let item of this._dataSetMonitor) {
                if (item._rootData && item._rootData != target[RootLocalStorageProxy.$RootObjectKey]) {
                    continue;
                }
                if (typeof item._key != 'undefined') {
                    if (typeof item._key == 'symbol') {
                        if (item._key != target[RootLocalStorageProxy.$RootObjectKey][key][RootLocalStorageProxy.$RootDataCruxKey]) {
                            continue;
                        }
                    }
                    else if (item._key != key) {
                        continue;
                    }
                }
                item._f.call(item._this, target, key, value, _rotValue, target[RootLocalStorageProxy.$RootObjectKey]);
            }
            this._SaveToDisk(this._saveData);
        }
        _initData() { }
        _SaveToDisk(_saveData) {
            let json = JSON.stringify(_saveData);
            Laya.LocalStorage.setJSON(this.saveName, json);
            if (MainConfig.OnLine && this._ifDifferData) {
                let _differJson = this.getDifferData(json);
                Laya.LocalStorage.setJSON(this.differName, _differJson);
            }
        }
        _ReadFromFile() {
            let readStr = Laya.LocalStorage.getJSON(this.saveName);
            if (MainConfig.OnLine && this._ifDifferData) {
                let _differ = Laya.LocalStorage.getJSON(this.differName);
                if (this.getDifferData(readStr) != _differ) {
                    return this._saveNewData();
                }
            }
            let _saveData = this.getNewData();
            try {
                if (!StringUtils.IsNullOrEmpty(readStr)) {
                    let jsonData = JSON.parse(readStr);
                    for (let key in _saveData) {
                        _saveData[key] = jsonData[key];
                    }
                }
                else {
                    return this._saveNewData();
                }
            }
            catch (_a) {
                return this._saveNewData();
            }
            return _saveData;
        }
        _saveNewData() {
            let _saveData = this.getNewData();
            this._SaveToDisk(_saveData);
            return _saveData;
        }
        getDifferData(_string) {
            if (StringUtils.IsNullOrEmpty(_string))
                return '';
            return this.encrypt(_string);
        }
        encrypt(_string) {
            let _encryptStr = 'LayaMiniGame-(-' + _string + '-)-ModifiedWithout-' + this.saveName;
            if (Md5.ifUse) {
                return Md5.hashStr(_encryptStr).toString();
            }
            else {
                return Base64.encode(_encryptStr);
            }
        }
    }
    RootLocalStorageProxy.$RootObjectKey = Symbol('$RootObjectKey');
    RootLocalStorageProxy.$RootDataCruxKey = Symbol('$RootDataCruxKey');
    RootLocalStorageProxy.$RootParentDataKey = Symbol('$RootParentDataKey');

    var ECommonLeve;
    (function (ECommonLeve) {
        ECommonLeve[ECommonLeve["MinLeveNumber"] = 3] = "MinLeveNumber";
        ECommonLeve[ECommonLeve["DefaultLeveId"] = 1] = "DefaultLeveId";
        ECommonLeve[ECommonLeve["DebugLeveId"] = 0] = "DebugLeveId";
        ECommonLeve[ECommonLeve["NewHandLeveId"] = 1] = "NewHandLeveId";
    })(ECommonLeve || (ECommonLeve = {}));

    class RootGameData {
    }

    class RootLocalStorageData extends RootGameData {
        static clone(_data) {
            return JSON.parse(JSON.stringify(_data));
        }
    }

    class GameData extends RootLocalStorageData {
        constructor() {
            super(...arguments);
            this.maxCustoms = 0;
            this.ifOpenBgm = true;
            this.ifOpenSound = true;
            this.ifOpenVibrate = true;
            this.onCustoms = ECommonLeve.DebugLeveId;
            this.maxCustomsRecord = 1;
        }
    }

    class GameDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GameDataProxy();
            }
            return this._instance;
        }
        get _saveName() {
            return "Game";
        }
        getNewData() {
            return new GameData();
        }
    }

    var EnvironmentConfig;
    (function (EnvironmentConfig) {
        class config {
        }
        EnvironmentConfig.config = config;
        EnvironmentConfig.path = "res/config/EnvironmentConfig.json";
    })(EnvironmentConfig || (EnvironmentConfig = {}));

    class EnvironmentConfigProxy extends BaseConfigDataProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new EnvironmentConfigProxy();
            }
            return this._instance;
        }
        initData() {
            this.m_dataList = EnvironmentConfig.dataList;
        }
        byLevelIdGetData(_id) {
            return this.m_dataList.find((item) => {
                return item.id == _id;
            });
        }
    }

    var OtherEnvironmentConfig;
    (function (OtherEnvironmentConfig) {
        class config {
        }
        OtherEnvironmentConfig.config = config;
        OtherEnvironmentConfig.path = "res/config/OtherEnvironmentConfig.json";
    })(OtherEnvironmentConfig || (OtherEnvironmentConfig = {}));

    class OtherEnvironmentConfigProxy extends BaseConfigDataProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new OtherEnvironmentConfigProxy();
            }
            return this._instance;
        }
        initData() {
            this.m_dataList = OtherEnvironmentConfig.dataList;
        }
        byLevelIdGetData(_id) {
            return this.m_dataList.find((item) => {
                return item.id == _id;
            });
        }
        byLevelNameGetData(_name) {
            return this.m_dataList.find((item) => {
                return item.name == _name;
            });
        }
    }

    var EDebugWindowEvent;
    (function (EDebugWindowEvent) {
        EDebugWindowEvent["SetEnvironment"] = "setEnvironment";
    })(EDebugWindowEvent || (EDebugWindowEvent = {}));

    class EnvironmentManager {
        constructor() { }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new EnvironmentManager();
            }
            return this.m_instance;
        }
        init() {
            this.m_s3d = Global3D.s3d;
            this.m_camera = Global3D.camera;
            this.m_light = Global3D.light;
        }
        setEnvironment(_scene) {
            this.m_scene = _scene;
            let _lv = GameDataProxy.instance.saveData.onCustoms;
            this.m_enviromentConfig = EnvironmentConfigProxy.instance.byLevelIdGetData(_lv);
            console.log('关卡环境配置参数->' + _lv + '->', this.m_enviromentConfig);
            this.setS3D(this.m_s3d);
            this.setCamera(this.m_camera, this.m_enviromentConfig.clear_color);
            this.setLight(this.light, this.m_enviromentConfig.light_color, this.m_enviromentConfig.light_intensity);
            this.addAmbient(this.s3d, this.m_enviromentConfig.ambient_color);
            MesManager.instance.onEvent(EEventScene.GameLevelsDelete, this, this.gameLevelsDelete);
            if (MainGameConfig.ifDebug && MainGameConfig.ifOpenWindowDebug) {
                RootDebug.fendDebugWindow(EDebugWindowEvent.SetEnvironment);
            }
        }
        setOtherEnvironment(_name, _scene, _s3d = this.m_s3d, _camera = this.m_camera, _light = this.m_light) {
            let _enviromentConfig = OtherEnvironmentConfigProxy.instance.byLevelNameGetData(_name);
            console.log('关卡环境配置参数->' + _name + '->', _enviromentConfig);
            this.setCamera(_camera, _enviromentConfig.clear_color);
            this.setLight(_light, _enviromentConfig.light_color, _enviromentConfig.light_intensity);
            this.addAmbient(_s3d, _enviromentConfig.ambient_color);
        }
        get s3d() {
            return this.m_s3d;
        }
        get camera() {
            return this.m_camera;
        }
        get scene() {
            return this.m_scene;
        }
        get light() {
            return this.m_light;
        }
        setS3D(_s3d) {
            if (this.m_ifSetS3D)
                return;
            this.m_ifSetS3D = true;
        }
        setCamera(_camera, _clear_color) {
            _camera.clearColor = ColorUtils.HexToV4(_clear_color);
        }
        setLight(_light, _color, _instensity) {
            _light.color = ColorUtils.HexToV3(_color);
            _light.intensity = _instensity;
            _light.shadowMode = Laya.ShadowMode.SoftLow;
            _light.shadowResolution = 2500;
            _light.shadowNormalBias = 0.5;
        }
        addAmbient(_s3d, _color) {
            _s3d.ambientMode = Laya.AmbientMode.SolidColor;
            _s3d.ambientColor = ColorUtils.HexToV3(_color);
        }
        addFog(_scene, _color, _fogRange, _fogStart) {
            _scene.enableFog = true;
            _scene.fogColor = ColorUtils.HexToV3(_color);
            _scene.fogRange = _fogRange;
            _scene.fogStart = _fogStart;
        }
        gameLevelsDelete() {
        }
    }

    class CameraPro extends BasePrefabPro {
        constructor() {
            super(...arguments);
            this.ifAddProStampScript = false;
        }
        sprInit() {
            if (!this.m_camera) {
                if (!this.m_sprList[0]) {
                    console.log(...ConsoleEx.packError('没有找到摄像机!'));
                }
                this.m_camera = this.m_sprList[0];
                this.m_cameraNode = new Laya.Sprite3D();
                this.m_rootPos = this.m_camera.transform.position.clone();
                this.m_rootAng = this.m_camera.transform.rotationEuler.clone();
                this.m_rootAng.x = -this.m_rootAng.x;
                this.m_rootAng.y = this.m_rootAng.y - 180;
                this.m_cameraNode.addChild(this.m_camera);
                this.m_camera.transform.localPosition = ValueConst.zeroV3;
                this.m_camera.transform.localRotationEuler = new Laya.Vector3(0, -180, 0);
                this.m_Scr = this.addScript(this.m_camera, CameraScr);
                this.m_Scr.cameraNode = this.m_cameraNode;
                EnvironmentManager.instance.s3d.addChild(this.m_cameraNode);
            }
            this.m_cameraNode.transform.position = this.m_rootPos;
            this.m_cameraNode.transform.rotationEuler = new Laya.Vector3(this.m_rootAng.x, this.m_rootAng.y, 0);
            this.m_Scr.init();
        }
    }

    class ProManagerProxy extends RootClassProxy {
        constructor() { super(); }
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            else {
                this._instance = new ProManagerProxy();
                return this._instance;
            }
        }
        getPro(_pro) {
            return this.ProList[_pro];
        }
        get cameraPro() {
            return this.getPro(EProcessor.CameraPro);
        }
    }

    class _PrefabsPrefabName {
    }
    _PrefabsPrefabName.Camera = 'Camera';
    _PrefabsPrefabName.DirectionalLight = 'DirectionalLight';
    class _PrefabsPrefabClass {
    }

    class PrefabNames extends _PrefabsPrefabName {
    }
    PrefabNames.Camera = 'camera';
    PrefabNames.Environment = 'environment';
    PrefabNames.HeightFog = 'heightFog';
    class PrefabsGather extends _PrefabsPrefabClass {
    }

    class ProManager extends RootProManager {
        constructor() { super(); }
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            else {
                this._instance = new ProManager();
                return this._instance;
            }
        }
        init() {
            ProManagerProxy.instance.ProList = this.m_proList;
        }
        register() {
            this.m_proList[EProcessor.CameraPro] = new CameraPro(EProcessor.CameraPro);
        }
        allotPrefab(_prefabs) {
            this.m_proList[EProcessor.CameraPro].startPor({ [PrefabNames.Camera]: [EnvironmentManager.instance.camera] });
        }
        allotMediator() {
        }
        allotOtherScenePrefab(_sceneName, _prefabs) {
        }
        allotOtherSceneMediator(_sceneName) {
        }
    }

    class RootDataProxyShell {
        constructor() {
            this.initData();
        }
        initData() { }
    }

    class GameDataProxyShell extends RootDataProxyShell {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new GameDataProxyShell();
            }
            return this.m_instance;
        }
        get gameData() {
            return this.m_gameData;
        }
        initData() {
            this.m_gameData = GameDataProxy.instance.saveData;
        }
        initCustoms(_maxCustoms) {
            _maxCustoms = Math.floor(_maxCustoms);
            if (this.m_gameData.maxCustoms == _maxCustoms) {
                return;
            }
            this.m_gameData.maxCustoms = _maxCustoms;
            if (this.m_gameData.onCustoms > _maxCustoms) {
                this.m_gameData.onCustoms = _maxCustoms;
            }
            if (this.m_gameData.maxCustomsRecord > _maxCustoms) {
                this.m_gameData.maxCustomsRecord = _maxCustoms;
            }
        }
        ifNewHandCustoms() {
            return this.m_gameData.onCustoms == ECommonLeve.NewHandLeveId && this.m_gameData.maxCustomsRecord <= ECommonLeve.NewHandLeveId;
        }
        setIfOpenBGM(_b) {
            this.m_gameData.ifOpenBgm = _b;
        }
        setIfOpenSound(_b) {
            this.m_gameData.ifOpenSound = _b;
        }
        setIfOpenVibrate(_b) {
            this.m_gameData.ifOpenVibrate = _b;
        }
        setCustoms(_n) {
            _n = Math.floor(_n);
            if (_n > this.m_gameData.maxCustoms) {
                return;
            }
            this.m_gameData.onCustoms = _n;
        }
        addCustoms(_number = 1) {
            _number = Math.floor(_number);
            let _sum = this.m_gameData.onCustoms + _number;
            let _win = false;
            if (_sum <= this.m_gameData.maxCustoms) {
                this.m_gameData.onCustoms = _sum;
                if (_sum > this.m_gameData.maxCustomsRecord) {
                    this.m_gameData.maxCustomsRecord = _sum;
                }
                _win = true;
            }
            else {
                this.m_gameData.onCustoms = ECommonLeve.DefaultLeveId;
                _win = true;
            }
            MesManager.instance.sendEvent(EEventUI.CustomsChange);
            return _win;
        }
        getDefaultCustoms() {
            if (this.m_gameData.onCustoms > this.m_gameData.maxCustoms) {
                this.m_gameData.onCustoms = ECommonLeve.DefaultLeveId;
            }
            return this.m_gameData.onCustoms;
        }
        getPreloadCustoms() {
            return this.getNextCustoms();
        }
        getNextCustoms() {
            let _customs = this.m_gameData.onCustoms + 1;
            if (_customs > this.m_gameData.maxCustoms) {
                _customs = ECommonLeve.DefaultLeveId;
            }
            return _customs;
        }
    }

    class CustomsManager {
        constructor() {
            this.m_ifInit = false;
            this.m_otherScene = {};
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new CustomsManager();
            }
            return this.m_instance;
        }
        get ifSceneBuild() {
            return this.m_ifSceneBuild;
        }
        init() {
            this.m_ifSceneBuild = false;
            GameDataProxyShell.instance.initCustoms(LevelConfigProxy.instance.getLevelNumber());
            MesManager.instance.onEvent(EEventScene.GameLevelsBuild, this, this.gameLevelsBuild);
            MesManager.instance.onEvent(EEventScene.GameLevelsDelete, this, this.gameLevelsDelete);
            MesManager.instance.onEvent(EEventScene.GameOtherLevelsBuild, this, this.gameOtherLevelsBuild);
            MesManager.instance.onEvent(EEventScene.GameOtherLevelsDelete, this, this.gameOtherLevelsDelete);
        }
        initLevelBuild() {
            this.gameLevelsBuild();
        }
        gameLevelsBuild(_handler) {
            if (this.m_ifSceneBuild) {
                console.warn('有场景正在构建！');
                return;
            }
            let lvId;
            if (this.m_ifInit) {
                lvId = GameDataProxy.instance.saveData.onCustoms;
            }
            else {
                this.m_ifInit = true;
                lvId = GameDataProxyShell.instance.getDefaultCustoms();
            }
            let scene = SceneManager.instance.getSceneByLv(lvId);
            this.m_scene = scene;
            this.m_ifSceneBuild = true;
            MesManager.instance.sendEvent(EEventScene.GameLevelsBuildBefore);
            MesManager.instance.sendEvent(EEventUI.SceneGameCustomsLoading, [-1]);
            scene.buildScene(Laya.Handler.create(this, this.customsProgress, null, false)).then((_sceneSpr) => {
                this.m_ifSceneBuild = false;
                EnvironmentManager.instance.setEnvironment(this.m_scene.scene);
                ProManager.instance.AllotPre(scene.prefabs);
                ConManager.addScrCon(scene.scene);
                ConManager.addCommonCon();
                if (Const.ifPreloadCustoms) {
                    let _preloadCustoms = GameDataProxyShell.instance.getPreloadCustoms();
                    SceneManager.instance.preloadSceneRes(_preloadCustoms);
                }
                this.onCustomsInit(lvId);
                if (_handler) {
                    _handler.run();
                }
                MesManager.instance.sendEvent(EEventScene.GameLevelsOnBuild);
                MesManager.instance.sendEvent(EEventUI.SceneGameCustomsInit);
            });
        }
        onCustomsInit(_lvId) {
        }
        customsProgress(_number) {
            if (!this.m_ifSceneBuild)
                return;
            if (typeof _number == 'undefined') {
                _number = 1;
            }
            MesManager.instance.sendEvent(EEventUI.SceneGameCustomsLoading, [_number * 100]);
        }
        gameLevelsDelete() {
            MesManager.instance.sendEvent(EEventScene.GameLevelsDeleteBefore);
            if (this.m_scene && this.m_scene.scene) {
                this.m_scene.clearScene();
            }
            this.m_scene = null;
            MesManager.instance.sendEvent(EEventScene.GameLevelsOnDelete);
            MesManager.instance.sendEvent(EEventUI.SceneGameCustomDelete);
        }
        gameOtherLevelsBuild(_name, _handler) {
            if (this.m_ifSceneBuild) {
                console.warn('有场景正在构建！');
                return;
            }
            let _scene = SceneManager.instance.getOtherSceneByName(_name);
            this.m_otherScene[_name] = _scene;
            this.m_ifSceneBuild = true;
            MesManager.instance.sendEvent(EEventScene.GameLevelsBuildBefore);
            MesManager.instance.sendEvent(EEventUI.SceneGameCustomsLoading, [-1]);
            _scene.buildScene(Laya.Handler.create(this, this.customsProgress, null, false)).then((_sceneSpr) => {
                this.m_ifSceneBuild = false;
                EnvironmentManager.instance.setOtherEnvironment(_name, _sceneSpr);
                ProManager.instance.AllotOtherScenePre(_name, _scene.prefabs);
                if (_handler) {
                    _handler.run();
                }
            });
        }
        gameOtherLevelsDelete(_name) {
            let _scene = this.m_otherScene[_name];
            if (_scene) {
                _scene.clearScene();
                this.m_otherScene[_name] = undefined;
            }
            else {
                console.warn('试图清除不存在的场景！');
            }
        }
    }

    var ESpecialUIIndex;
    (function (ESpecialUIIndex) {
        ESpecialUIIndex["anim_enter"] = "m_anim_enter";
        ESpecialUIIndex["anim_exit"] = "m_anim_exit";
    })(ESpecialUIIndex || (ESpecialUIIndex = {}));

    var EUILayer;
    (function (EUILayer) {
        EUILayer["Bg"] = "EUILayer_Bg";
        EUILayer["Main"] = "EUILayer_Main";
        EUILayer["OneUI"] = "EUILayer_OneUI";
        EUILayer["Panel"] = "EUILayer_Panel";
        EUILayer["Popup"] = "EUILayer_Popup";
        EUILayer["Prop"] = "EUILayer_Prop";
        EUILayer["Tip"] = "EUILayer_Tip";
        EUILayer["Pause"] = "EUILayer_Pause";
        EUILayer["Set"] = "EUILayer_Set";
        EUILayer["Top"] = "EUILayer_Top";
        EUILayer["Loading"] = "EUILayer_Loading";
        EUILayer["Native"] = "EUILayer_Native";
    })(EUILayer || (EUILayer = {}));

    class FGuiData {
        constructor() {
            this.ifUpdate = true;
            this.top = 0;
            this.bottom = 0;
            this.tweenTime = 0;
        }
    }

    class FGuiRootManager {
        static getLayer(layerType) {
            return this.LayerList[layerType];
        }
        static Init() {
            fgui.UIConfig.packageFileExtension = "bin";
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            this.LayerList = {};
            for (let _i in EUILayer) {
                this.LayerList[EUILayer[_i]] = fgui.GRoot.inst.addChild(new fgui.GComponent());
            }
            this.UpdateAllUI();
            Laya.stage.on(Laya.Event.RESIZE, this, this.UpdateAllUI);
        }
        static AddUI(uiType, fguiData, layer) {
            let ui = uiType.createInstance();
            if (layer == EUILayer.OneUI) {
                let oneUIs = FGuiRootManager.oneUIs;
                if (oneUIs.length > 0) {
                    oneUIs.forEach((panel) => {
                        panel && panel.Hide();
                    });
                }
                FGuiRootManager.oneUIs = [];
            }
            this.getLayer(layer).addChild(ui);
            let _key = Symbol('fguiData');
            this._cacheFguiData[_key] = fguiData;
            ui[this.m_uiDataKey] = _key;
            this.setUIData(ui, fguiData);
            return ui;
        }
        static setUIToTopShow(_ui, _layer) {
            let _layerCom = this.getLayer(_layer);
            let _index = _layerCom.getChildIndex(_ui);
            if (_index == -1) {
                console.log(...ConsoleEx.packWarn('设置ui到最顶层失败，因为该层级里面没有该UI！'));
                return;
            }
            _ui.removeFromParent();
            _layerCom.addChild(_ui);
        }
        static UpdateAllUI() {
            let setWidth = Laya.stage.width;
            let setHeight = Laya.stage.height;
            fgui.GRoot.inst.setSize(setWidth, setHeight);
            let ui;
            let _ui;
            for (let i = 0, length = fgui.GRoot.inst.numChildren; i < length; ++i) {
                ui = fgui.GRoot.inst.getChildAt(i);
                ui.setSize(setWidth, setHeight);
                ui.y = 0;
                for (let _i = 0, _length = ui.numChildren; _i < _length; _i++) {
                    _ui = ui.getChildAt(_i);
                    let getData = this._cacheFguiData[_ui[this.m_uiDataKey]];
                    if (getData.ifUpdate) {
                        this.setUIData(_ui, getData);
                    }
                }
            }
        }
        static setUIData(_ui, _uiData = new FGuiData()) {
            _ui.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height - _uiData.top - _uiData.bottom);
            _ui.y = _uiData.top;
        }
        static CheckIn(ui, x, y) {
            if (x > ui.x && x < ui.x + ui.width && y > ui.y && y < ui.y + ui.height) {
                return true;
            }
            return false;
        }
    }
    FGuiRootManager.m_uiDataKey = Symbol('$UIData');
    FGuiRootManager._cacheFguiData = {};
    FGuiRootManager.oneUIs = [];

    class BaseUIMediator {
        constructor() {
            this._layer = EUILayer.Panel;
            this._ifBelongUIMediator = false;
            this._belongDownUIMediator = [];
            this._belongUpUIMediator = [];
            this._isShow = false;
            this.m_serialNumber = BaseUIMediatorGlobalSerialNumber.GlobalSerialNumber;
        }
        get ui() {
            return this._ui;
        }
        get serialNumber() {
            return this.m_serialNumber;
        }
        get layer() {
            return this._layer;
        }
        get _fguiData() {
            return new FGuiData;
        }
        get ifBelongUIMediator() {
            return this._ifBelongUIMediator;
        }
        get belongDownUIMediator() {
            return this._belongDownUIMediator;
        }
        get belongUpUIMediator() {
            return this._belongUpUIMediator;
        }
        get isShow() {
            return this._isShow;
        }
        get isDispose() {
            return this.ui.isDisposed;
        }
        set keyId(_s) {
            this.m_keyId = _s;
        }
        get keyId() {
            return this.m_keyId;
        }
        setUIToTopShow() {
            if (this._ui) {
                FGuiRootManager.setUIToTopShow(this._ui, this._layer);
            }
        }
        Show() {
            if (this._isShow) {
                this.setUIToTopShow();
                return;
            }
            this.OnshowBefore();
            this._isShow = true;
            if (!this._ui || (this._ui && this._ui.isDisposed)) {
                this._ui = FGuiRootManager.AddUI(this._classDefine, this._fguiData, this._layer);
                if (this._layer == EUILayer.OneUI) {
                    FGuiRootManager.oneUIs.push(this);
                }
            }
            else {
                this.ui.visible = true;
            }
            this.setUIToTopShow();
            this._OnShow();
            if (this._ui[ESpecialUIIndex.anim_enter]) {
                let anim = this._ui[ESpecialUIIndex.anim_enter];
                anim.play(Laya.Handler.create(this, this._CallEnterAnimEnd));
            }
            else {
                this.OnEnterAnimEnd();
            }
        }
        _CallEnterAnimEnd() {
            this.OnEnterAnimEnd();
        }
        OnEnterAnimEnd() { }
        OnshowBefore() { }
        _OnShow() { }
        Hide(dispose = true) {
            if (this._ui == null)
                return;
            if (this._ui.isDisposed)
                return;
            if (!this._isShow)
                return;
            this._isShow = false;
            this.OnHideBefore();
            if (this._ui[ESpecialUIIndex.anim_exit]) {
                let anim = this._ui[ESpecialUIIndex.anim_exit];
                anim.play(Laya.Handler.create(this, this._DoHide, [dispose]));
            }
            else {
                this._DoHide(dispose);
            }
        }
        _DoHide(dispose) {
            if (dispose) {
                this._ui.dispose();
            }
            else {
                this._ui.visible = false;
            }
            this._OnHide();
        }
        OnHideBefore() { }
        _OnHide() { }
    }
    class BaseUIMediatorGlobalSerialNumber {
        static get GlobalSerialNumber() {
            this.m_GlobalSerialNumber++;
            return this.m_GlobalSerialNumber;
        }
    }
    BaseUIMediatorGlobalSerialNumber.m_GlobalSerialNumber = 0;

    class FGUI_PGameLoading extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameLoading"));
        }
        onConstruct() {
            this.m_shade = (this.getChildAt(0));
            this.m_text = (this.getChildAt(1));
            this.m_progress = (this.getChildAt(2));
        }
    }
    FGUI_PGameLoading.URL = "ui://kk7g5mmmg7a1o";

    class PGameLoadingMediator extends BaseUIMediator {
        constructor() {
            super();
            this._layer = EUILayer.Loading;
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameLoadingMediator();
                this.m_instance._classDefine = FGUI_PGameLoading;
            }
            return this.m_instance;
        }
        _OnShow() {
            MesManager.instance.onEvent(EEventGlobal.GameLoading, this, this.gameLoading);
        }
        gameLoading(_number) {
            this.ui.m_progress.value = _number;
        }
        _OnHide() {
            MesManager.instance.offEnent(EEventGlobal.GameLoading, this, this.gameLoading);
        }
    }

    class FGUI_PGameMain extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameMain"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGameMain.URL = "ui://kk7g5mmmsyta9f";

    class PGameMainMediator extends BaseUIMediator {
        constructor() {
            super();
            this._layer = EUILayer.Main;
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameMainMediator();
                this.m_instance._classDefine = FGUI_PGameMain;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    class FGUI_PGamePlay extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGamePlay"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGamePlay.URL = "ui://kk7g5mmmg7a1r";

    class PGamePlayMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGamePlayMediator();
                this.m_instance._classDefine = FGUI_PGamePlay;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    class FGUI_PGameStart extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameStart"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGameStart.URL = "ui://kk7g5mmmg7a1v";

    class PGameStartMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameStartMediator();
                this.m_instance._classDefine = FGUI_PGameStart;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    var EUI;
    (function (EUI) {
        EUI["GameLoading"] = "EUI_GameLoading";
        EUI["CustomsLoading"] = "EUI_CustomsLoading";
        EUI["TestMain"] = "EUI_TestMain";
        EUI["TestPlatform"] = "EUI_TestPlatform";
        EUI["Main"] = "EUI_Main";
        EUI["Set"] = "EUI_Set";
        EUI["Pause"] = "EUI_Pause";
        EUI["Play"] = "EUI_Play";
        EUI["Start"] = "EUI_Start";
        EUI["Com"] = "EUI_Com";
        EUI["End"] = "EUI_End";
    })(EUI || (EUI = {}));

    class RootUIStateManagerProxy extends RootClassProxy {
        constructor() {
            super(...arguments);
            this.m_UIMediator = {};
            this.m_onShowUI = [];
            this.m_ifSetMediatroList = false;
        }
        setProxyMediatroList(_UIMediator) {
            this.m_UIMediator = _UIMediator;
            this.m_onShowUI = [];
            this.m_ifSetMediatroList = true;
            this.Init();
        }
        Init() { }
        get ifSetMediatroList() {
            return this.m_ifSetMediatroList;
        }
        get onShowUIs() {
            return this.m_onShowUI;
        }
        getUIMeiatro(_eui) {
            return this.m_UIMediator[_eui];
        }
        closeUI(_uiMeiatro) {
            this.setUIState([
                { typeIndex: _uiMeiatro.keyId, state: false },
            ], false);
        }
        setUIState(_uiStates, _ifUnify = true, _unifyState = { state: false, dispose: true }, _showAffectLayer, _hideAffectLayer) {
            if (!this.m_ifSetMediatroList) {
                console.log(...ConsoleEx.packError('还没有为UI代理类设置代理UI调度者列表！'));
                return;
            }
            for (let _o of _uiStates) {
                if (typeof _o.state == 'undefined') {
                    _o.state = true;
                }
                if (typeof _o.dispose == 'undefined') {
                    _o.dispose = true;
                }
            }
            if (typeof _unifyState.dispose == 'undefined') {
                _unifyState.dispose = true;
            }
            let _showUI = [];
            let _hideUI = [];
            _uiStates = ArrayUtils.ObjUnique(_uiStates, (item) => {
                return item.typeIndex;
            });
            _uiStates = this.statesFilter(_uiStates);
            let _i;
            for (let _o of _uiStates) {
                if (_o.state) {
                    _i = this.m_onShowUI.findIndex((item) => { return item.typeIndex == _o.typeIndex; });
                    if (_i != -1) {
                        this.m_onShowUI.splice(_i, 1);
                    }
                    _showUI.push(_o);
                }
                else {
                    _i = this.m_onShowUI.findIndex((item) => { return item.typeIndex == _o.typeIndex; });
                    if (_i != -1) {
                        this.m_onShowUI.splice(_i, 1);
                        _hideUI.push(_o);
                    }
                }
            }
            if (_ifUnify) {
                let _differS = [];
                for (let _index in this.m_UIMediator) {
                    if (_showUI.findIndex((item) => { return item.typeIndex == _index; }) == -1 &&
                        _hideUI.findIndex((item) => { return item.typeIndex == _index; }) == -1) {
                        _differS.push({
                            typeIndex: _index,
                            state: _unifyState.state,
                            dispose: _unifyState.dispose,
                        });
                    }
                }
                if (_unifyState.state) {
                    _showUI.unshift(..._differS);
                }
                else {
                    _hideUI.push(..._differS);
                }
            }
            else {
                _showUI.unshift(...this.m_onShowUI);
            }
            if (typeof _showAffectLayer != 'undefined') {
                _showAffectLayer = ArrayUtils.Unique(_showAffectLayer);
                _showUI = _showUI.filter((item) => {
                    return _showAffectLayer.findIndex((layer) => { return layer == this.m_UIMediator[item.typeIndex].layer; }) != -1;
                });
            }
            if (typeof _hideAffectLayer != 'undefined') {
                _hideAffectLayer = ArrayUtils.Unique(_hideAffectLayer);
                _hideUI = _hideUI.filter((item) => {
                    return _hideAffectLayer.findIndex((layer) => { return layer == this.m_UIMediator[item.typeIndex].layer; }) != -1;
                });
            }
            for (let _o of _hideUI) {
                if (this.m_UIMediator[_o.typeIndex].ifBelongUIMediator) {
                    console.log(...ConsoleEx.packWarn('注意：有一个附属UI的UI调度者试图被隐藏，KEY为', this.m_UIMediator[_o.typeIndex].keyId));
                    continue;
                }
                this.hideUIMediator(this.m_UIMediator[_o.typeIndex], _o.dispose);
            }
            for (let _o of _showUI) {
                if (this.m_UIMediator[_o.typeIndex].ifBelongUIMediator) {
                    console.log(...ConsoleEx.packWarn('注意：有一个附属UI的UI调度者试图被显示，KEY为', this.m_UIMediator[_o.typeIndex].keyId));
                    continue;
                }
                this.showUIMediator(this.m_UIMediator[_o.typeIndex]);
            }
            this.m_onShowUI = _showUI;
        }
        statesFilter(_states) {
            return _states.filter((_o) => {
                return typeof this.m_UIMediator[_o.typeIndex] != 'undefined';
            });
        }
        hideUIMediator(_UIMed, _dispose, _ifR = false) {
            if (_UIMed.belongUpUIMediator.length > 0) {
                _UIMed.belongUpUIMediator.forEach((item) => {
                    this.hideUIMediator(item, _dispose, true);
                });
            }
            if (!_ifR || _UIMed.ifBelongUIMediator) {
                _UIMed.Hide(_dispose);
            }
            else {
                console.log(...ConsoleEx.packWarn('注意：有一个不是附属UI的UI调度者试图被隐藏，KEY为', _UIMed.keyId));
            }
            if (_UIMed.belongDownUIMediator.length > 0) {
                _UIMed.belongDownUIMediator.forEach((item) => {
                    this.hideUIMediator(item, _dispose, true);
                });
            }
        }
        showUIMediator(_UIMed, _ifR = false) {
            if (_UIMed.belongDownUIMediator.length > 0) {
                _UIMed.belongDownUIMediator.forEach((item) => {
                    this.showUIMediator(item, true);
                });
            }
            if (!_ifR || _UIMed.ifBelongUIMediator) {
                _UIMed.Show();
            }
            else {
                console.log(...ConsoleEx.packWarn('注意：有一个不是附属UI的UI调度者试图被显示，KEY为', _UIMed.keyId));
            }
            if (_UIMed.belongUpUIMediator.length > 0) {
                _UIMed.belongUpUIMediator.forEach((item) => {
                    this.showUIMediator(item, true);
                });
            }
        }
    }

    class UIManagerProxy extends RootUIStateManagerProxy {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new UIManagerProxy();
            }
            return this.m_instance;
        }
        get gameMainMediator() {
            return this.getUIMeiatro(EUI.Main);
        }
        Init() {
            MesManager.instance.onEvent(EEventGlobal.GameLoading, this, this.gameLoading);
            MesManager.instance.onEvent(EEventGlobal.GameResLoading, this, this.gameResLoading);
            MesManager.instance.onEvent(EEventUI.SceneGameCustomsLoading, this, this.gameCustomsLoading);
        }
        Start() {
            this.setUIState([
                { typeIndex: EUI.Main, },
                { typeIndex: EUI.Start, },
                { typeIndex: EUI.TestMain, },
            ]);
        }
        gameLoading() { }
        gameResLoading() { }
        gameCustomsLoading(_n) {
            if (_n == -1) {
                this.setUIState([
                    { typeIndex: EUI.CustomsLoading, },
                ], false);
            }
        }
    }

    class FGUI_PGameCustomsLoading extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameCustomsLoading"));
        }
        onConstruct() {
            this.m_shade = (this.getChildAt(0));
            this.m_text = (this.getChildAt(1));
            this.m_progress = (this.getChildAt(2));
        }
    }
    FGUI_PGameCustomsLoading.URL = "ui://kk7g5mmmdbmi13";

    class PGameCustomsLoadingMediator extends BaseUIMediator {
        constructor() {
            super();
            this._layer = EUILayer.Loading;
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameCustomsLoadingMediator();
                this.m_instance._classDefine = FGUI_PGameCustomsLoading;
            }
            return this.m_instance;
        }
        _OnShow() {
            MesManager.instance.onEvent(EEventUI.SceneGameCustomsLoading, this, this.CustomsLoading);
        }
        CustomsLoading(_number) {
            this.ui.m_progress.value = _number;
            if (_number == 100) {
                UIManagerProxy.instance.setUIState([
                    { typeIndex: EUI.CustomsLoading, state: false },
                ], false);
            }
        }
        _OnHide() {
            MesManager.instance.offEnent(EEventUI.SceneGameCustomsLoading, this, this.CustomsLoading);
        }
    }

    class FGUI_PGamePause extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGamePause"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGamePause.URL = "ui://kk7g5mmm6vcq5g";

    class PGamePauseMediator extends BaseUIMediator {
        constructor() {
            super();
            this._layer = EUILayer.Pause;
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGamePauseMediator();
                this.m_instance._classDefine = FGUI_PGamePause;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    class FGUI_PGameSet extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameSet"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGameSet.URL = "ui://kk7g5mmm6vcq4u";

    class PGameSetMediator extends BaseUIMediator {
        constructor() {
            super();
            this._layer = EUILayer.Set;
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameSetMediator();
                this.m_instance._classDefine = FGUI_PGameSet;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    class FGUI_PGameCom extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameCom"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGameCom.URL = "ui://kk7g5mmmq3ng9w";

    class PGameComMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameComMediator();
                this.m_instance._classDefine = FGUI_PGameCom;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    class FGUI_PGameEnd extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameEnd"));
        }
        onConstruct() {
            this.m_text = (this.getChildAt(0));
        }
    }
    FGUI_PGameEnd.URL = "ui://kk7g5mmmlaxd19";

    class PGameEndMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameEndMediator();
                this.m_instance._classDefine = FGUI_PGameEnd;
            }
            return this.m_instance;
        }
        _OnShow() {
        }
        _OnHide() { }
    }

    class FGUI_PGameTestMain extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameTestMain"));
        }
        onConstruct() {
            this.m_UIButton = (this.getChildAt(0));
            this.m_UI = (this.getChildAt(1));
            this.m_test = (this.getChildAt(3));
            this.m_testText = (this.getChildAt(4));
            this.m__test = (this.getChildAt(6));
        }
    }
    FGUI_PGameTestMain.URL = "ui://kk7g5mmmo9js9x";

    class FGUI_PGameTestUI extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameTestUI"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
        }
    }
    FGUI_PGameTestUI.URL = "ui://kk7g5mmmh66e9z";

    class PGameUITestMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameUITestMediator();
                this.m_instance._classDefine = FGUI_PGameTestUI;
            }
            return this.m_instance;
        }
        get _fguiData() {
            let _fguiData = new FGuiData();
            _fguiData.top = 100;
            _fguiData.bottom = 50;
            return _fguiData;
        }
        _OnShow() {
            this.ui.m_bg.onClick(this, this.close);
        }
        close() {
            this.Hide();
        }
        _OnHide() { }
    }

    class PGameTestMainMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameTestMainMediator();
                this.m_instance._classDefine = FGUI_PGameTestMain;
            }
            return this.m_instance;
        }
        _OnShow() {
            this.ui.m_test.onClick(this, this.Test);
            this.ui.m_UIButton.onClick(this, this.UITest);
        }
        Test() {
            UIManagerProxy.instance.setUIState([
                { typeIndex: EUI.TestPlatform },
            ], false);
        }
        UITest() {
            PGameUITestMediator.instance.Show();
        }
        _OnHide() { }
    }

    class PlatformData {
        constructor() {
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    class BDData extends PlatformData {
        constructor() {
            super(...arguments);
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    class OPPOData extends PlatformData {
        constructor() {
            super(...arguments);
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    class QQData extends PlatformData {
        constructor() {
            super(...arguments);
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    class QTTData extends PlatformData {
        constructor() {
            super(...arguments);
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    class TTData extends PlatformData {
        constructor() {
            super(...arguments);
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    class WXData extends PlatformData {
        constructor() {
            super(...arguments);
            this.appId = '';
            this.appKey = '';
            this.bannerId = '';
            this.rewardVideoId = '';
            this.interstitialId = '';
            this.nativeId = '';
            this.nativeBannerIds = [];
            this.nativeIconIds = [];
            this.nativeinterstitialIds = [];
            this.nativeinpageIds = [];
            this.shareId = '';
        }
    }

    var PlatformCommonEvent;
    (function (PlatformCommonEvent) {
        PlatformCommonEvent["PAUSE_AUDIO"] = "PAUSE_AUDIO";
        PlatformCommonEvent["RESUM_AUDIO"] = "RESUM_AUDIO";
        PlatformCommonEvent["AD_CONFIG_GETTED"] = "AD_CONFIG_GETTED";
        PlatformCommonEvent["SELF_AD_INITED"] = "SELF_AD_INITED";
    })(PlatformCommonEvent || (PlatformCommonEvent = {}));

    var EPlatformType;
    (function (EPlatformType) {
        EPlatformType["None"] = "EPlatformType_None";
        EPlatformType["Web"] = "EPlatformType_Web";
        EPlatformType["WX"] = "EPlatformType_WX";
        EPlatformType["TT"] = "EPlatformType_TT";
        EPlatformType["QQ"] = "EPlatformType_QQ";
        EPlatformType["VIVO"] = "EPlatformType_VIVO";
        EPlatformType["OPPO"] = "EPlatformType_OPPO";
        EPlatformType["BD"] = "EPlatformType_BD";
        EPlatformType["KG"] = "EPlatformType_KG";
        EPlatformType["Alipay"] = "EPlatformType_Alipay";
        EPlatformType["HW"] = "EPlatformType_HW";
        EPlatformType["QTT"] = "EPlatformType_QTT";
    })(EPlatformType || (EPlatformType = {}));

    class Awaiters {
        static NextFrame() {
            return this.Frames(2);
        }
        static Frames(num) {
            return new Promise(function (resolve) {
                Laya.timer.frameOnce(num, null, () => {
                    resolve();
                });
            });
        }
        static Seconds(num) {
            return new Promise(function (resolve) {
                Laya.timer.once(num * 1000, null, () => {
                    resolve();
                });
            });
        }
    }

    class DefaultDevice {
        Vibrate(isLong) {
            console.log("调用震动", isLong);
            if (!navigator.vibrate) {
                console.log("不支持设备震动！");
                return;
            }
            if (isLong) {
                navigator.vibrate(400);
            }
            else {
                navigator.vibrate(15);
            }
        }
    }

    class WXDevice extends DefaultDevice {
        Vibrate(isLong) {
            console.log("调用震动", isLong);
            if (window['wx']) {
                if (isLong) {
                    Laya.timer.callLater(wx, wx.vibrateLong, [null]);
                }
                else {
                    Laya.timer.callLater(wx, wx.vibrateShort, [null]);
                }
            }
        }
    }

    class PlatformManagerProxy extends RootClassProxy {
        static get instance() {
            if (this._instance == null) {
                this._instance = new PlatformManagerProxy();
            }
            return this._instance;
        }
        get PlatformInstance() {
            if (!this.m_platformInstance) {
                console.log(...ConsoleEx.packError('还没有设置过平台实例代理！'));
            }
            return this.m_platformInstance;
        }
        set PlatformInstance(_instance) {
            this.m_platformInstance = _instance;
        }
        static get platformStr() {
            return PlatformManagerProxy.GetPlatformStr(this._instance.m_platformInstance.platform);
        }
        static GetPlatformStr(platformEnum) {
            switch (platformEnum) {
                case EPlatformType.None:
                    return "未识别";
                case EPlatformType.Web:
                    return "网页";
                case EPlatformType.BD:
                    return "百度";
                case EPlatformType.OPPO:
                    return "Oppo";
                case EPlatformType.QQ:
                    return "QQ";
                case EPlatformType.TT:
                    return "头条";
                case EPlatformType.VIVO:
                    return "Vivo";
                case EPlatformType.WX:
                    return "微信";
                case EPlatformType.QTT:
                    return "趣头条";
                default:
                    return "未定义" + platformEnum;
            }
        }
    }

    class DefaultRecordManager {
        constructor() {
            this.supportRecord = false;
            this.isRecording = false;
            this.isPausing = false;
            this.isRecordSuccess = false;
        }
        StartRecord(onStart, onOverTime) {
            console.log("该平台" + PlatformManagerProxy.platformStr + "不支持录制视频");
        }
        StopRecord(onStop) {
            console.log("该平台" + PlatformManagerProxy.platformStr + "不支持录制视频");
        }
        Pause(onPause) {
            console.log("该平台" + PlatformManagerProxy.platformStr + "不支持录制视频");
        }
        Resume(onReume) {
            console.log("该平台" + PlatformManagerProxy.platformStr + "不支持录制视频");
        }
        RecordClip(timeRange) {
            console.log("该平台" + PlatformManagerProxy.platformStr + "不支持录制视频");
        }
        ShareVideo(onSuccess, onCancel, onFailed) {
            if (onFailed) {
                onFailed.run();
            }
        }
    }

    class MathUtils {
        static ToHex(num) {
            return num.toString(16);
        }
        static RandomFromArrayUtilscept(numArr, except) {
            let fakeRandomList = [];
            for (let i = 0; i < numArr.length; ++i) {
                if (except == numArr[i])
                    continue;
                fakeRandomList.push(numArr[i]);
            }
            return this.RandomFromArray(fakeRandomList);
        }
        static RandomFromArray(numArr) {
            let randomIndex = MathUtils.RandomInt(0, numArr.length);
            return numArr[randomIndex];
        }
        static RandomArrayFromArray(arr, count) {
            let result = [];
            let indexList = [];
            for (let i = 0; i < arr.length; ++i) {
                indexList.push(i);
            }
            for (let i = 0; i < count; ++i) {
                let randomIndex = MathUtils.RandomInt(0, indexList.length);
                let getIndex = indexList[randomIndex];
                ArrayUtils.RemoveAt(indexList, randomIndex);
                result.push(arr[getIndex]);
            }
            return result;
        }
        static RandomFromWithWeight(numArr, weightArr) {
            if (numArr == null || numArr.length == 0) {
                return null;
            }
            var totalWeight = 0;
            for (var weight of weightArr) {
                totalWeight += weight;
            }
            var randomWeight = MathUtils.Random(0, totalWeight);
            var currentWeight = 0;
            for (var i = 0; i < numArr.length; ++i) {
                currentWeight += weightArr[i];
                if (randomWeight < currentWeight) {
                    return numArr[i];
                }
            }
            return numArr[numArr.length - 1];
        }
        static RandomInt(min, maxAddOne) {
            return Math.floor(this.Random(min, maxAddOne));
        }
        static Random(min, maxAddOne) {
            return (maxAddOne - min) * Math.random() + min;
        }
        static randomRangeInt(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
        static RandomRatio(ratio) {
            let v = MathUtils.RandomInt(0, 10000) * 0.01;
            if (ratio > v) {
                return true;
            }
            return false;
        }
        static Clamp(value, min, max) {
            if (value < min)
                return min;
            if (value > max)
                return max;
            return value;
        }
        static Clamp01(value) {
            return this.Clamp(value, 0, 1);
        }
        static Sign(value) {
            if (value == 0)
                return 1;
            return value > 0 ? 1 : -1;
        }
        static GetNumCount(num) {
            var numberCount = 0;
            var newNumber = num;
            while (newNumber / 10 > 0) {
                newNumber = Math.floor(newNumber / 10);
                numberCount++;
            }
            return numberCount;
        }
        static Lerp(from, to, progress) {
            return from + (to - from) * MathUtils.Clamp01(progress);
        }
        static MoveTowardsAngle(current, target, maxDelta) {
            var num = MathUtils.DeltaAngle(current, target);
            if (0 - maxDelta < num && num < maxDelta) {
                return target;
            }
            target = current + num;
            return MathUtils.MoveTowards(current, target, maxDelta);
        }
        static MoveTowards(current, target, maxDelta) {
            if (Math.abs(target - current) <= maxDelta) {
                return target;
            }
            return current + Math.sign(target - current) * maxDelta;
        }
        static DeltaAngle(current, target) {
            var num = MathUtils.Repeat(target - current, 360);
            if (num > 180) {
                num -= 360;
            }
            return num;
        }
        static Repeat(t, length) {
            return MathUtils.Clamp(t - Math.floor(t / length) * length, 0, length);
        }
        static IsSimilar(n1, n2) {
            return n1 == n2;
        }
    }
    MathUtils.Deg2Rad = 0.0175;
    MathUtils.Rad2Deg = 57.2958;

    class ShareInfo {
    }

    class ShareManager {
        constructor() {
            this._shareInfoList = [];
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new ShareManager();
            }
            return this._instance;
        }
        AddShareInfo(shareInfo) {
            for (let getInfo of this._shareInfoList) {
                if (getInfo.shareId == shareInfo.shareId)
                    return;
            }
            this._shareInfoList.push(shareInfo);
        }
        GetShareInfo(id = null) {
            if (this._shareInfoList.length == 0) {
                let fakeShareInfo = new ShareInfo();
                return fakeShareInfo;
            }
            if (id != null) {
                for (let shareInfo of this._shareInfoList) {
                    if (shareInfo.shareId == id)
                        return shareInfo;
                }
            }
            let randomShare = MathUtils.RandomFromArray(this._shareInfoList);
            return randomShare;
        }
        ShareAppMessage(shareInfo) {
            PlatformManagerProxy.instance.PlatformInstance.ShareAppMessage(shareInfo, Laya.Handler.create(this, () => {
                console.log("分享成功");
            }), null);
        }
    }

    class WXPlatform {
        constructor() {
            this.platform = EPlatformType.WX;
            this.safeArea = null;
            this.recordManager = new DefaultRecordManager();
            this.device = new WXDevice();
            this.loginCode = null;
            this.isSupportJumpOther = true;
            this._isBannerLoaded = false;
            this._isVideoLoaded = false;
            this._isInterstitialLoaded = false;
            this._cacheVideoAD = false;
            this.NavigateToAppSuccess = null;
        }
        Init(platformData) {
            this._base = window["wx"];
            if (this._base == null) {
                console.error(...ConsoleEx.packError("平台初始化错误", PlatformManagerProxy.platformStr));
                return;
            }
            this.platformData = platformData;
            this.recordManager.Platform = this;
            this._InitLauchOption();
            this._Login();
            this._InitShareInfo();
            this._InitSystemInfo();
            this._CreateBannerAd();
            this._CreateVideoAd();
            this._CreateInterstitalAd();
            window["iplatform"] = this;
        }
        _CheckUpdate() {
            let updateManager = this._base.getUpdateManager();
            if (updateManager == null)
                return;
            updateManager.onCheckForUpdate(function (res) {
                console.log("onCheckForUpdate", res.hasUpdate);
                if (res.hasUpdate) {
                    this._base.showToast({
                        title: "即将有更新请留意"
                    });
                }
            });
            updateManager.onUpdateReady(() => {
                this._base.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否立即使用？",
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                        else {
                            this._base.showToast({
                                icon: "none",
                                title: "小程序下一次「冷启动」时会使用新版本"
                            });
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(() => {
                this._base.showToast({
                    title: "更新失败，下次启动继续..."
                });
            });
        }
        _Login() {
            this.loginState = {
                isLogin: false,
                code: ""
            };
            let loginData = {};
            loginData.success = (res) => {
                this.loginCode = res.code;
                this._OnLoginSuccess(res);
                console.error(this.loginState);
            };
            loginData.fail = (res) => {
                console.error(PlatformManagerProxy.platformStr, "登录失败", res);
                this.loginState.isLogin = false;
                this.loginState.code = "";
            };
            loginData.complete = () => {
                if (this.onLoginEnd != null) {
                    this.onLoginEnd.run();
                }
            };
            this._base.login(loginData);
        }
        GetStorage(key) {
            if (this.base && this.base.getStorageSync && key) {
                try {
                    return this.base.getStorageSync(key);
                }
                catch (error) {
                    console.log('getStorageSync error: ', JSON.stringify(error));
                    return null;
                }
            }
        }
        SetStorage(key, data) {
            if (this.base && this.base.getStorageSync && key) {
                try {
                    return this.base.setStorageSync(key, data);
                }
                catch (error) {
                    console.log('setStorageSync error: ', JSON.stringify(error));
                }
            }
        }
        _OnLoginSuccess(res) {
            console.log(PlatformManagerProxy.platformStr, "登录成功", res);
            this.loginState.isLogin = true;
            this.loginState.code = res.code;
        }
        _InitLauchOption() {
            this._base.onShow(this._OnShow);
            this._base.onHide(this._OnHide);
            let res = this._base.getLaunchOptionsSync();
            this._OnShow(res);
        }
        _InitShareInfo() {
            this._base.showShareMenu({
                withShareTicket: true,
                success: (res) => {
                    console.log("InitShareSuccess", res);
                },
                fail: (res) => {
                    console.log("InitShareFailed", res);
                },
                complete: (res) => {
                    console.log("InitShareComplete", res);
                }
            });
            this._base.onShareAppMessage(() => {
                let shareInfo = ShareManager.instance.GetShareInfo();
                return WXPlatform._WrapShareInfo(shareInfo);
            });
        }
        static _WrapShareInfo(shareInfo) {
            let shareObj = {};
            if (shareInfo.shareTitle) {
                shareObj["title"] = shareInfo.shareTitle;
            }
            if (shareInfo.shareImg) {
                shareObj["imageUrl"] = shareInfo.shareImg;
            }
            if (shareInfo.sharePath) {
                shareObj["query"] = {};
                let pathSplit = shareInfo.sharePath.split("?");
                let params = pathSplit[1].split("&");
                for (let getParam of params) {
                    let splitParam = getParam.split("=");
                    shareObj["query"][splitParam[0]] = splitParam[1];
                }
            }
            return shareObj;
        }
        _InitSystemInfo() {
            this.base = this._base;
            try {
                this.systemInfo = this._base.getSystemInfoSync();
                console.log("系统信息已获取", this.systemInfo);
                this.safeArea = this.systemInfo.safeArea;
                this._cacheScreenScale = this.systemInfo.screenWidth / Laya.stage.width;
            }
            catch (e) {
                console.error(e);
                console.error("获取设备信息失败,执行默认初始化");
                this.safeArea = null;
            }
        }
        _CreateInterstitalAd() {
            if (StringUtils.IsNullOrEmpty(this.platformData.interstitialId)) {
                console.log("无有效的插页广告ID,取消加载");
                return;
            }
            this._interstitalFailedCount = 0;
            let intAdObj = {};
            intAdObj["adUnitId"] = this.platformData.interstitialId;
            this._intersitialAd = this._base.createInterstitialAd(intAdObj);
            if (!this._intersitialAd)
                return;
            this._intersitialAd.onLoad(() => {
                console.log("插页广告加载成功");
                this._isInterstitialLoaded = true;
            });
            this._intersitialAd.onError((err) => {
                this._interstitalFailedCount++;
                console.error("插页广告加载失败", err);
                if (this._interstitalFailedCount > 10) {
                    console.log("第", this._interstitalFailedCount, "次重新加载插页广告");
                    this._intersitialAd.load();
                }
            });
        }
        _CreateVideoAd() {
            console.log('vedio ad id', this.platformData.rewardVideoId);
            if (!this._cacheVideoAD) {
                console.log("当前策略为不缓存视频广告");
                return;
            }
            let createRewardedVideoAd = this._base["createRewardedVideoAd"];
            if (createRewardedVideoAd == null) {
                console.error("无createRewardedVideoAd方法,跳过初始化");
                return;
            }
            if (StringUtils.IsNullOrEmpty(this.platformData.rewardVideoId)) {
                console.log("无有效的视频广告ID,取消加载");
                return;
            }
            this._videoFailedCount = 0;
            let videoObj = {};
            videoObj["adUnitId"] = this.platformData.rewardVideoId;
            this._rewardVideo = createRewardedVideoAd(videoObj);
            this._rewardVideo.onLoad(() => {
                console.log("视频广告加载成功");
                this._isVideoLoaded = true;
            });
            this._rewardVideo.onError((res) => {
                this._videoFailedCount++;
                console.error("视频广告加载失败", res);
                if (this._videoFailedCount > 10) {
                    console.log("第", this._videoFailedCount, "次重新加载视频广告");
                    this._rewardVideo.load();
                }
            });
            this._rewardVideo.onClose((res) => {
                Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                console.log("视频回调", res);
                let isEnd = res["isEnded"];
                Awaiters.NextFrame().then(() => {
                    if (isEnd) {
                        if (this._rewardSuccessed)
                            this._rewardSuccessed.run();
                    }
                    else {
                        if (this._rewardSkipped)
                            this._rewardSkipped.run();
                    }
                });
            });
        }
        _CreateBannerAd() {
            if (StringUtils.IsNullOrEmpty(this.platformData.bannerId)) {
                console.log("无有效的banner广告ID,取消加载");
                return;
            }
            let windowWidth = this._base.getSystemInfoSync().windowWidth;
            let windowHeight = this._base.getSystemInfoSync().windowHeight;
            let bannerObj = {};
            bannerObj["adUnitId"] = this.platformData.bannerId;
            bannerObj["adIntervals"] = 30;
            let styleObj = {};
            styleObj["left"] = 0;
            styleObj["top"] = 0;
            styleObj["width"] = 300;
            bannerObj["style"] = styleObj;
            this._bannerAd = this._base.createBannerAd(bannerObj);
            this._isBannerLoaded = false;
            this._bannerAd.onLoad(() => {
                console.log("banner加载成功");
                this._isBannerLoaded = true;
                this._bannerAd.style.top = windowHeight - this._bannerAd.style.realHeight;
                this._bannerAd.style.left = (windowWidth - this._bannerAd.style.realWidth) / 2;
            });
            this._bannerAd.onError((res) => {
                console.error("banner广告加载失败", res);
            });
        }
        IsBannerAvaliable() {
            return this._isBannerLoaded;
        }
        IsVideoAvaliable() {
            return this._isVideoLoaded;
        }
        IsInterstitalAvaliable() {
            return this._isInterstitialLoaded;
        }
        ShowBannerAd() {
            if (!this.IsBannerAvaliable()) {
                return;
            }
            this._bannerAd.show();
        }
        HideBannerAd() {
            this._bannerAd.hide();
        }
        _DoCacheShowVideo(onSuccess, onSkipped) {
            if (!this._isVideoLoaded) {
                console.error("视频广告尚未加载好");
                return;
            }
            this._rewardSuccessed = onSuccess;
            this._rewardSkipped = onSkipped;
            this._isVideoLoaded = false;
            Laya.stage.event(PlatformCommonEvent.PAUSE_AUDIO);
            this._rewardVideo.show();
        }
        _DoNoCacheShowVideo(onSuccess, onSkipped) {
            this._rewardSuccessed = onSuccess;
            this._rewardSkipped = onSkipped;
            if (StringUtils.IsNullOrEmpty(this.platformData.rewardVideoId)) {
                console.log("无有效的视频广告ID,取消加载");
                onSkipped.run();
                return;
            }
            let createRewardedVideoAd = this._base["createRewardedVideoAd"];
            if (createRewardedVideoAd == null) {
                console.error("无createRewardedVideoAd方法,跳过初始化");
                onSkipped.run();
                return;
            }
            this._videoFailedCount = 0;
            let videoObj = {};
            videoObj["adUnitId"] = this.platformData.rewardVideoId;
            if (this._rewardVideo) {
                this._rewardVideo.offClose(this.onVideoClose);
            }
            this._rewardVideo = createRewardedVideoAd(videoObj);
            this._rewardVideo.onLoad(() => {
                console.log("视频广告加载成功");
                this._isVideoLoaded = true;
            });
            this._rewardVideo.onError((res) => {
                this._videoFailedCount++;
                console.error("视频广告加载失败", res, this._videoFailedCount);
            });
            this._rewardVideo.onClose((res) => {
                Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                console.log("视频回调", res);
                let isEnd = res["isEnded"];
                Awaiters.NextFrame().then(() => {
                    if (isEnd) {
                        if (this._rewardSuccessed)
                            this._rewardSuccessed.run();
                    }
                    else {
                        if (this._rewardSkipped)
                            this._rewardSkipped.run();
                    }
                });
            });
            this._rewardVideo.load().then(() => {
                console.log("激励视频 加载成功");
                return this._rewardVideo.show().then(() => {
                }).catch((err) => {
                    console.error(err);
                });
                ;
            });
        }
        onVideoClose(res) {
            Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
            console.log("视频回调", res);
            let isEnd = res["isEnded"];
            Awaiters.NextFrame().then(() => {
                if (isEnd) {
                    if (this._rewardSuccessed)
                        this._rewardSuccessed.run();
                }
                else {
                    if (this._rewardSkipped)
                        this._rewardSkipped.run();
                }
            });
        }
        ShowRewardVideoAd(onSuccess, onSkipped) {
            if (this._cacheVideoAD) {
                this._DoCacheShowVideo(onSuccess, onSkipped);
            }
            else {
                this._DoNoCacheShowVideo(onSuccess, onSkipped);
            }
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (resolve) {
                PlatformManagerProxy.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    resolve(true);
                }), Laya.Handler.create(this, () => {
                    resolve(false);
                }));
            });
        }
        ShowInterstitalAd() {
            if (!this._isInterstitialLoaded) {
                console.error("插页广告尚未加载好");
                return;
            }
            this._intersitialAd.show();
        }
        GetFromAppId() {
            if (this.lauchOption.referrerInfo == null) {
                return null;
            }
            if (StringUtils.IsNullOrEmpty(this.lauchOption.referrerInfo.appId)) {
                return null;
            }
            return this.lauchOption.referrerInfo.appId;
        }
        _OnShow(res) {
            console.log(PlatformManagerProxy.platformStr, "OnShow", res);
            PlatformManagerProxy.instance.PlatformInstance.lauchOption = res;
            PlatformManagerProxy.instance.PlatformInstance._CheckUpdate();
            this.NavigateToAppSuccess = null;
            Awaiters.NextFrame().then(() => {
                if (PlatformManagerProxy.instance.PlatformInstance.onResume) {
                    PlatformManagerProxy.instance.PlatformInstance.onResume.runWith(res);
                }
            });
        }
        _OnHide(res) {
            console.log(PlatformManagerProxy.platformStr, "OnHide", res);
            if (PlatformManagerProxy.instance.PlatformInstance.onPause) {
                PlatformManagerProxy.instance.PlatformInstance.onPause.runWith(res);
            }
            if (this.NavigateToAppSuccess) {
                this.NavigateToAppSuccess();
            }
        }
        ShareAppMessage(shareInfo, onSuccess, onFailed) {
            console.log("分享消息", shareInfo);
            let shareObj = WXPlatform._WrapShareInfo(shareInfo);
            this._base.shareAppMessage(shareObj);
            if (onSuccess) {
                onSuccess.run();
            }
        }
        LoadSubpackage(name, onSuccess, onFailed, onProgress) {
            if (this._base['loadSubpackage'] == null) {
                console.log("无加载子包方法,跳过加载子包", name);
                if (onSuccess) {
                    onSuccess.run();
                }
                return;
            }
            let loadObj = {};
            loadObj["name"] = name;
            loadObj["success"] = () => {
                console.log("分包加载成功", name);
                if (onSuccess) {
                    onSuccess.run();
                }
            };
            loadObj["fail"] = () => {
                console.error("分包加载失败", name);
                if (onFailed) {
                    onFailed.run();
                }
            };
            let loadTask = this._base.loadSubpackage(loadObj);
            loadTask.onProgressUpdate((res) => {
                if (Laya.Browser.onMobile) {
                    console.log("分包加载进度", res);
                }
                if (onProgress) {
                    onProgress.runWith(res.progress / 100);
                }
            });
        }
        RecordEvent(eventId, param) {
            console.log("记录事件", eventId, param);
            let aldSendEvent = this._base["aldSendEvent"];
            if (aldSendEvent == null) {
                console.error("阿拉丁sdk尚未接入,请检查配置");
                return;
            }
            if (param != null) {
                aldSendEvent(eventId, param);
            }
            else {
                aldSendEvent(eventId);
            }
        }
        CreateShareVideoBtn(x, y, width, height) {
            let btnObj = {};
            btnObj.style = {
                left: x * this._cacheScreenScale,
                top: y * this._cacheScreenScale,
                height: height * this._cacheScreenScale,
                width: width * this._cacheScreenScale
            };
            btnObj.share = {
                query: {
                    tick: 1
                },
                bgm: "",
                timeRange: [0, 60 * 1000]
            };
            if (this._shareVideoBtn == null) {
                this._shareVideoBtn = this._base.createGameRecorderShareButton(btnObj);
            }
            else {
                this._shareVideoBtn.show();
            }
        }
        HideShareVideoBtn() {
            if (this._shareVideoBtn != null) {
                this._shareVideoBtn.hide();
            }
        }
        ShowToast(str) {
            this._base.showToast({
                title: str,
                duration: 2000
            });
        }
        OpenGameBox(appIds) {
            console.error("当前平台", PlatformManagerProxy.platformStr, "暂不支持互推游戏盒子");
        }
        NavigateToApp(appid, path, extra, showGC, isbanner, adid) {
            return new Promise((resolve, reject) => {
                if (showGC) {
                }
                wx.navigateToMiniProgram({
                    appId: appid,
                    path: path,
                    extraData: extra,
                    envVersion: '',
                    success: (res) => {
                        console.log('小游戏跳转成功', res);
                        resolve(true);
                    },
                    fail: () => {
                        console.log('小游戏跳转失败：');
                        reject(false);
                        if (showGC) {
                        }
                    },
                    complete: () => { }
                });
            });
        }
        createShortcut() {
            console.log('暂未实现');
        }
    }

    class BDPlatform extends WXPlatform {
        constructor() {
            super(...arguments);
            this.platform = EPlatformType.BD;
            this._showVideoLoad = false;
        }
        Init(platformData) {
            this._base = window["swan"];
            if (this._base == null) {
                console.error(...ConsoleEx.packError("平台初始化错误"));
                return;
            }
            this.platformData = platformData;
            this.recordManager.Platform = this;
            this._InitLauchOption();
            this._InitShareInfo();
            this._InitSystemInfo();
            this._isBannerLoaded = false;
            this._isBannerShowed = false;
            this._CreateVideoAd();
            this._CreateInterstitalAd();
            window["iplatform"] = this;
        }
        _CreateBannerAd() {
            if (StringUtils.IsNullOrEmpty(this.platformData.bannerId)) {
                console.log("无有效的banner广告ID,取消加载");
                return;
            }
            let windowWidth = this._base.getSystemInfoSync().windowWidth;
            let windowHeight = this._base.getSystemInfoSync().windowHeight;
            let bannerObj = {};
            bannerObj["adUnitId"] = this.platformData.bannerId;
            bannerObj["appSid"] = this.platformData.sid;
            let styleObj = {};
            styleObj["left"] = 0;
            styleObj["top"] = 0;
            styleObj["width"] = windowWidth;
            bannerObj["style"] = styleObj;
            this._bannerAd = this._base.createBannerAd(bannerObj);
            this._bannerAd.onLoad(() => {
                console.log("banner加载成功");
                this._isBannerLoaded = true;
                this._bannerAd.style.top = windowHeight - this._bannerAd.style.height;
                this._bannerAd.show();
            });
            this._bannerAd.onError((res) => {
                console.error("banner广告加载失败", res);
            });
        }
        _CreateVideoAd() {
            if (StringUtils.IsNullOrEmpty(this.platformData.rewardVideoId)) {
                console.log("无有效的视频广告ID,取消加载");
                return;
            }
            this._videoFailedCount = 0;
            let videoObj = {};
            videoObj["adUnitId"] = this.platformData.rewardVideoId;
            videoObj["appSid"] = this.platformData.sid;
            this._rewardVideo = this._base.createRewardedVideoAd(videoObj);
            this._rewardVideo.onLoad(() => {
                console.log("视频广告加载成功");
                this._isVideoLoaded = true;
            });
            this._rewardVideo.onError((res) => {
                this._videoFailedCount++;
                console.error("视频广告加载失败", res);
                if (this._videoFailedCount > 10) {
                    console.log("第", this._videoFailedCount, "次重新加载视频广告");
                    this._rewardVideo.load();
                }
            });
            this._rewardVideo.onClose((res) => {
                this._base.hideLoading();
                Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                console.log("视频回调", res);
                let isEnd = res["isEnded"];
                if (isEnd) {
                    if (this._rewardSuccessed)
                        this._rewardSuccessed.run();
                }
                else {
                    if (this._rewardSkipped)
                        this._rewardSkipped.run();
                }
                this._rewardVideo.load();
            });
        }
        _CreateInterstitalAd() {
        }
        LoadSubpackage(name, onSuccess, onFailed, onProgress) {
            let loadObj = {};
            loadObj["name"] = name;
            loadObj["success"] = () => {
                console.log("分包加载成功", name);
                if (onSuccess) {
                    onSuccess.run();
                }
            };
            loadObj["fail"] = () => {
                console.error("分包加载失败", name);
                if (onFailed) {
                    onFailed.run();
                }
            };
            let loadTask = this._base.loadSubpackage(loadObj);
            loadTask.onProgressUpdate((res) => {
                if (onProgress) {
                    let value = res.progress / 100;
                    if (isNaN(value)) {
                        value = res.loaded / res.total;
                    }
                    onProgress.runWith(value);
                }
            });
        }
        RecordEvent(eventId, param) {
            this._base.reportAnalytics(eventId, param);
        }
        ShowBannerAd() {
            if (this._isBannerLoaded) {
                return;
            }
            this._CreateBannerAd();
        }
        HideBannerAd() {
            if (!this._isBannerLoaded)
                return;
            this._isBannerLoaded = false;
            if (this._bannerAd) {
                this._bannerAd.destroy();
            }
        }
    }

    class WebRecordManager extends DefaultRecordManager {
        constructor() {
            super(...arguments);
            this.supportRecord = false;
        }
        ShareVideo(onSuccess, onCancel, onFailed) {
            if (this.supportRecord) {
                console.log("强制模拟成功");
                if (onSuccess) {
                    onSuccess.run();
                }
            }
            else {
                console.log("强制模拟失败");
                if (onFailed) {
                    onFailed.run();
                }
            }
        }
    }

    class DefaultPlatform {
        constructor() {
            this.platform = EPlatformType.Web;
            this.safeArea = null;
            this.recordManager = new WebRecordManager();
            this.device = new DefaultDevice();
            this.systemInfo = null;
            this.isSupportJumpOther = true;
        }
        Init(platformData) {
            this.loginState = {
                isLogin: false,
                code: null
            };
            this.recordManager.Platform = this;
            Laya.timer.once(500, this, this._FakeLoginEnd);
        }
        _FakeLoginEnd() {
            if (this.onLoginEnd)
                this.onLoginEnd.run();
        }
        IsBannerAvaliable() {
            return false;
        }
        IsVideoAvaliable() {
            return true;
        }
        IsInterstitalAvaliable() {
            return false;
        }
        ShowBannerAd() {
            console.log("调用ShowBannerAd");
        }
        HideBannerAd() {
            console.log("调用HideBannerAd");
        }
        ShowRewardVideoAd(onSuccess, onSkipped) {
            console.log("调用ShowRewardVideoAd");
            onSuccess.run();
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (resolve) {
                PlatformManagerProxy.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    resolve(true);
                }), Laya.Handler.create(this, () => {
                    resolve(false);
                }));
            });
        }
        ShowInterstitalAd() {
            console.log("调用ShowInterstitalAd");
        }
        GetFromAppId() {
            return null;
        }
        ShareAppMessage(obj, onSuccess = null, onFailed = null) {
            console.log("分享消息", obj);
            if (onSuccess) {
                onSuccess.run();
            }
        }
        LoadSubpackage(name, onSuccess, onFailed) {
            if (onSuccess) {
                onSuccess.run();
            }
        }
        RecordEvent(eventId, param) {
            console.log("记录事件", eventId, param);
        }
        ShareVideoInfo() {
            console.log(PlatformManagerProxy.platformStr, "暂未实现录屏功能");
        }
        _CheckUpdate() {
        }
        ShowToast(str) {
            console.log('显示消息：', str);
        }
        OpenGameBox() {
            console.error("当前平台", PlatformManagerProxy.platformStr, "暂不支持互推游戏盒子");
        }
        NavigateToApp(appid, path, extra) {
            return new Promise((resolve, reject) => {
                console.error("当前平台", PlatformManagerProxy.platformStr, `暂不支持小程序跳转appid:${appid}`);
                resolve(false);
            });
        }
        createShortcut() {
            console.log('创建桌面图标');
        }
        GetStorage(key) {
            console.log('读本地存储');
            return Laya.LocalStorage.getItem(key);
        }
        SetStorage(key, data) {
            console.log('写本地存储');
            Laya.LocalStorage.setItem(key, data);
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    class OppoPlatform extends WXPlatform {
        constructor() {
            super(...arguments);
            this.platform = EPlatformType.OPPO;
            this.safeArea = null;
            this.recordManager = new DefaultRecordManager();
            this.device = new DefaultDevice();
            this.isSupportJumpOther = true;
            this._isBannerLoaded = false;
            this._isVideoLoaded = false;
            this._isInterstitialLoaded = false;
            this._isInterstitialCanShow = true;
            this._nativeAdLoaded = false;
            this._cacheVideoAD = false;
        }
        Init(platformData) {
            this._base = window["qg"];
            if (this._base == null) {
                console.error(...ConsoleEx.packError("平台初始化错误", PlatformManagerProxy.platformStr));
                return;
            }
            this.platformData = platformData;
            this.recordManager.Platform = this;
            this._InitLauchOption();
            this._Login();
            this._InitSystemInfo();
            this.getSystemInfo();
            if (this.systemInfo.platformVersion >= 1051) {
            }
            else {
                this._base.initAdService({
                    appId: platformData.appId,
                    isDebug: true,
                    success: () => {
                        console.log("oppo广告", "初始化广告服务成功", platformData);
                        this._CreateVideoAd();
                    },
                    fail: () => {
                        console.error("oppo广告", "初始化广告服务失败");
                    }
                });
            }
            window["iplatform"] = this;
        }
        getSystemInfo() {
            this._base.getSystemInfo({
                success: (res) => {
                    this.systemInfo = res;
                    console.log(this.systemInfo);
                },
                fail: () => { },
                complete: () => { }
            });
        }
        reportMonitor() {
            console.log('oppo上报数据', this.systemInfo);
            if (this.systemInfo && this.systemInfo.platformVersion >= 1060) {
                this._base.reportMonitor('game_scene', 0);
            }
        }
        _CheckUpdate() {
        }
        _Login() {
            this.loginState = {
                isLogin: false,
                code: ""
            };
            let loginData = {};
            loginData.success = (res) => {
                this._OnLoginSuccess(res);
            };
            loginData.fail = (res) => {
                console.error(PlatformManagerProxy.platformStr, "登录失败", res);
                this.loginState.isLogin = false;
                this.loginState.code = "";
            };
            loginData.complete = (res) => {
                if (this.onLoginEnd != null) {
                    this.onLoginEnd.run();
                }
            };
            this._base.login(loginData);
        }
        _OnLoginSuccess(res) {
            console.log(PlatformManagerProxy.platformStr, "登录成功", res);
            this.loginState.isLogin = true;
            this.loginState.code = res.token;
        }
        ShareAppMessage(obj, onSuccess, onFailed) {
        }
        _InitLauchOption() {
            this._base.onShow(this._OnShow);
            this._base.onHide(this._OnHide);
            let res = this._base.getLaunchOptionsSync();
            this._OnShow(res);
        }
        canCreateShortcut() {
            return new Promise((resolve, reject) => {
                qg['hasShortcutInstalled']({
                    success: function (res) {
                        resolve(res);
                    },
                    fail: function (err) {
                        reject();
                    },
                    complete: function () {
                    }
                });
            });
        }
        createShortcut() {
            return new Promise((resolve, reject) => {
                qg['hasShortcutInstalled']({
                    success: function (res) {
                        if (res == false) {
                            qg['installShortcut']({
                                success: function () {
                                    resolve();
                                },
                                fail: function (err) {
                                    reject();
                                },
                                complete: function () { }
                            });
                        }
                        else {
                            resolve();
                        }
                    },
                    fail: function (err) {
                        reject();
                    },
                    complete: function () { }
                });
            });
        }
        _CreateInterstitalAd() {
        }
        _CreateVideoAd() {
            if (!this._cacheVideoAD) {
                console.log("当前策略为不缓存视频广告");
                return;
            }
            let createRewardedVideoAd = this._base["createRewardedVideoAd"];
            if (createRewardedVideoAd == null) {
                console.error("无createRewardedVideoAd方法,跳过初始化");
                return;
            }
            if (StringUtils.IsNullOrEmpty(this.platformData.rewardVideoId)) {
                console.log("无有效的视频广告ID,取消加载");
                return;
            }
            this._videoFailedCount = 0;
            let videoObj = {};
            videoObj["adUnitId"] = this.platformData.rewardVideoId;
            this._rewardVideo = createRewardedVideoAd(videoObj);
            this._rewardVideo.onLoad(() => {
                console.log("视频广告加载成功");
                this._isVideoLoaded = true;
            });
            this._rewardVideo.onError((res) => {
                this._videoFailedCount++;
                console.error("视频广告加载失败", res);
                if (this._videoFailedCount > 10) {
                    console.log("第", this._videoFailedCount, "次重新加载视频广告");
                    this._rewardVideo.load();
                }
            });
            this._rewardVideo.onClose((res) => {
                Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                console.log("视频回调", res);
                let isEnd = res["isEnded"];
                Awaiters.NextFrame().then(() => {
                    if (isEnd) {
                        if (this._rewardSuccessed)
                            this._rewardSuccessed.run();
                    }
                    else {
                        if (this._rewardSkipped)
                            this._rewardSkipped.run();
                    }
                });
            });
        }
        IsBannerAvaliable() {
            return this._isBannerLoaded;
        }
        IsVideoAvaliable() {
            return this._isVideoLoaded;
        }
        IsInterstitalAvaliable() {
            return false;
        }
        IsNativeAvaliable() {
            return this._nativeAdLoaded;
        }
        ShowBannerAd() {
            return __awaiter(this, void 0, void 0, function* () {
                if (StringUtils.IsNullOrEmpty(this.platformData.bannerId)) {
                    console.log("无有效的banner广告ID,取消加载");
                    return;
                }
                if (this._bannerAd) {
                    this._bannerAd.show();
                    console.log('展示已有banner');
                    return;
                }
                this.HideBannerAd();
                this._bannerAd = this._base.createBannerAd({
                    adUnitId: this.platformData.bannerId
                });
                let isBannerLoading = true;
                let loadSuccess = false;
                this._bannerAd.show().then((res) => {
                    console.log("banner加载成功", res);
                    if (res['code'] == 0) {
                        loadSuccess = true;
                    }
                    isBannerLoading = false;
                }).catch((res) => {
                    console.error("banner加载失败", res);
                    isBannerLoading = false;
                });
                while (isBannerLoading) {
                    yield Awaiters.NextFrame();
                }
                if (loadSuccess)
                    return;
                console.log("banner展示失败,展示native广告");
                if (this._bannerAd) {
                    this._bannerAd.destroy();
                    this._bannerAd = null;
                }
                for (let i = 0; i < this.platformData.nativeIconIds.length; ++i) {
                    let ret = yield this._ShowNativeBanner(i);
                    if (ret) {
                        break;
                    }
                    this._bannerAd.destroy();
                }
            });
        }
        _ShowNativeBanner(index) {
            return __awaiter(this, void 0, void 0, function* () {
                let nativeBanner = this.base.createNativeAd({
                    adUnitId: this.platformData.nativeBannerIds[index]
                });
                this._bannerAd = nativeBanner;
                let loadRet = yield nativeBanner.load();
                if (loadRet["code"] == 0) {
                    let adList = loadRet['adList'];
                    if (adList == null || adList.length == 0) {
                        console.error("native banner加载失败", loadRet);
                        return false;
                    }
                    let adData = adList[0];
                    if (adData == null) {
                        console.error("native banner加载失败", loadRet);
                        return false;
                    }
                    return true;
                }
                else {
                    console.error("native banner加载失败", loadRet);
                    return false;
                }
            });
        }
        HideBannerAd() {
            if (this._bannerAd) {
                this._bannerAd.destroy();
                this._bannerAd = null;
            }
        }
        ShowNativeAd() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.IsNativeAvaliable()) {
                    return;
                }
            });
        }
        HideNativeAd() {
            if (!this.IsNativeAvaliable()) {
                return;
            }
        }
        _DoCacheShowVideo(onSuccess, onSkipped) {
            if (!this._isVideoLoaded) {
                console.error("视频广告尚未加载好");
                return;
            }
            this._rewardSuccessed = onSuccess;
            this._rewardSkipped = onSkipped;
            this._isVideoLoaded = false;
            Laya.stage.event(PlatformCommonEvent.PAUSE_AUDIO);
            this._rewardVideo.show();
        }
        _DoNoCacheShowVideo(onSuccess, onSkipped) {
            this._rewardSuccessed = onSuccess;
            this._rewardSkipped = onSkipped;
            if (StringUtils.IsNullOrEmpty(this.platformData.rewardVideoId)) {
                console.log("无有效的视频广告ID,取消加载");
                this._rewardSkipped && this._rewardSkipped.run();
                return;
            }
            let createRewardedVideoAd = this._base["createRewardedVideoAd"];
            if (createRewardedVideoAd == null) {
                console.error("无createRewardedVideoAd方法,跳过初始化");
                this._rewardSkipped && this._rewardSkipped.run();
                return;
            }
            if (this._rewardVideo) {
                this._rewardVideo.destroy();
            }
            let videoObj = {};
            videoObj["adUnitId"] = this.platformData.rewardVideoId;
            this._rewardVideo = createRewardedVideoAd(videoObj);
            console.log("广告创建完成", videoObj);
            this._rewardVideo.onClose((res) => {
                Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                console.log("视频回调", res);
                let isEnd = res["isEnded"];
                Awaiters.NextFrame().then(() => {
                    if (isEnd) {
                        if (this._rewardSuccessed)
                            this._rewardSuccessed.run();
                    }
                    else {
                        if (this._rewardSkipped)
                            this._rewardSkipped.run();
                    }
                });
            });
            this._rewardVideo.onError((err) => {
                console.log("广告组件出现问题", err);
                if (this._rewardSkipped)
                    this._rewardSkipped.run();
            });
            this._rewardVideo.onLoad((res) => {
                console.log("广告加载成功", res);
            });
            this._rewardVideo.load().then(() => {
                this._rewardVideo.show();
            });
        }
        ShowRewardVideoAd(onSuccess, onSkipped) {
            if (this._cacheVideoAD) {
                this._DoCacheShowVideo(onSuccess, onSkipped);
            }
            else {
                this._DoNoCacheShowVideo(onSuccess, onSkipped);
            }
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (resolve) {
                PlatformManagerProxy.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    resolve(true);
                }), Laya.Handler.create(this, () => {
                    resolve(false);
                }));
            });
        }
        _DisableInterstitalAd() {
            return __awaiter(this, void 0, void 0, function* () {
                this._isInterstitialCanShow = false;
                yield Awaiters.Seconds(60);
                this._isInterstitialCanShow = true;
            });
        }
        GetFromAppId() {
            if (this.lauchOption.referrerInfo == null) {
                return null;
            }
            if (StringUtils.IsNullOrEmpty(this.lauchOption.referrerInfo.appId)) {
                return null;
            }
            return this.lauchOption.referrerInfo.appId;
        }
        CreatShortcut() {
            return new Promise((resolve, reject) => {
                qg['hasShortcutInstalled']({
                    success: function (res) {
                        if (res == false) {
                            qg['installShortcut']({
                                success: function () {
                                    resolve();
                                },
                                fail: function (err) {
                                    reject();
                                },
                                complete: function () { }
                            });
                        }
                        else {
                            resolve();
                        }
                    },
                    fail: function (err) {
                        reject();
                    },
                    complete: function () { }
                });
            });
        }
        LoadSubpackage(name, onSuccess, onFailed, onProgress) {
            let loadObj = {};
            loadObj["name"] = name;
            loadObj["success"] = () => {
                console.log("分包加载成功", name);
                if (onSuccess) {
                    onSuccess.run();
                }
            };
            loadObj["fail"] = () => {
                console.error("分包加载失败", name);
                if (onFailed) {
                    onFailed.run();
                }
            };
            let loadTask = this._base.loadSubpackage(loadObj);
            loadTask.onProgressUpdate((res) => {
                console.log("分包加载进度", res);
                if (onProgress) {
                    onProgress.runWith(res.progress / 100);
                }
            });
        }
        RecordEvent(eventId, param) {
            console.log("[记录事件]", eventId, param);
        }
        CreateShareVideoBtn(x, y, width, height) {
        }
        HideShareVideoBtn() {
            if (this._shareVideoBtn != null) {
                this._shareVideoBtn.hide();
            }
        }
        ShowToast(str) {
            this._base.showToast({
                title: str,
                duration: 2000
            });
        }
        OpenGameBox(appIds) {
            console.error("当前平台", PlatformManagerProxy.platformStr, "暂不支持互推游戏盒子");
        }
        NavigateToApp(appId, path, extra) {
            return new Promise((resolve, reject) => {
                Laya.Browser.window.qg.navigateToMiniGame({
                    pkgName: appId,
                    path: path,
                    extraData: extra,
                    success: function () {
                        resolve(true);
                        console.log('oppo小游戏跳转成功');
                    },
                    fail: function (res) {
                        reject(false);
                        console.log('oppo小游戏跳转失败：', JSON.stringify(res));
                    }
                });
            });
        }
    }

    class QQPlatform extends WXPlatform {
        constructor() {
            super(...arguments);
            this.platform = EPlatformType.QQ;
            this.isBannerShowing = false;
        }
        Init(platformData) {
            this._base = window["qq"];
            if (this._base == null) {
                console.error(...ConsoleEx.packError("平台初始化错误", PlatformManagerProxy.platformStr));
                return;
            }
            this.platformData = platformData;
            this.recordManager.Platform = this;
            this._InitLauchOption();
            this._Login();
            this._InitShareInfo();
            this._InitSystemInfo();
            this._CreateBannerAd();
            this._CreateVideoAd();
            this._CreateInterstitalAd();
            window["iplatform"] = this;
            console.error("平台初始化完成", PlatformManagerProxy.platformStr);
        }
        _InitSystemInfo() {
            try {
                let systemInfo = this._base.getSystemInfoSync();
                this._cacheScreenScale = systemInfo.screenWidth / Laya.stage.width;
                this.safeArea = {};
                this.safeArea.width = systemInfo.windowWidth;
                this.safeArea.height = systemInfo.windowHeight;
                this.safeArea.top = systemInfo.statusBarHeight;
                this.safeArea.bottom = 0;
                console.log("QQ覆写_InitSystemInfo", this.safeArea);
            }
            catch (e) {
                console.error(e);
                console.error("获取设备信息失败,执行默认初始化");
                this.safeArea = null;
            }
        }
        _CreateBannerAd(show) {
            if (StringUtils.IsNullOrEmpty(this.platformData.bannerId)) {
                console.log("无有效的banner广告ID,取消加载");
                return;
            }
            let windowWidth = this._base.getSystemInfoSync().windowWidth;
            let windowHeight = this._base.getSystemInfoSync().windowHeight;
            let bannerObj = {};
            bannerObj["adUnitId"] = this.platformData.bannerId;
            let styleObj = {};
            styleObj["top"] = windowHeight - 80;
            styleObj["width"] = 300;
            styleObj["left"] = (windowWidth - styleObj["width"]) / 2;
            bannerObj["style"] = styleObj;
            this._bannerAd = this._base.createBannerAd(bannerObj);
            this._isBannerLoaded = false;
            this._bannerAd.onLoad(() => {
                console.log("qq banner加载成功", this._bannerAd);
                this._isBannerLoaded = true;
                if (show) {
                    this._bannerAd.show();
                }
            });
            this._bannerAd.onError((res) => {
                console.error("banner广告加载失败", res);
            });
            this._bannerAd.onResize((size) => {
                console.log("onResize", size);
                this._bannerAd.style.top = windowHeight - 80;
                this._bannerAd.style.left = (windowWidth - 300) / 2;
                console.log("onResize", this._bannerAd);
            });
        }
        IsBannerAvaliable() {
            return this._isBannerLoaded;
        }
        IsVideoAvaliable() {
            return this._isVideoLoaded;
        }
        IsInterstitalAvaliable() {
            return this._isInterstitialLoaded;
        }
        ShowBannerAd() {
            if (!this.IsBannerAvaliable()) {
                return;
            }
            this._bannerAd.show();
            this.isBannerShowing = true;
            Laya.timer.loop(15 * 1000, this, this.refreshBanner);
        }
        refreshBanner() {
            if (this.isBannerShowing) {
                console.log('refresh banner');
                this._bannerAd.hide();
                this._CreateBannerAd(true);
            }
        }
        HideBannerAd() {
            if (!this.IsBannerAvaliable())
                return;
            if (this._bannerAd) {
                this._bannerAd.hide();
                Laya.timer.clear(this, this.refreshBanner);
                this.isBannerShowing = false;
            }
            this._CreateBannerAd();
        }
        _DoCacheShowVideo(onSuccess, onSkipped) {
            if (!this._isVideoLoaded) {
                console.error("视频广告尚未加载好");
                return;
            }
            this._rewardSuccessed = onSuccess;
            this._rewardSkipped = onSkipped;
            this._isVideoLoaded = false;
            Laya.stage.event(PlatformCommonEvent.PAUSE_AUDIO);
            this._rewardVideo.show();
        }
        _DoNoCacheShowVideo(onSuccess, onSkipped) {
            this._rewardSuccessed = onSuccess;
            this._rewardSkipped = onSkipped;
            if (!this._isVideoLoaded || !this._rewardVideo) {
                if (StringUtils.IsNullOrEmpty(this.platformData.rewardVideoId)) {
                    console.log("无有效的视频广告ID,取消加载");
                    onSkipped.run();
                    return;
                }
                let createRewardedVideoAd = this._base["createRewardedVideoAd"];
                if (createRewardedVideoAd == null) {
                    console.error("无createRewardedVideoAd方法,跳过初始化");
                    onSkipped.run();
                    return;
                }
                this._videoFailedCount = 0;
                let videoObj = {};
                videoObj["adUnitId"] = this.platformData.rewardVideoId;
                this._rewardVideo = createRewardedVideoAd(videoObj);
                this._rewardVideo.onLoad(() => {
                    console.log("视频广告加载成功");
                    this._isVideoLoaded = true;
                });
                this._rewardVideo.onError((res) => {
                    this._videoFailedCount++;
                    console.error("视频广告加载失败", res, this._videoFailedCount);
                });
                this._rewardVideo.onClose((res) => {
                    Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                    console.log(" NoCache - 视频回调", res);
                    let isEnd = res["isEnded"];
                    console.log("noCache---", isEnd, "----", !!this._rewardSuccessed, "-----", !!this._rewardSkipped);
                    if (isEnd) {
                        if (this._rewardSuccessed)
                            this._rewardSuccessed.run();
                    }
                    else {
                        if (this._rewardSkipped)
                            this._rewardSkipped.run();
                    }
                });
            }
            this._rewardVideo.show().then(() => {
            }).catch(err => {
                console.log("广告组件出现问题", err);
                this._rewardVideo.load().then(() => {
                    console.log("手动加载成功");
                    return this._rewardVideo.show().then(() => {
                    });
                });
            });
            ;
        }
        ShowRewardVideoAd(onSuccess, onSkipped) {
            if (this._cacheVideoAD) {
                this._DoCacheShowVideo(onSuccess, onSkipped);
            }
            else {
                this._DoNoCacheShowVideo(onSuccess, onSkipped);
            }
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (resolve) {
                PlatformManagerProxy.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    resolve(true);
                }, null, true), Laya.Handler.create(this, () => {
                    resolve(false);
                }, null, true));
            });
        }
        ShowInterstitalAd() {
            if (!this._isInterstitialLoaded) {
                console.error("插页广告尚未加载好");
                return;
            }
            this._intersitialAd.show();
        }
        OpenGameBox(appIds = []) {
            this.showAppBox();
        }
        showAppBox() {
            if (this.appBox) {
                this.appBox.show();
            }
        }
        createAppBox(show) {
            if (!this.appBox) {
                this.appBox = this._base.createAppBox({
                    adUnitId: ''
                });
            }
            this.appBox.load().then(() => {
                if (show) {
                    this.appBox.show();
                }
            });
            this.appBox.onClose(() => {
                console.log('关闭盒子');
            });
        }
        hideAppBox() {
            if (this.appBox) {
                this.appBox.destroy();
            }
        }
        showBlockAd(count = 1) {
            let obj = {
                adUnitId: "",
                style: { left: 55, top: Laya.stage.height / 2 },
                size: count,
                orientation: 'vertical'
            };
            this.blockAd = this._base.createBlockAd(obj);
            this.blockAd.onLoad(() => {
                console.log('积木广告加载完成');
                this.blockAd.show().then(() => { console.log('积木展示成功'); }).catch(e => {
                    console.error('积木展示失败', e);
                });
            });
            this.blockAd.onError((err) => {
                console.error('积木广告加载错误', err);
            });
            this.blockAd.onResize((res) => {
                console.log('积木resize', res);
            });
        }
        hideBlockAd() {
            if (this.blockAd) {
                this.blockAd.hide();
                this.blockAd.destroy();
            }
        }
    }

    class QTTPlatform extends WXPlatform {
        constructor() {
            super(...arguments);
            this.platform = EPlatformType.QTT;
        }
        Init(platformData) {
            this._base = window["qttGame"];
            if (this._base == null) {
                console.error(...ConsoleEx.packError("平台初始化错误"));
                return;
            }
            this.platformData = platformData;
            this.recordManager.Platform = this;
            window["iplatform"] = this;
        }
        IsBannerAvaliable() {
            return true;
        }
        ShowBannerAd() {
            this._base.showBanner({ index: 1 });
        }
        HideBannerAd() {
            this._base.hideBanner();
        }
        IsVideoAvaliable() {
            return true;
        }
        ShowRewardVideoAd(onSuccess, onSkipped) {
            let options = {};
            options.index = 1;
            options.gametype = 1;
            options.rewardtype = 1;
            options.data = {};
            options.data.title = "获得奖励";
            Laya.stage.event(PlatformCommonEvent.PAUSE_AUDIO);
            this._base.showVideo((res) => {
                Laya.stage.event(PlatformCommonEvent.RESUM_AUDIO);
                if (res == 1) {
                    if (onSuccess) {
                        onSuccess.run();
                    }
                }
                else {
                    if (onSkipped) {
                        onSkipped.run();
                    }
                }
            }, options);
        }
        ShowInterstitalAd() {
            this.ShowHDReward();
        }
        ShowHDReward() {
            let options = {};
            options.index = 1;
            options.rewardtype = 1;
            this._base.showHDReward(options);
        }
        RecordEvent(eventId, param) {
            console.log("记录事件", eventId, param);
        }
    }

    class TTDevice extends DefaultDevice {
        constructor(base) {
            super();
            this._base = base;
        }
        Vibrate(isLong) {
            console.log("调用震动", isLong);
            if (isLong) {
                this._base.vibrateLong({
                    success(res) { },
                    fail(res) {
                        console.error("调用震动失败", res);
                    },
                    complete(res) { }
                });
            }
            else {
                this._base.vibrateShort({
                    success(res) { },
                    fail(res) {
                        console.error("调用震动失败", res);
                    },
                    complete(res) { }
                });
            }
        }
    }

    class TTRecordManager extends DefaultRecordManager {
        constructor(base) {
            super();
            this.supportRecord = true;
            this._base = base;
            this.isRecording = false;
            this.isRecordSuccess = false;
            this.isPausing = false;
            this._nativeManager = this._base.getGameRecorderManager();
            this._nativeManager.onStart((res) => {
                console.log("平台开始录制", res);
                this.isRecording = true;
                this.isRecordSuccess = false;
                this._cacheStartHandle && this._cacheStartHandle.run();
            });
            this._nativeManager.onStop((res) => {
                console.log("平台停止录制", res);
                this.videoSavePath = res.videoPath;
                this.isRecording = false;
                this.isRecordSuccess = true;
                if (this._cacheStopHandle) {
                    this._cacheStopHandle.run();
                }
                else if (this._cacheOverTimeHandle) {
                    this._cacheOverTimeHandle.run();
                }
            });
            this._nativeManager.onError((err) => {
                console.log("录制发生错误", err);
                this.isRecordSuccess = false;
                this.isRecording = false;
            });
            this._nativeManager.onPause((res) => {
                console.log("暂停录制视频", res);
                this.isPausing = true;
                this._cachePauseHandle && this._cachePauseHandle.run();
            });
            this._nativeManager.onResume((res) => {
                console.log("暂停录制视频", res);
                this.isPausing = false;
                this._cacheResumeHandle && this._cacheResumeHandle.run();
            });
        }
        StartRecord(onStart, onOverTime) {
            console.log("调用开始录屏");
            this._cacheStartHandle = onStart;
            this._cacheOverTimeHandle = onOverTime;
            this._cacheStopHandle = null;
            this._nativeManager.start({ duration: 300 });
        }
        Pause(onPause) {
            if (!this.isRecording) {
                console.error("当前未开始录制,无法暂停录制");
                return;
            }
            if (this.isPausing) {
                console.log("当前录制状态已暂停");
                return;
            }
            console.log("调用暂停录制");
            this._cachePauseHandle = onPause;
            this._nativeManager.pause();
        }
        Resume(onReume) {
            if (!this.isRecording) {
                console.error("当前未开始录制,无法恢复录制");
                return;
            }
            if (!this.isPausing) {
                console.log("当前录制状态正在进行中");
                return;
            }
            console.log("调用恢复录制");
            this._cacheResumeHandle = onReume;
            this._nativeManager.resume();
        }
        RecordClip(timeRange) {
            if (!this.isRecording) {
                console.error("当前未开始录制,无法记录精彩时刻");
                return;
            }
            if (this.isPausing) {
                console.log("当前录制状态已暂停,无法记录精彩时刻");
                return;
            }
            if (timeRange == null) {
                this._nativeManager.recordClip({});
            }
            else {
                this._nativeManager.recordClip({ timeRange: timeRange });
            }
        }
        StopRecord(onStop) {
            console.log("调用结束录屏");
            this._cacheStopHandle = onStop;
            this._nativeManager.stop();
        }
        ShareVideo(onSuccess, onCancel, onFailed) {
            if (this.isRecordSuccess) {
                let shareData = {
                    channel: "video",
                    title: "",
                    desc: "",
                    imageUrl: "",
                    templateId: this.Platform.platformData.shareId,
                    query: "",
                    extra: {
                        videoPath: this.videoSavePath,
                        videoTopics: ['抖音小游戏', '猫眼金币跑酷']
                    },
                    success() {
                        if (onSuccess) {
                            onSuccess.run();
                        }
                    },
                    fail(e) {
                        if (onCancel) {
                            onCancel.run();
                        }
                    }
                };
                this._base.shareAppMessage(shareData);
            }
            else {
                console.log("无视频可以分享");
                if (onFailed) {
                    onFailed.run();
                }
            }
        }
    }

    class TTPlatform extends WXPlatform {
        constructor() {
            super(...arguments);
            this.platform = EPlatformType.TT;
            this._showVideoLoad = false;
        }
        Init(platformData) {
            this._base = window["tt"];
            if (this._base == null) {
                console.error(...ConsoleEx.packError("平台初始化错误"));
                return;
            }
            this.platformData = platformData;
            let tt = this._base;
            let systemInfo = tt.getSystemInfoSync();
            if (systemInfo.platform == "ios") {
                this.isSupportJumpOther = false;
            }
            let [major, minor] = systemInfo.SDKVersion.split(".");
            if (major >= 1 && minor >= 33) {
            }
            else {
                this.isSupportJumpOther = false;
            }
            this._InitLauchOption();
            this._InitShareInfo();
            this._InitSystemInfo();
            this._CreateBannerAd();
            this._CreateVideoAd();
            this._CreateInterstitalAd();
            this.recordManager = new TTRecordManager(this._base);
            this.recordManager.Platform = this;
            this.device = new TTDevice(this._base);
            window["iplatform"] = this;
        }
        _CreateBannerAd() {
            if (StringUtils.IsNullOrEmpty(this.platformData.bannerId)) {
                console.log("无有效的banner广告ID,取消加载");
                return;
            }
            let windowWidth = this._base.getSystemInfoSync().windowWidth;
            let windowHeight = this._base.getSystemInfoSync().windowHeight;
            let bannerObj = {};
            bannerObj["adUnitId"] = this.platformData.bannerId;
            bannerObj["adIntervals"] = 30;
            let styleObj = {};
            styleObj["left"] = 0;
            styleObj["top"] = 0;
            styleObj["width"] = windowWidth;
            bannerObj["style"] = styleObj;
            this._bannerAd = this._base.createBannerAd(bannerObj);
            this._isBannerLoaded = false;
            if (this._bannerAd) {
                this._bannerAd.onLoad(() => {
                    console.log("banner加载成功", this._bannerAd);
                    this._isBannerLoaded = true;
                });
                this._bannerAd.onError((res) => {
                    console.error("banner广告加载失败", res);
                    this._bannerAd == null;
                });
                this._bannerAd.onResize((size) => {
                    this._bannerAd.style.top = windowHeight - size.height;
                    this._bannerAd.style.left = (windowWidth - size.width) / 2;
                });
            }
        }
        RecordEvent(eventId, param) {
            let reportAnalytics = this._base["reportAnalytics"];
            if (reportAnalytics) {
                if (param == null) {
                    param = {};
                }
                reportAnalytics(eventId, param);
            }
            else {
                console.error("reportAnalytics 方法不存在");
            }
        }
        ShowBannerAd() {
            if (!this.IsBannerAvaliable()) {
                return;
            }
            this._bannerAd.show();
        }
        ShareAppMessage(shareInfo, onSuccess, onFailed) {
            console.log("分享消息", shareInfo);
            let shareObj = WXPlatform._WrapShareInfo(shareInfo);
            shareObj["success"] = () => {
                if (onSuccess) {
                    onSuccess.run();
                }
            };
            shareObj["fail"] = () => {
                if (onFailed) {
                    onFailed.run();
                }
            };
            this._base.shareAppMessage(shareObj);
        }
        OpenGameBox(appIds) {
            let openData = [];
            for (let i = 0; i < appIds.length; ++i) {
                openData.push({
                    appId: appIds[i]
                });
            }
            this._base.showMoreGamesModal({
                appLaunchOptions: openData
            });
        }
        NavigateToApp(appid, path, extra) {
            return new Promise((resolve, reject) => {
                if (!this.isSupportJumpOther) {
                    reject(false);
                    console.log("当前平台不支持小游戏跳转", this);
                }
                else {
                    this._base.showMoreGamesModal({
                        appLaunchOptions: [
                            {
                                appId: this.platformData.appId,
                                query: "foo=bar&baz=qux",
                                extraData: {}
                            }
                        ],
                        success(res) {
                            resolve(true);
                            console.log("跳转小游戏成功", appid);
                        },
                        fail(err) {
                            reject(false);
                            console.log("跳转小游戏失败", appid);
                        }
                    });
                }
            });
        }
    }

    class PlatformManager {
        static get instance() {
            if (this._instance == null) {
                this._instance = new PlatformManager();
            }
            return this._instance;
        }
        static get PlatformInstance() {
            if (!this.instance.m_platformInstance) {
                console.log(...ConsoleEx.packError('还没有设置过平台实例代理！'));
            }
            return this.instance.m_platformInstance;
        }
        init() {
            if (this.m_platformInstance != null) {
                console.error(...ConsoleEx.packError("已调用过平台创建为", PlatformManagerProxy.GetPlatformStr(this.m_platformInstance.platform), "不能重复创建"));
                return this.m_platformInstance;
            }
            let isQTT = window["qttGame"] != null;
            let isTT = window["tt"] != null;
            let result;
            if (isTT) {
                result = new TTPlatform();
                this.m_platformData = new TTData();
            }
            else if (Laya.Browser.onMiniGame) {
                result = new WXPlatform();
                this.m_platformData = new WXData();
            }
            else if (Laya.Browser.onBDMiniGame) {
                result = new BDPlatform();
                this.m_platformData = new BDData();
            }
            else if (isQTT) {
                result = new QTTPlatform();
                this.m_platformData = new QTTData();
            }
            else if (Laya.Browser.onQQMiniGame) {
                result = new QQPlatform();
                this.m_platformData = new QQData();
            }
            else if (Laya.Browser.onQGMiniGame) {
                result = new OppoPlatform();
                this.m_platformData = new OPPOData();
            }
            else {
                console.log(...ConsoleEx.packWarn("未识别平台,默认创建为web"));
                result = new DefaultPlatform();
            }
            this.m_platformInstance = result;
            PlatformManagerProxy.instance.PlatformInstance = result;
            window['$Platform'] = this.m_platformInstance;
            console.log(...ConsoleEx.packPlatform("平台实例创建完成", PlatformManagerProxy.GetPlatformStr(this.m_platformInstance.platform)));
        }
        initPlatform() {
            this.m_platformInstance.Init(this.m_platformData);
            console.log(...ConsoleEx.packPlatform('平台初始化完成'));
        }
    }

    class FGUI_PGameTestPlatform extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("GameMain", "PGameTestPlatform"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_lookVAd = (this.getChildAt(1));
            this.m_lookVAdText = (this.getChildAt(2));
            this.m__lookVAd = (this.getChildAt(3));
            this.m_share = (this.getChildAt(4));
            this.m_shareText = (this.getChildAt(5));
            this.m__share = (this.getChildAt(6));
            this.m_showToast = (this.getChildAt(7));
            this.m_showToastText = (this.getChildAt(8));
            this.m__showToast = (this.getChildAt(9));
        }
    }
    FGUI_PGameTestPlatform.URL = "ui://kk7g5mmmt1pw9y";

    class PGameTestPlatformMediator extends BaseUIMediator {
        constructor() { super(); }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new PGameTestPlatformMediator();
                this.m_instance._classDefine = FGUI_PGameTestPlatform;
            }
            return this.m_instance;
        }
        _OnShow() {
            this.ui.m_bg.onClick(this, this.close);
            this.ui.m_lookVAd.onClick(this, this.lookVAd);
            this.ui.m_showToast.onClick(this, this.showToast);
            this.ui.m_share.onClick(this, this.share);
        }
        lookVAd() {
            console.log('看广告测试');
            PlatformManager.PlatformInstance.ShowRewardVideoAdAsync().then((ifLook) => {
                console.log('看广告完成测试', ifLook);
            });
        }
        showToast() {
            console.log('显示消息测试');
            PlatformManager.PlatformInstance.ShowToast('显示消息测试');
        }
        share() {
            console.log('分享测试');
            PlatformManager.PlatformInstance.ShareAppMessage({
                shareId: undefined,
                shareImg: undefined,
                sharePath: undefined,
                shareTitle: '分享消息',
            }, Laya.Handler.create(this, () => {
                console.log('分享成功');
            }), Laya.Handler.create(this, () => {
                console.log('分享失败！');
            }));
        }
        close() {
            UIManagerProxy.instance.setUIState([
                { typeIndex: EUI.TestPlatform, state: false },
            ], false);
        }
        _OnHide() { }
    }

    class BaseUIManager {
        constructor() {
            this.initUIMediator();
            this._initUIMediator();
        }
        initUIMediator() { }
        _initUIMediator() {
            if (!this.m_UIMediator) {
                console.log(...ConsoleEx.packWarn('注意！没有注册UI代理类。'));
            }
            this.m_UIProxy.setProxyMediatroList(this.m_UIMediator);
            let _serialNumber;
            let _serialNumberLenth;
            for (let _i in this.m_UIMediator) {
                this.m_UIMediator[_i].keyId = _i;
                _serialNumber = [];
                this.getUIBelongSerialNumber(this.m_UIMediator[_i], _serialNumber);
                _serialNumberLenth = _serialNumber.length;
                _serialNumber = ArrayUtils.Unique(_serialNumber);
                if (_serialNumberLenth != _serialNumber.length) {
                    console.log(...ConsoleEx.packError('UI调度者', _i, '的附属UI有重复出现！'));
                }
            }
        }
        getUIBelongSerialNumber(_UIMed, _numbers, _ifR = false) {
            if (_UIMed.belongDownUIMediator.length > 0) {
                _UIMed.belongDownUIMediator.forEach((item) => {
                    this.getUIBelongSerialNumber(item, _numbers, true);
                });
            }
            if (!_ifR) {
                if (_UIMed.ifBelongUIMediator) {
                    console.log(...ConsoleEx.packWarn('注意！有一个附属UI调度者被添加进了UI管理器列表中，它将不会被显示。'));
                }
            }
            else {
                if (!_UIMed.ifBelongUIMediator) {
                    console.log(...ConsoleEx.packWarn('注意！有一个不是附属的UI调度者被添加进了附属列表中'));
                }
            }
            _numbers.push(_UIMed.serialNumber);
            if (_UIMed.belongUpUIMediator.length > 0) {
                _UIMed.belongUpUIMediator.forEach((item) => {
                    this.getUIBelongSerialNumber(item, _numbers, true);
                });
            }
        }
    }

    class UIManager extends BaseUIManager {
        constructor() {
            super();
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new UIManager();
            }
            return this.m_instance;
        }
        initUIMediator() {
            this.m_UIMediator = {
                [EUI.GameLoading]: PGameLoadingMediator.instance,
                [EUI.CustomsLoading]: PGameCustomsLoadingMediator.instance,
                [EUI.TestMain]: PGameTestMainMediator.instance,
                [EUI.TestPlatform]: PGameTestPlatformMediator.instance,
                [EUI.Main]: PGameMainMediator.instance,
                [EUI.Set]: PGameSetMediator.instance,
                [EUI.Play]: PGamePlayMediator.instance,
                [EUI.Start]: PGameStartMediator.instance,
                [EUI.Pause]: PGamePauseMediator.instance,
                [EUI.Com]: PGameComMediator.instance,
                [EUI.End]: PGameEndMediator.instance,
            };
            this.m_UIProxy = UIManagerProxy.instance;
        }
        init() {
        }
        Start() {
            this.m_UIProxy.Start();
        }
    }

    class GlobalStateManager {
        constructor() {
            this.m_GameIfInit = false;
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new GlobalStateManager();
            }
            return this.m_instance;
        }
        init() { }
        get gameIfInit() {
            return this.m_GameIfInit;
        }
        GameInit() {
            this.m_GameIfInit = false;
            MesManager.instance.sendEvent(EEventGlobal.GameInit);
        }
        GameOnInit() {
            this.m_GameIfInit = true;
            MesManager.instance.sendEvent(EEventGlobal.GameOnInit);
        }
    }

    class RootShortProxy extends RootDataManger {
    }

    class GameOnCustomData extends RootGameData {
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }

    class GameShortData extends RootGameData {
        constructor() {
            super(...arguments);
            this.onCustomsData = new GameOnCustomData();
        }
    }

    class GameShortDataProxy extends RootShortProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GameShortDataProxy();
            }
            return this._instance;
        }
        InitData() {
            this._shortData = new GameShortData();
        }
        get shortData() {
            return this._shortData;
        }
        static emptyGameOnCustomData() {
            this._instance._shortData = new GameShortData();
        }
    }

    class GameManager {
        constructor() { }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new GameManager();
            }
            return this.m_instance;
        }
        init() {
            MesManager.instance.onEvent(EEventScene.GameLevelsBuildBefore, this, this.gameLevelsBuildBefore);
            MesManager.instance.onEvent(EEventScene.GameLevelsOnBuild, this, this.gameLevelsOnBuild);
            MesManager.instance.onEvent(EEventScene.GameLevelsDelete, this, this.gameLevelsDelete);
            MesManager.instance.onEvent(EEventScene.GameStart, this, this.gameStart);
        }
        gameLevelsBuildBefore() {
            GameShortDataProxy.emptyGameOnCustomData();
        }
        gameLevelsOnBuild() {
        }
        gameLevelsDelete() {
        }
        gameStart() {
        }
    }

    var TestConst;
    (function (TestConst) {
        class config {
        }
        TestConst.config = config;
        TestConst.path = "res/config/TestConst.json";
    })(TestConst || (TestConst = {}));

    class TestConstProxy extends BaseConstDataProxy {
        constructor() { super(); }
        static get instance() {
            if (this._instance == null) {
                this._instance = new TestConstProxy();
            }
            return this._instance;
        }
        get data() {
            return undefined;
        }
        initData() {
            this.m_data = TestConst.data;
        }
        get ifDebug() {
            if (!MainGameConfig.ifGameTest)
                return false;
            return this.m_data.if_debug;
        }
        get ifShowOimoMesh() {
            if (!MainGameConfig.ifGameTest)
                return false;
            return this.m_data.if_show_oimo_mesh;
        }
        get oimoMeshDiaphaneity() {
            return this.m_data.oimo_mesh_diaphaneity;
        }
    }

    class ResUrl {
        static music_url(name) {
            return KeyResManager.instance.getResURL(EKeyResName.music) + name + '.mp3';
        }
        static sound_url(name) {
            return KeyResManager.instance.getResURL(EKeyResName.sound) + name + '.mp3';
        }
        static icon_url(name) {
            return KeyResManager.instance.getResURL(EKeyResName.icon) + name + '.png';
        }
        static img_url(name, _suffix = 'png') {
            return KeyResManager.instance.getResURL(EKeyResName.img) + name + '.' + _suffix;
        }
        static skin_url(name, _suffix = 'png') {
            return KeyResManager.instance.getResURL(EKeyResName.skin) + name + '.' + _suffix;
        }
    }

    class AudioUtils {
        constructor() {
            this._bgPast = [];
            this._urlBGM = '';
            this._urlSOUND = '';
            this._sounds = [];
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new AudioUtils();
            }
            return this._instance;
        }
        init() { }
        playBGM(name, loops, complete, startTime) {
            if (name != null && this._bgPast.slice(-1)[0] != name) {
                this._bgPast.push(name);
                this._urlBGM = ResUrl.music_url(name);
                this._playMusic(loops, complete, startTime);
                console.log(...ConsoleEx.packLog("播放背景音乐", name));
            }
            else {
                if (this._urlBGM != "") {
                    this._playMusic(loops, complete, startTime);
                    console.log(...ConsoleEx.packLog("播放背景音乐", name));
                }
                else {
                }
            }
        }
        shiftBGM(name, loops, complete, startTime) {
            if (this._bgPast.slice(-1)[0] == name) {
                this._bgPast.pop();
                let pastBg = this._bgPast.slice(-1)[0];
                if (pastBg) {
                    this._urlBGM = ResUrl.music_url(name);
                    this._playMusic(loops, complete, startTime);
                }
            }
        }
        pauseBGM() {
            Laya.SoundManager.stopMusic();
            console.log(...ConsoleEx.packLog("停止播放音乐", this._urlBGM));
        }
        pauseSound() {
            Laya.SoundManager.stopAllSound();
        }
        playSound(type, loops, complete, soundClass, startTime) {
            this._urlSOUND = ResUrl.sound_url(type);
            for (let i = 0; i < this._sounds.length; i++) {
                if (this._sounds[i]) {
                    if (this._sounds[i].url.indexOf(this._urlSOUND) >= 0) {
                        this._sounds[i].stop();
                        this._sounds.splice(i, 1);
                        break;
                    }
                }
            }
            let temp = Laya.SoundManager.playSound(this._urlSOUND, loops, complete, soundClass, startTime);
            this._sounds.push(temp);
        }
        stopSound(type) {
            this._urlSOUND = ResUrl.sound_url(type);
            Laya.SoundManager.stopSound(this._urlSOUND);
        }
        _playMusic(loops = 0, complete, startTime) {
            Laya.SoundManager.stopMusic();
            Laya.SoundManager.playMusic(this._urlBGM, loops, complete, startTime);
        }
    }

    class AudioProxy {
        constructor() {
            this.m_stop = false;
            this.m_onLoopSoundList = new Set();
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new AudioProxy();
            }
            return this.m_instance;
        }
        stopBGM() {
            AudioUtils.instance.pauseBGM();
        }
        BGMGoOn() {
            this.playBGM(this.m_onBGM);
        }
        soundSuspend() {
            this.m_stop = true;
            for (let _o of this.m_onLoopSoundList) {
                AudioUtils.instance.stopSound(_o);
            }
        }
        soundGoOn() {
            this.m_stop = false;
            for (let _o of this.m_onLoopSoundList) {
                AudioUtils.instance.playSound(_o, 0);
            }
        }
        playBGM(_name, loops, complete, startTime) {
            if (!GameDataProxy.instance.saveData.ifOpenBgm || this.m_stop)
                return;
            AudioUtils.instance.playBGM(_name, loops, complete, startTime);
            this.m_onBGM = _name;
        }
        playSound(_eSoundName, loops, complete, soundClass, startTime) {
            if (!GameDataProxy.instance.saveData.ifOpenSound || this.m_stop)
                return;
            if (loops == 0) {
                this.m_onLoopSoundList.add(_eSoundName);
            }
            AudioUtils.instance.playSound(_eSoundName, loops, complete, soundClass, startTime);
        }
        stopSound(_eSoundName) {
            AudioUtils.instance.stopSound(_eSoundName);
            if (this.m_onLoopSoundList.has(_eSoundName)) {
                this.m_onLoopSoundList.delete(_eSoundName);
            }
        }
    }

    class AudioManager {
        constructor() { }
        static get instance() {
            if (this._instance == null) {
                this._instance = new AudioManager();
            }
            return this._instance;
        }
        init() {
            MesManager.instance.onEvent(EEventAudio.BGMSuspend, this, this.BGMsuSpend);
            MesManager.instance.onEvent(EEventAudio.BGMGoOn, this, this.BGMGoOn);
            MesManager.instance.onEvent(EEventAudio.SoundSuspend, this, this.soundSuspend);
            MesManager.instance.onEvent(EEventAudio.SoundGoOn, this, this.soundGoOn);
            MesManager.instance.onEvent(EEventAudio.BGMVolumeChange, this, this.bgmVolumeChange);
            MesManager.instance.onEvent(EEventAudio.SoundVolumeChange, this, this.soundVolumeChange);
        }
        BGMsuSpend() {
            AudioProxy.instance.stopBGM();
        }
        BGMGoOn() {
            AudioProxy.instance.BGMGoOn();
        }
        soundSuspend() {
            AudioProxy.instance.soundSuspend();
        }
        soundGoOn() {
            AudioProxy.instance.soundGoOn();
        }
        bgmVolumeChange(_n = 1) {
            Laya.SoundManager.setMusicVolume(_n);
        }
        soundVolumeChange(_n = 1) {
            Laya.SoundManager.setSoundVolume(_n);
        }
    }

    class Game3D {
        constructor() { }
        static get instance() {
            if (this._instance == null) {
                this._instance = new Game3D();
            }
            return this._instance;
        }
        enterGame() {
            this.initGame();
            this._startGame();
            this.startGame();
        }
        initGame() {
            GlobalStateManager.instance.init();
            MesManager.instance.init();
            AudioManager.instance.init();
            GameManager.instance.init();
            EnvironmentManager.instance.init();
            UIManager.instance.init();
            CustomsManager.instance.init();
        }
        _startGame() {
            if (TestConstProxy.instance.ifDebug) {
                Laya.Stat.show();
            }
            else {
                Laya.Stat.hide();
            }
        }
        startGame() {
            UIManager.instance.Start();
            CustomsManager.instance.initLevelBuild();
        }
    }

    class ConfigManager {
        static get needLoadCount() {
            return this._configList.length;
        }
        static AddConfig(configName) {
            ConfigManager._configList.push(configName);
        }
        static AddExtraConfig(_url) {
            if (_url.length > 0) {
                ConfigManager._extraConfig.push(..._url);
                ConfigManager._extraConfig = ArrayUtils.Unique(ConfigManager._extraConfig);
            }
        }
        static StartLoad(onFinished, onProgress = null) {
            if (ConfigManager._configList.length == 0) {
                if (onFinished) {
                    onFinished.run();
                }
                return;
            }
            let loadUrls = [];
            for (let configName of ConfigManager._configList) {
                loadUrls.push(EssentialResUrls.ConfigURL(configName.path.match(/[a-zA-Z0-9.]*$/)[0]));
            }
            let _clearURLs = [];
            loadUrls.forEach((item) => {
                _clearURLs.push(item);
            });
            loadUrls.push(...this._extraConfig);
            Laya.loader.create(loadUrls, Laya.Handler.create(this, () => {
                for (let configName of ConfigManager._configList) {
                    configName.data = Laya.loader.getRes(EssentialResUrls.ConfigURL(configName.path.match(/[a-zA-Z0-9.]*$/)[0]));
                    configName.dataList = [];
                    for (let configKey in configName.data) {
                        let value = configName.data[configKey];
                        if (value != null) {
                            configName.dataList.push(value);
                        }
                    }
                    if (configName.dataList.length > 0) {
                        configName.lastData = configName.dataList[configName.dataList.length - 1];
                    }
                }
                if (onFinished) {
                    onFinished.run();
                }
                _clearURLs.forEach((item) => {
                    ResLoad.Unload(item);
                });
            }), onProgress);
        }
    }
    ConfigManager._configList = [];
    ConfigManager._extraConfig = [];

    var GameConst;
    (function (GameConst) {
        class config {
        }
        GameConst.config = config;
        GameConst.path = "res/config/GameConst.json";
    })(GameConst || (GameConst = {}));

    class LoadUIPack {
        constructor(packPath, atliasCount = -1, _extraURL) {
            this.packPath = packPath;
            this.atliasCount = atliasCount;
            this.m_extraURL = _extraURL;
        }
        PushUrl(urls) {
            urls.push({ url: this.packPath + ".bin", type: Laya.Loader.BUFFER });
            if (this.m_extraURL && this.m_extraURL.length > 0) {
                urls.push(...this.m_extraURL);
            }
            if (this.atliasCount >= 0) {
                urls.push({ url: this.packPath + "_atlas0.png", type: Laya.Loader.IMAGE });
                for (let i = 1; i <= this.atliasCount; i++) {
                    urls.push({ url: this.packPath + "_atlas0_" + i + ".png", type: Laya.Loader.IMAGE });
                }
            }
        }
        AddPackage() {
            fgui.UIPackage.addPackage(this.packPath);
        }
    }

    class ComData extends RootLocalStorageData {
    }

    class CommonDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new CommonDataProxy();
            }
            return this._instance;
        }
        static get comData() {
            return this._instance._saveData;
        }
        get _saveName() {
            return "Common";
        }
        getNewData() {
            return new ComData();
        }
    }

    class RootGameLoad {
        constructor() {
            this._needLoadOtherUIPack = [];
            this._loadProgressWeight = {
                config: 1,
                gameRes: 5,
                otherUI: 3,
            };
            this._configProgress = 0;
            this._otherUIProgress = 0;
            this._resProgress = 0;
        }
        get loadProgress() {
            let totalWeight = 0;
            for (let i in this._loadProgressWeight) {
                totalWeight += this._loadProgressWeight[i];
            }
            let loadWeight = this._loadProgressWeight.config * this._configProgress
                + this._loadProgressWeight.gameRes * this._resProgress
                + this._loadProgressWeight.otherUI * this._otherUIProgress;
            return (loadWeight / totalWeight) * 100;
        }
        Enter(_this, _beforeHandler, _backHandler) {
            this.m_handlerThis = _this;
            this.m_beforeHandler = _beforeHandler;
            this.m_backHandler = _backHandler;
            this.Init();
        }
        _Init() {
            return;
        }
        Init() {
            let _promise = this._Init();
            let _f = () => {
                this.initEmptyScreen();
            };
            if (_promise) {
                _promise.then(() => {
                    _f();
                });
            }
            else {
                _f();
            }
        }
        initEmptyScreen() {
            SceneManager.instance.init();
            FGuiRootManager.Init();
            this.OnBindUI();
            let loadUrl = [];
            this._initEmptyScreen.PushUrl(loadUrl);
            if (loadUrl.length == 0) {
                this.InitUI();
                return;
            }
            Laya.loader.load(loadUrl, Laya.Handler.create(this, this.InitUI));
        }
        InitUI() {
            this._initEmptyScreen.AddPackage();
            this._OnInitEmptyScreen();
            let _f = () => {
                let loadUrl = [];
                this._initUiPack.PushUrl(loadUrl);
                if (loadUrl.length == 0) {
                    this.OnInitUILoaded();
                    return;
                }
                Laya.loader.load(loadUrl, Laya.Handler.create(this, this.OnInitUILoaded));
            };
            if (this.m_beforeHandler) {
                this.m_beforeHandler.call(this.m_handlerThis).then(() => {
                    _f();
                });
            }
            else {
                _f();
            }
        }
        OnInitUILoaded() {
            this._initUiPack.AddPackage();
            this._OnInitUILoaded();
            this.onLoading(this.loadProgress);
            this.OnConfigLoaded();
        }
        OnConfigLoaded() {
            this.OnSetLoadConfig();
            let _levelSceneURLs = [];
            for (let _i in ELevelSceneName) {
                if (!ELevelSceneName[_i]) {
                    continue;
                }
                _levelSceneURLs.push(EssentialResUrls.levelConfigURL(ELevelSceneName[_i]));
            }
            ConfigManager.AddExtraConfig(_levelSceneURLs);
            if (ConfigManager.needLoadCount <= 0) {
                this._OnConfigProgress(1);
                this._OnConfigLoaded();
                return;
            }
            ConfigManager.StartLoad(Laya.Handler.create(this, this._OnConfigLoaded), Laya.Handler.create(this, this._OnConfigProgress, null, false));
        }
        _OnConfigProgress(value) {
            this._configProgress = value;
            this.onLoading(this.loadProgress);
        }
        _OnConfigLoaded() {
            SceneManager.instance.initConfig();
            let uiLoadData = [];
            for (let i = 0; i < this._needLoadOtherUIPack.length; ++i) {
                this._needLoadOtherUIPack[i].PushUrl(uiLoadData);
            }
            if (uiLoadData.length == 0) {
                this._OnOtherUIProgress(1);
                this._OnOtherUILoaded();
                return;
            }
            Laya.loader.load(uiLoadData, Laya.Handler.create(this, this._OnOtherUILoaded), Laya.Handler.create(this, this._OnOtherUIProgress, null, false));
        }
        _OnOtherUIProgress(value) {
            this._otherUIProgress = value;
            this.onLoading(this.loadProgress);
        }
        _OnOtherUILoaded() {
            for (let i = 0; i < this._needLoadOtherUIPack.length; ++i) {
                this._needLoadOtherUIPack[i].AddPackage();
            }
            let loadUrls = [];
            this.OnGameResPrepared(loadUrls);
            loadUrls.push(...EssentialResUrls.EssentialOtherResUrl());
            SceneManager.instance.Preload(loadUrls);
            if (loadUrls.length == 0) {
                this._OnResProgress(1);
                this._OnResLoaded();
                return;
            }
            Laya.loader.create(loadUrls, Laya.Handler.create(this, this._OnResLoaded), Laya.Handler.create(this, this._OnResProgress, null, false));
        }
        _OnResProgress(value) {
            this._resProgress = value;
            this.onLoading(this.loadProgress);
        }
        _OnResLoaded() {
            Global3D.InitAll();
            this.loginCommonData();
            this.loginData();
            if (this.m_backHandler) {
                this.m_backHandler.call(this.m_handlerThis).then(() => {
                    this.OnComplete();
                });
            }
            else {
                this.OnComplete();
            }
        }
        loginCommonData() {
            CommonDataProxy.instance.InitData();
        }
        OnBindUI() { }
        OnSetLoadConfig() { }
        OnGameResPrepared(urls) { }
        _OnInitEmptyScreen() { }
        _OnInitUILoaded() { }
        onLoading(_n) { }
        loginData() { }
        OnComplete() { }
    }

    var SkinConfig;
    (function (SkinConfig) {
        class config {
        }
        SkinConfig.config = config;
        SkinConfig.path = "res/config/SkinConfig.json";
    })(SkinConfig || (SkinConfig = {}));

    class FGUI_splash extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("InitLoad", "splash"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_progress = (this.getChildAt(1));
            this.m_loading_progress = (this.getChildAt(2));
            this.m_text_logo = (this.getChildAt(3));
            this.m_text_progress = (this.getChildAt(4));
            this.m_text_laya = (this.getChildAt(5));
            this.m_text_explain = (this.getChildAt(6));
            this.m_text_v = (this.getChildAt(7));
            this.m_text_laya_v = (this.getChildAt(8));
            this.m_text_game_explain = (this.getChildAt(9));
        }
    }
    FGUI_splash.URL = "ui://n3oedpp6nihr0";

    var GameStateConst;
    (function (GameStateConst) {
        class config {
        }
        GameStateConst.config = config;
        GameStateConst.path = "res/config/GameStateConst.json";
    })(GameStateConst || (GameStateConst = {}));

    class GameCommonBinder {
        static bindAll() {
        }
    }

    class GameMainBinder {
        static bindAll() {
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameSet.URL, FGUI_PGameSet);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGamePause.URL, FGUI_PGamePause);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameCustomsLoading.URL, FGUI_PGameCustomsLoading);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameLoading.URL, FGUI_PGameLoading);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGamePlay.URL, FGUI_PGamePlay);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameStart.URL, FGUI_PGameStart);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameTestUI.URL, FGUI_PGameTestUI);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameEnd.URL, FGUI_PGameEnd);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameTestMain.URL, FGUI_PGameTestMain);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameCom.URL, FGUI_PGameCom);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameMain.URL, FGUI_PGameMain);
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_PGameTestPlatform.URL, FGUI_PGameTestPlatform);
        }
    }

    class FGUI_EmptyScreen extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject("InitEmptyScreen", "EmptyScreen"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
        }
    }
    FGUI_EmptyScreen.URL = "ui://7ktzib8oq3ng0";

    class InitEmptyScreenBinder {
        static bindAll() {
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_EmptyScreen.URL, FGUI_EmptyScreen);
        }
    }

    class InitLoadBinder {
        static bindAll() {
            fairygui.UIObjectFactory.setPackageItemExtension(FGUI_splash.URL, FGUI_splash);
        }
    }

    var ESounds;
    (function (ESounds) {
        ESounds["null"] = "";
    })(ESounds || (ESounds = {}));

    var CameraConst;
    (function (CameraConst) {
        class config {
        }
        CameraConst.config = config;
        CameraConst.path = "res/config/CameraConst.json";
    })(CameraConst || (CameraConst = {}));

    var LightingConst;
    (function (LightingConst) {
        class config {
        }
        LightingConst.config = config;
        LightingConst.path = "res/config/LightingConst.json";
    })(LightingConst || (LightingConst = {}));

    class GamePropData extends RootLocalStorageData {
        constructor() {
            super(...arguments);
            this.coinCount = 0;
        }
    }

    class GamePropDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GamePropDataProxy();
            }
            return this._instance;
        }
        get _saveName() {
            return "GameProp";
        }
        getNewData() {
            return new GamePropData();
        }
    }

    class GameSkinData extends RootLocalStorageData {
    }

    class GameSkinDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GameSkinDataProxy();
            }
            return this._instance;
        }
        get _saveName() {
            return "GameSkin";
        }
        getNewData() {
            return new GameSkinData();
        }
    }

    class GameSignData extends RootLocalStorageData {
        constructor() {
            super(...arguments);
            this.ifSignIn = false;
            this.ifOneDay = false;
        }
    }

    class GameSignDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GameSignDataProxy();
            }
            return this._instance;
        }
        get _saveName() {
            return "GameSign";
        }
        getNewData() {
            return new GameSignData();
        }
    }

    var LevelPropConfig;
    (function (LevelPropConfig) {
        class config {
        }
        LevelPropConfig.config = config;
        LevelPropConfig.path = "res/config/LevelPropConfig.json";
    })(LevelPropConfig || (LevelPropConfig = {}));

    var OtherConst;
    (function (OtherConst) {
        class config {
        }
        OtherConst.config = config;
        OtherConst.path = "res/config/OtherConst.json";
    })(OtherConst || (OtherConst = {}));

    var EBGMs;
    (function (EBGMs) {
        EBGMs["null"] = "";
    })(EBGMs || (EBGMs = {}));

    class GameNewHandData extends RootLocalStorageData {
    }

    class GameNewHandDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GameNewHandDataProxy();
            }
            return this._instance;
        }
        get _saveName() {
            return "GameNewHand";
        }
        getNewData() {
            return new GameNewHandData();
        }
    }

    class GameTestData extends RootLocalStorageData {
        constructor() {
            super(...arguments);
            this.testNumber = 0;
            this.testBoolean = false;
            this.testArray = [];
            this.testObject = {
                a: 0,
                b: 0,
                c: 0,
            };
        }
    }

    class GameTestDataProxy extends RootLocalStorageProxy {
        constructor() {
            super();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new GameTestDataProxy();
            }
            return this._instance;
        }
        get _saveName() {
            return "GameTest";
        }
        getNewData() {
            return new GameTestData();
        }
    }

    class GameLoad extends RootGameLoad {
        _Init() {
            GlobalStateManager.instance.GameInit();
            this._initEmptyScreen = new LoadUIPack(EssentialResUrls.FGUIPack('InitEmptyScreen'));
            this._initUiPack = new LoadUIPack(EssentialResUrls.FGUIPack('InitLoad'), 0);
            this._needLoadOtherUIPack = [
                new LoadUIPack(EssentialResUrls.FGUIPack('GameCommon')),
                new LoadUIPack(EssentialResUrls.FGUIPack('GameMain'), 0),
            ];
            return;
        }
        _OnInitEmptyScreen() {
            this._emptyScreenShowUI = FGuiRootManager.AddUI(FGUI_EmptyScreen, new FGuiData(), EUILayer.Main);
        }
        _OnInitUILoaded() {
            this._emptyScreenShowUI.dispose();
            this._loadShowUI = FGuiRootManager.AddUI(FGUI_splash, new FGuiData(), EUILayer.Loading);
            this._loadShowUI.sortingOrder = Number.MAX_SAFE_INTEGER;
            this._loadShowUI.m_text_explain.text = MainConfig.GameWhatTeam;
            this._loadShowUI.m_text_logo.text = MainConfig.GameName_;
            this._loadShowUI.m_text_v.text = MainConfig.versions;
            this._loadShowUI.m_text_game_explain.text = MainConfig.GameExplain;
            this._loadShowUI.m_text_laya_v.text = Laya.version;
            this._loadingProgress = this._loadShowUI.m_progress;
            this._loadingProgressText = this._loadShowUI.m_loading_progress;
            this._loadingProgress.value = 0;
        }
        OnBindUI() {
            InitEmptyScreenBinder.bindAll();
            InitLoadBinder.bindAll();
            GameCommonBinder.bindAll();
            GameMainBinder.bindAll();
        }
        OnSetLoadConfig() {
            ConfigManager.AddConfig(CameraConst);
            ConfigManager.AddConfig(EnvironmentConfig);
            ConfigManager.AddConfig(OtherEnvironmentConfig);
            ConfigManager.AddConfig(GameConst);
            ConfigManager.AddConfig(GameStateConst);
            ConfigManager.AddConfig(LevelConfig);
            ConfigManager.AddConfig(OtherLevelConfig);
            ConfigManager.AddConfig(LevelPropConfig);
            ConfigManager.AddConfig(LightingConst);
            ConfigManager.AddConfig(OtherConst);
            ConfigManager.AddConfig(SkinConfig);
            ConfigManager.AddConfig(TestConst);
        }
        loginData() {
            GameDataProxy.instance.InitData();
            GameNewHandDataProxy.instance.InitData();
            GamePropDataProxy.instance.InitData();
            GameSkinDataProxy.instance.InitData();
            GameSignDataProxy.instance.InitData();
            GameShortDataProxy.instance.InitData();
            GameTestDataProxy.instance.InitData();
        }
        OnGameResPrepared(urls) {
            let _str;
            for (let _i in EBGMs) {
                _str = EBGMs[_i];
                if (_str == '')
                    continue;
                urls.push(ResUrl.music_url(_str));
            }
            for (let _i in ESounds) {
                _str = ESounds[_i];
                if (_str == '')
                    continue;
                urls.push(ResUrl.sound_url(_str));
            }
        }
        onLoading(_n) {
            this._loadingProgress.value = _n;
            this._loadingProgressText.text = Math.floor(_n).toString() + '%';
        }
        OnComplete() {
            this._loadShowUI.dispose();
            GlobalStateManager.instance.GameOnInit();
        }
    }

    class Game2D {
        constructor() { }
        static get instance() {
            if (this._instance == null) {
                this._instance = new Game2D();
            }
            return this._instance;
        }
        enterGame() {
            this.initGame();
        }
        initGame() {
        }
    }

    class RootTest {
        startTest() { }
    }

    class ConsoleTest extends RootTest {
        constructor() {
            super(...arguments);
            this._consoleExStr = '输出测试';
        }
        startTest() {
            console.log('->开启测试<-');
            console.log(...ConsoleEx.packLog(this._consoleExStr));
            console.log(...ConsoleEx.packWarn(this._consoleExStr));
            console.log(...ConsoleEx.packError(this._consoleExStr));
        }
    }

    class MainTest extends RootTest {
        startTest() {
            new ConsoleTest().startTest();
        }
    }

    class AsyncTest extends RootTest {
        startTest() {
            this.asyncTest();
        }
        asyncTest() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('异步开始');
                yield this._asyncTest();
                console.log('异步结束');
            });
        }
        _asyncTest() {
            return new Promise((_r) => {
                Laya.timer.once(1000, this, () => {
                    console.log('异步函数执行中');
                    _r();
                });
            });
        }
    }

    class OIMODebug extends RootTest {
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            else {
                this._instance = new OIMODebug();
                return this._instance;
            }
        }
        start(_prefabs) {
            let _spr = [];
        }
    }

    class MyMainTest extends RootTest {
        startTest() {
            new AsyncTest().startTest();
            new OIMODebug().startTest();
        }
    }

    class MainDebug extends RootDebug {
        constructor() {
            super(...arguments);
            this._name = 'Main';
        }
        _startDebug() {
            console.log('开启主调试');
            EnvironmentDebug.instance.startDebug();
            DataDebug.instance.startDebug();
        }
    }

    class CustomDebug extends RootDebug {
        constructor() {
            super();
            this._name = 'Custom';
        }
        static get instance() {
            if (!this.m_instance) {
                this.m_instance = new CustomDebug();
            }
            return this.m_instance;
        }
    }

    class MyMainDebug extends RootDebug {
        constructor() {
            super(...arguments);
            this._name = 'MyMainDebug';
        }
        _startDebug() {
            CustomDebug.instance.startDebug();
        }
    }

    class MainStart {
        constructor() {
            this.init().then(() => {
                this.upGameLoad();
                this.gameLoad();
            });
        }
        init() {
            return new Promise((r) => {
                PlatformManager.instance.init();
                PlatformManager.instance.initPlatform();
                this.loadSubpackage().then(() => {
                    r();
                });
            });
        }
        loadSubpackage() {
            return new Promise((r) => {
                if (FrameSubpackages.subpackages.length > 0) {
                    let _promiseList = [];
                    for (let _o of FrameSubpackages.subpackages) {
                        if (_o.name) {
                            _promiseList.push(new Promise((r) => {
                                PlatformManager.PlatformInstance.LoadSubpackage(_o.name, Laya.Handler.create(this, () => {
                                    r();
                                }), Laya.Handler.create(this, () => {
                                    r();
                                }), undefined);
                            }));
                        }
                    }
                    Promise.all(_promiseList).then(() => {
                        r();
                    });
                }
                else {
                    r();
                }
            });
        }
        upGameLoad() {
            if (MainGameConfig.ifTest) {
                new MainTest().startTest();
                new MyMainTest().startTest();
            }
            if (MainGameConfig.ifDebug) {
                new MainDebug().startDebug();
                new MyMainDebug().startDebug();
                if (MainGameConfig.ifOpenWindowDebug) {
                    RootDebug.openWindowDebug();
                }
            }
        }
        gameLoad() {
            let _gameLoad = new GameLoad();
            console.log(...ConsoleEx.comLog('开始加载游戏'));
            _gameLoad.Enter(this, undefined, this.OnGameLoad);
        }
        OnGameLoad() {
            return new Promise((_r) => {
                _r();
                console.log(...ConsoleEx.comLog('游戏加载完成'));
                if (MainGameConfig.support3D) {
                    Game3D.instance.enterGame();
                }
                if (MainGameConfig.support2D) {
                    Game2D.instance.enterGame();
                }
                this.OnGameEnter();
            });
        }
        OnGameEnter() { }
    }

    class LayaMiniGameConfig {
        constructor() {
            this.name = "LayaMiniGame";
            this.ZHName = "LayaBox小游戏";
            this.versions = "1.2.5";
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            new MainStart();
        }
    }
    let _LayaMiniGameConfig = new LayaMiniGameConfig();
    window['$' + _LayaMiniGameConfig.name] = _LayaMiniGameConfig;
    new Main();

}());
//# sourceMappingURL=bundle.js.map
