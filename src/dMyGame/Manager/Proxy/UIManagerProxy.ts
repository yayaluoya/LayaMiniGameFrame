import RootUIStateManagerProxy from '../../../aTGame/UI/FGUI/RootUIStateManagerProxy';
import { EEventGlobal } from '../../EventEnum/EEventGlobal';
import { EUI } from '../../Enum/EUI';
import MesManager from '../MesManager';
import { EEventUI } from '../../EventEnum/EEventUI';
import PGameMainMediator from '../../UIMediator/PGameMainMediator';
/**
 * UIManager类调度者代理
 */
export default class UIManagerProxy extends RootUIStateManagerProxy {
    private static m_instance: UIManagerProxy;
    /** 单例 */
    public static get instance(): UIManagerProxy {
        if (!this.m_instance) {
            this.m_instance = new UIManagerProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    /** 获取主页面调度者单例 */
    public get gameMainMediator(): PGameMainMediator {
        return this.getUIMeiatro<PGameMainMediator>(EUI.Main);
    }

    //初始化
    protected Init() {
        //监听全局事件
        MesManager.instance.onEvent(EEventGlobal.GameLoading, this, this.gameLoading);//游戏加载
        MesManager.instance.onEvent(EEventGlobal.GameResLoading, this, this.gameResLoading);//游戏资源加载
        //监听UI事件
        MesManager.instance.onEvent(EEventUI.SceneGameCustomsLoading, this, this.gameCustomsLoading);//关卡加载
    }

    /**
     * 开始
     */
    public Start() {
        //设置初始UI
        this.setUIState([
            { typeIndex: EUI.Main, },
            // { typeIndex: EUI.Start, },
            { typeIndex: EUI.TestMain, },
        ]);
    }

    /** 游戏加载 */
    private gameLoading() { }
    /** 游戏资源加载 */
    private gameResLoading() { }

    //游戏初始化
    private gameCustomsLoading(_n: number) {
        if (_n == -1) {
            //显示关卡加载页面
            this.setUIState([
                { typeIndex: EUI.CustomsLoading, },
            ], false);
        }
    }
}