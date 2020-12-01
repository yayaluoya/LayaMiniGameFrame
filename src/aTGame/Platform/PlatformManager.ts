import BDData from "../../cFrameBridge/Platform/Data/BDData";
import OPPOData from "../../cFrameBridge/Platform/Data/OPPOData";
import QQData from "../../cFrameBridge/Platform/Data/QQData";
import QTTData from "../../cFrameBridge/Platform/Data/QTTData";
import TTData from "../../cFrameBridge/Platform/Data/TTData";
import WXData from "../../cFrameBridge/Platform/Data/WXData";
import ConsoleEx from "../Console/ConsoleEx";
import IRootManager from "../Manager/IRootManager";
import PlatformData from "./Data/PlatformData";
import BDPlatform from "./PlatformClass/BDPlatform";
import DefaultPlatform from "./PlatformClass/DefaultPlatform";
import OppoPlatform from "./PlatformClass/OppoPlatform";
import QQPlatform from "./PlatformClass/QQPlatform";
import QTTPlatform from "./PlatformClass/QTTPlatform";
import TTPlatform from "./PlatformClass/TTPlatform";
import WXPlatform from "./PlatformClass/WXPlatform";
import PlatformManagerProxy from "./PlatformManagerProxy";
import IPlatform from "./T/IPlatform";
/**
 * 平台管理器
 */
export default class PlatformManager implements IRootManager {
    /** 平台实例 */
    private static _instance: PlatformManager;
    public static get instance(): PlatformManager {
        if (this._instance == null) {
            this._instance = new PlatformManager();
        }
        return this._instance;
    }

    /** 平台实例 */
    private m_platformInstance: IPlatform;

    /** 平台数据 */
    private m_platformData: PlatformData;

    /** 获取平台实例 */
    public static get PlatformInstance(): IPlatform {
        if (!this.instance.m_platformInstance) {
            console.log(...ConsoleEx.packError('还没有设置过平台实例代理！'));
        }
        return this.instance.m_platformInstance;
    }

    /**
     * 初始化平台
     * @param appId 
     */
    public init() {
        if (this.m_platformInstance != null) {
            console.error(...ConsoleEx.packError("已调用过平台创建为", PlatformManagerProxy.GetPlatformStr(this.m_platformInstance.platform), "不能重复创建"));
            return this.m_platformInstance;
        }
        let isQTT = window["qttGame"] != null;
        let isTT = window["tt"] != null;
        //获取平台实例
        let result: IPlatform;
        if (isTT) {
            result = new TTPlatform();
            //
            this.m_platformData = new TTData();
        } else if (Laya.Browser.onMiniGame) {
            result = new WXPlatform();
            //
            this.m_platformData = new WXData();
        } else if (Laya.Browser.onBDMiniGame) {
            result = new BDPlatform();
            //
            this.m_platformData = new BDData();
        } else if (isQTT) {
            result = new QTTPlatform();
            //
            this.m_platformData = new QTTData();
        } else if (Laya.Browser.onQQMiniGame) {
            result = new QQPlatform();
            //
            this.m_platformData = new QQData();
        } else if (Laya.Browser.onQGMiniGame) {
            result = new OppoPlatform();
            //
            this.m_platformData = new OPPOData();
        }
        else {
            console.log(...ConsoleEx.packWarn("未识别平台,默认创建为web", Laya.Browser.userAgent));
            result = new DefaultPlatform();
        }
        this.m_platformInstance = result;
        //设置代理
        PlatformManagerProxy.instance.PlatformInstance = result;
        //设置到全局
        window['$Platform'] = this.m_platformInstance;
        //
        console.log(...ConsoleEx.packPlatform("平台实例创建完成", PlatformManagerProxy.GetPlatformStr(this.m_platformInstance.platform)));
    }

    /**
     * 初始化平台
     */
    public initPlatform() {
        //
        this.m_platformInstance.Init(this.m_platformData);
        //
        console.log(...ConsoleEx.packPlatform('平台初始化完成'));
    }
}