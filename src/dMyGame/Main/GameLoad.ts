import { ConfigManager } from '../../aTGame/Config/ConfigManager';
import { GameConst } from '../_config/GameConst';
import { LevelConfig } from '../_config/LevelConfig';
import { EnvironmentConfig } from '../_config/EnvironmentConfig';
import { LoadUIPack } from '../../aTGame/UI/FGUI/LoadUIPack';
import MainConfig from '../../bTGameConfig/MainConfig';
import RootGameLoad from '../../aTGame/Main/RootGameLoad';
import { EUILayer } from '../../aTGame/UI/FGUI/EUILayer';
import FGuiRootManager from '../../aTGame/UI/FGUI/FGuiRootManager';
import { GlobalStateManager } from '../Manager/GlobalStateManager';
import { SkinConfig } from '../_config/SkinConfig';
import EssentialResUrls from '../../aTGame/Res/EssentialResUrls';
import FGUI_splash from '../../FGUI/InitLoad/FGUI_splash';
import { GameStateConst } from '../_config/GameStateConst';
import ResUrl from '../../aTGame/Res/ResUrl';
import GameCommonBinder from '../../FGUI/GameCommon/GameCommonBinder';
import GameMainBinder from '../../FGUI/GameMain/GameMainBinder';
import InitEmptyScreenBinder from '../../FGUI/InitEmptyScreen/InitEmptyScreenBinder';
import InitLoadBinder from '../../FGUI/InitLoad/InitLoadBinder';
import FGUI_EmptyScreen from '../../FGUI/InitEmptyScreen/FGUI_EmptyScreen';
import { ESounds } from '../ResList/ESounds';
import { CameraConst } from '../_config/CameraConst';
import { LightingConst } from '../_config/LightingConst';
import { TestConst } from '../_config/TestConst';
import GameDataProxy from '../GameData/GameDataProxy';
import GamePropDataProxy from '../GameData/GamePropDataProxy';
import GameSkinDataProxy from '../GameData/GameSkinDataProxy';
import GameSignDataProxy from '../GameData/GameSignDataProxy';
import GameShortDataProxy from '../GameData/GameShortDataProxy';
import { LevelPropConfig } from '../_config/LevelPropConfig';
import { OtherConst } from '../_config/OtherConst';
import { EBGMs } from '../ResList/EBGMs';
import GameNewHandDataProxy from '../GameData/GameNewHandDataProxy';
import { OtherLevelConfig } from '../_config/OtherLevelConfig';
import { OtherEnvironmentConfig } from '../_config/OtherEnvironmentConfig';
import GameTestDataProxy from '../GameData/GameTestDataProxy';
import FGuiData from '../../aTGame/UI/FGUI/FGuiData';
/**
 * 游戏进入之前的加载操作类
 */
export default class GameLoad extends RootGameLoad {
    /** 白屏时显示的UI */
    private _emptyScreenShowUI: FGUI_EmptyScreen;
    /** 加载资源时显示的进度条 */
    private _loadingProgress: fgui.GProgressBar;
    /** 显示进度的文字 */
    private _loadingProgressText: fgui.GTextField;
    //加载时显示的UI
    private _loadShowUI: FGUI_splash;

    //初始化之前的操作
    protected _Init(): Promise<void> {
        GlobalStateManager.instance.GameInit();
        //白屏时显示的包
        this._initEmptyScreen = new LoadUIPack(EssentialResUrls.FGUIPack('InitEmptyScreen'));
        //需要初始化加载的ui包。
        this._initUiPack = new LoadUIPack(EssentialResUrls.FGUIPack('InitLoad'), 0);
        //其他需要加载的UI包
        this._needLoadOtherUIPack = [
            new LoadUIPack(EssentialResUrls.FGUIPack('GameCommon')),//游戏公共包
            new LoadUIPack(EssentialResUrls.FGUIPack('GameMain'), 0),//游戏主包
        ];
        //
        return;
    }

    //初始化
    protected _OnInitEmptyScreen() {
        //打开白屏UI
        this._emptyScreenShowUI = FGuiRootManager.AddUI(FGUI_EmptyScreen, new FGuiData(), EUILayer.Main) as FGUI_EmptyScreen;
    }

    //初始化UI加载完成 (在这里设置进度条)
    protected _OnInitUILoaded() {
        //隐藏白屏U
        this._emptyScreenShowUI.dispose();
        //添加UI
        this._loadShowUI = FGuiRootManager.AddUI(FGUI_splash, new FGuiData(), EUILayer.Loading) as FGUI_splash;
        this._loadShowUI.sortingOrder = Number.MAX_SAFE_INTEGER;
        //设置所属团队
        this._loadShowUI.m_text_explain.text = MainConfig.GameWhatTeam;
        //设置logo
        this._loadShowUI.m_text_logo.text = MainConfig.GameName_;
        //设置版本
        this._loadShowUI.m_text_v.text = MainConfig.versions;
        //设置说明
        this._loadShowUI.m_text_game_explain.text = MainConfig.GameExplain;
        //设置laya版本
        this._loadShowUI.m_text_laya_v.text = Laya.version;
        //获取加载进度条
        this._loadingProgress = this._loadShowUI.m_progress;
        //获取进度显示文字
        this._loadingProgressText = this._loadShowUI.m_loading_progress;
        //设置默认进度
        this._loadingProgress.value = 0;
    }

    //捆绑UI
    protected OnBindUI() {
        InitEmptyScreenBinder.bindAll();
        InitLoadBinder.bindAll();
        GameCommonBinder.bindAll();
        GameMainBinder.bindAll();
    }

    // 注册表格
    protected OnSetLoadConfig() {
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

    //注册数据
    protected loginData() {
        //游戏主要保存数据
        GameDataProxy.instance.InitData();
        //游戏新手引导数据
        GameNewHandDataProxy.instance.InitData();
        //游戏道具数据
        GamePropDataProxy.instance.InitData();
        //游戏皮肤数据
        GameSkinDataProxy.instance.InitData();
        //游戏签到数据
        GameSignDataProxy.instance.InitData();
        //游戏临时数据
        GameShortDataProxy.instance.InitData();
        //测试数据
        GameTestDataProxy.instance.InitData();
    }

    // 获取其它游戏资源, 可以依赖游戏表格
    protected OnGameResPrepared(urls: string[]) {
        //把所有音效添加进预加载列表
        let _str: string;
        //背景音乐
        for (let _i in EBGMs) {
            //
            _str = EBGMs[_i];
            //判断是否是空元素
            if (_str == '') continue;
            //添加进列表
            urls.push(ResUrl.music_url(_str));
        }
        //音效
        for (let _i in ESounds) {
            //
            _str = ESounds[_i];
            //判断是否是空元素
            if (_str == '') continue;
            //添加进列表
            urls.push(ResUrl.sound_url(_str));
        }
    }

    //游戏加载进度
    protected onLoading(_n: number) {
        this._loadingProgress.value = _n;//设置进度条
        this._loadingProgressText.text = Math.floor(_n).toString() + '%';//设置文字进度
    }

    // 完成
    protected OnComplete() {
        //关闭加载时显示的UI
        this._loadShowUI.dispose();
        //游戏初始化完成
        GlobalStateManager.instance.GameOnInit();
    }
}