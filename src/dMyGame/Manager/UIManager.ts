import PGameLoadingMediator from '../UIMediator/PGameLoadingMediator';
import PGameMainMediator from '../UIMediator/PGameMainMediator';
import PGamePlayMediator from '../UIMediator/PGamePlayMediator';
import PGameStartMediator from '../UIMediator/PGameStartMediator';
import { EUI } from '../Enum/EUI';
import UIManagerProxy from './Proxy/UIManagerProxy';
import PGameCustomsLoadingMediator from '../UIMediator/PGameCustomsLoadingMediator';
import PGamePauseMediator from '../UIMediator/PGamePauseMediator';
import PGameSetMediator from '../UIMediator/PGameSetMediator';
import PGameComMediator from '../UIMediator/PGameComMediator';
import PGameEndMediator from '../UIMediator/PGameEndMediator';
import PGameTestMainMediator from '../UIMediator/_test/PGameTestMainMediator';
import PGameTestPlatformMediator from '../UIMediator/_test/PGameTestPlatformMediator';
import BaseUIManager from '../../aTGame/UI/FGUI/BaseUIManager';
import IRootManager from '../../aTGame/Manager/IRootManager';
/**
 * UI管理器
 * UI从这里开始，注册所有UI调度者，再分配给UI状态管理器管理,不能再UI调度者中直接调用
 * 沟通外界，处理一些不能在UI中产生和处理的事件，通过这里中转
 */
export default class UIManager extends BaseUIManager<UIManagerProxy> implements IRootManager {
    private static m_instance: UIManager;
    /** 单例 */
    public static get instance(): UIManager {
        if (!this.m_instance) {
            this.m_instance = new UIManager();
        }
        return this.m_instance;
    }

    //
    private constructor() {
        super();
    }

    /** 初始化UI调度者列表和代理类 */
    protected initUIMediator() {
        //初始化ui状态管理器
        this.m_UIMediator = {
            [EUI.GameLoading]: PGameLoadingMediator.instance,
            [EUI.CustomsLoading]: PGameCustomsLoadingMediator.instance,
            //
            [EUI.TestMain]: PGameTestMainMediator.instance,
            [EUI.TestPlatform]: PGameTestPlatformMediator.instance,
            //
            [EUI.Main]: PGameMainMediator.instance,
            [EUI.Set]: PGameSetMediator.instance,
            [EUI.Play]: PGamePlayMediator.instance,
            [EUI.Start]: PGameStartMediator.instance,
            [EUI.Pause]: PGamePauseMediator.instance,
            [EUI.Com]: PGameComMediator.instance,
            [EUI.End]: PGameEndMediator.instance,
        };
        //注册代理类
        this.m_UIProxy = UIManagerProxy.instance;
    }

    /**
     * 初始化,UI的一切都从这里开始
     */
    public init() {
        //
    }

    /**
     * 开始
     */
    public Start() {
        this.m_UIProxy.Start();
    }
}