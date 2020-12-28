import { LoadUIPack } from '../UI/FGUI/LoadUIPack';
import { ConfigManager } from '../Config/ConfigManager';
import SceneManager from '../3D/SceneManager';
import FGuiRootManager from '../UI/FGUI/FGuiRootManager';
import Global3D from '../3D/Global3D';
import EssentialResUrls from '../Res/EssentialResUrls';
import CommonDataProxy from '../Commom/CommonDataProxy';
import { ELevelSceneName } from '../../cFrameBridge/Config/ELevelSceneName';
/**
 * 游戏进入之前的加载操作基类
 * 加载分包
 * 加载顺序
 * 白屏显示UI包
 * 游戏初始化加载资源UI包
 * 配置文件
 * 其他UI包
 * 其他游戏资源
 */
export default class RootGameLoad {
    /** 白屏时的UI包 */
    protected _initEmptyScreen: LoadUIPack;

    /** 用于初始化的ui包-只能有一个，减少游戏初始加载内容 */
    protected _initUiPack: LoadUIPack;

    /** 需要加载的其他UI包 */
    protected _needLoadOtherUIPack: LoadUIPack[] = [];

    /** 外部处理函数执行域 */
    private m_handlerThis: any;
    /** 加载页面之前，白屏之后处理 */
    private m_beforeHandler: () => Promise<void>;
    /** 加载完成后，加载进度消失前处理 */
    private m_backHandler: () => Promise<void>;

    /**
     * 资源加载权重
     */
    private _loadProgressWeight: {
        config: number,
        gameRes: number,
        otherUI: number,
    } = {
            config: 1,//配置
            gameRes: 5,//游戏资源
            otherUI: 3,//其他ui
        };
    //配置文件加载进度
    private _configProgress: number = 0;
    //其他UI加载进度
    private _otherUIProgress: number = 0;
    //其他游戏资源加载进度
    private _resProgress: number = 0;
    //总加载进度
    private get loadProgress(): number {
        //总配比
        let totalWeight: number = 0;
        for (let i in this._loadProgressWeight) {
            totalWeight += this._loadProgressWeight[i];
        }
        //加载配比
        let loadWeight: number =
            this._loadProgressWeight.config * this._configProgress//配置文件
            + this._loadProgressWeight.gameRes * this._resProgress//游戏资源
            + this._loadProgressWeight.otherUI * this._otherUIProgress;//其他UI
        //返回总进度
        return (loadWeight / totalWeight) * 100;
    }

    /**
     * 开始
     */
    public Enter(_this: any, _beforeHandler?: () => Promise<void>, _backHandler?: () => Promise<void>) {
        //保存回调
        this.m_handlerThis = _this;
        this.m_beforeHandler = _beforeHandler;
        this.m_backHandler = _backHandler;
        //
        this.Init();
    }

    //初始化之前，可以返回一个promise(使用时重写)
    protected _Init(): Promise<void> {
        return;
    }

    // 初始化
    private Init() {
        //判断初始化函数有没有promise返回值
        let _promise: Promise<void> = this._Init();
        let _f = () => {
            //开始初始化白屏页面
            this.initEmptyScreen();
        }
        if (_promise) {
            //初始化之前
            _promise.then(() => {
                _f();
            });
        } else {
            _f();
        }
    }

    //初始化空白页面
    private initEmptyScreen() {
        //初始化场景管理器
        SceneManager.instance.init();
        //初始化FGUI
        FGuiRootManager.Init();
        //捆绑所有UI
        this.OnBindUI();
        //获取空白页面资源地址列表
        let loadUrl = [];
        this._initEmptyScreen.PushUrl(loadUrl);
        //判断是否有资源
        if (loadUrl.length == 0) {
            this.InitUI();
            return;
        }
        //加载初始化UI包
        Laya.loader.load(loadUrl, Laya.Handler.create(this, this.InitUI));
    }

    //初始化UI
    private InitUI() {
        //
        this._initEmptyScreen.AddPackage();
        //回调，打开空白页面
        this._OnInitEmptyScreen();
        //获取需要加载的初始化UI路径列表
        let _f: Function = () => {
            let loadUrl = [];
            this._initUiPack.PushUrl(loadUrl);
            //判断是否有资源
            if (loadUrl.length == 0) {
                this.OnInitUILoaded();
                return;
            }
            //加载初始化UI包
            Laya.loader.load(loadUrl, Laya.Handler.create(this, this.OnInitUILoaded));
        }
        //判断是否有加载之前处理函数
        if (this.m_beforeHandler) {
            this.m_beforeHandler.call(this.m_handlerThis).then(() => {
                _f();
            });
        } else {
            _f();
        }
    }

    //初始化UI包加载完成
    private OnInitUILoaded() {
        //
        this._initUiPack.AddPackage();
        // 回调 (打开初始UI设置进度条)
        this._OnInitUILoaded();
        //
        this.onLoading(this.loadProgress);
        // 加载配置文件
        this.OnConfigLoaded();
    }

    //加载配置文件
    private OnConfigLoaded() {
        //设置要添加的配置文件
        this.OnSetLoadConfig();
        //添加其他必要配置文件路径列表
        let _levelSceneURLs: string[] = [];
        for (let _i in ELevelSceneName) {
            if (!ELevelSceneName[_i]) {
                continue;
            }
            _levelSceneURLs.push(EssentialResUrls.levelConfigURL(ELevelSceneName[_i]));
        }
        ConfigManager.AddExtraConfig(_levelSceneURLs);
        //
        if (ConfigManager.needLoadCount <= 0) {
            this._OnConfigProgress(1);
            this._OnConfigLoaded();
            return;
        }
        //使用的是Laya.loader.create方法加载
        ConfigManager.StartLoad(
            Laya.Handler.create(this, this._OnConfigLoaded),
            Laya.Handler.create(this, this._OnConfigProgress, null, false)
        );
    }

    //配置文件加载进度
    private _OnConfigProgress(value: number) {
        this._configProgress = value;
        //
        this.onLoading(this.loadProgress);
    }

    //加载配置文件完成
    private _OnConfigLoaded() {
        //设置配置文件
        SceneManager.instance.initConfig();
        //获取其他需要加载的UI文件路径列表
        let uiLoadData = [];
        for (let i = 0; i < this._needLoadOtherUIPack.length; ++i) {
            this._needLoadOtherUIPack[i].PushUrl(uiLoadData);
        }
        //判断是否有资源
        if (uiLoadData.length == 0) {
            this._OnOtherUIProgress(1);
            this._OnOtherUILoaded();
            return;
        }
        //加载
        Laya.loader.load(uiLoadData,
            Laya.Handler.create(this, this._OnOtherUILoaded),
            Laya.Handler.create(this, this._OnOtherUIProgress, null, false)
        );
    }

    //其他UI加载进度
    private _OnOtherUIProgress(value: number) {
        this._otherUIProgress = value;
        //
        this.onLoading(this.loadProgress);
    }

    //其他UI加载完成
    private _OnOtherUILoaded() {
        for (let i = 0; i < this._needLoadOtherUIPack.length; ++i) {
            this._needLoadOtherUIPack[i].AddPackage();
        }
        // 获取需要加载的游戏资源路径列表
        let loadUrls = [];
        this.OnGameResPrepared(loadUrls);
        //添加必要的资源
        loadUrls.push(...EssentialResUrls.EssentialOtherResUrl());
        //获取需要预加载的场景资源
        SceneManager.instance.Preload(loadUrls);
        //判断是否有资源
        if (loadUrls.length == 0) {
            this._OnResProgress(1);
            this._OnResLoaded();
            return;
        }
        //加载
        Laya.loader.create(loadUrls,
            Laya.Handler.create(this, this._OnResLoaded),
            Laya.Handler.create(this, this._OnResProgress, null, false)
        );
    }

    //游戏其他资源加载进度
    private _OnResProgress(value: number) {
        this._resProgress = value;
        //
        this.onLoading(this.loadProgress);
    }

    //游戏其他资源加载完成
    //# 所有内容加载完成
    private _OnResLoaded() {
        //初始化游戏场景
        Global3D.InitAll();
        //注册数据
        this.loginCommonData();
        this.loginData();
        //处理回调
        if (this.m_backHandler) {
            this.m_backHandler.call(this.m_handlerThis).then(() => {
                //游戏加载完毕
                this.OnComplete();
            });
        } else {
            //游戏加载完毕
            this.OnComplete();
        }
    }

    //注册公共数据
    private loginCommonData() {
        CommonDataProxy.instance.InitData();
    }

    //! //
    // * -----------------------------生命周期函数---------------------------- * //
    //! //

    /**
     * 注册UI
     */
    protected OnBindUI() { }

    /**
     * 注册表格
     */
    protected OnSetLoadConfig() { }

    /**
     * 加载游戏资源
     * @param urls 注入的目标列表
     */
    protected OnGameResPrepared(urls: string[]) { }

    /**
     * 空白页面UI初始化完成 (在这里设置空白页面)
     */
    protected _OnInitEmptyScreen() { }

    /**
     * 初始化UI加载完成 (在这里设置进度条)
     */
    protected _OnInitUILoaded() { }

    /**
     * 加载进度
     * @param _n 0-100 
     */
    protected onLoading(_n: number) { }

    /**
     * 注册数据
     */
    protected loginData() { }

    /**
     * 全部加载完成
     */
    protected OnComplete() { }
}