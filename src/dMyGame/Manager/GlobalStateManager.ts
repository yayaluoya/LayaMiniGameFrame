import IRootManager from '../../aTGame/Manager/IRootManager';
import { EEventGlobal } from '../EventEnum/EEventGlobal';
import MesManager from './MesManager';
/**
 * 游戏全局状态管理器
 * 可以监听和触发全局事件
 */
export class GlobalStateManager implements IRootManager {
    private static m_instance: GlobalStateManager;
    /** 单例 */
    public static get instance(): GlobalStateManager {
        if (!this.m_instance) {
            this.m_instance = new GlobalStateManager();
        }
        return this.m_instance;
    }
    private constructor() { }
    /**
     * 初始化
     */
    public init() { }

    /** 游戏是否初始化 */
    private m_GameIfInit: boolean = false;

    /** 游戏是否初始化 */
    public get gameIfInit(): boolean {
        return this.m_GameIfInit
    }

    /**
     * 游戏初始化
     */
    public GameInit() {
        this.m_GameIfInit = false;
        MesManager.instance.sendEvent(EEventGlobal.GameInit);
    }

    /**
     * 游戏初始化完成
     */
    public GameOnInit() {
        this.m_GameIfInit = true;
        MesManager.instance.sendEvent(EEventGlobal.GameOnInit);
    }
}