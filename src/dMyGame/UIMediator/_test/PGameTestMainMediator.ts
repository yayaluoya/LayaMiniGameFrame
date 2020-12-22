import BaseUIMediator from "../../../aTGame/UI/FGUI/BaseUIMediator";
import FGUI_PGameTestMain from "../../../FGUI/GameMain/FGUI_PGameTestMain";
import { EUI } from "../../Enum/EUI";
import UIManagerProxy from "../../Manager/Proxy/UIManagerProxy";
import PGameUITestMediator from "./PGameUITestMediator";

/**
 * 游戏开始页面调度者
 */
export default class PGameTestMainMediator extends BaseUIMediator<FGUI_PGameTestMain>{
    private static m_instance: PGameTestMainMediator;
    /** 单例 */
    public static get instance(): PGameTestMainMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameTestMainMediator();
            this.m_instance._classDefine = FGUI_PGameTestMain;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //显示时的生命周期函数
    protected _OnShow() {
        //
        this.ui.m_test.onClick(this, this.Test);
        this.ui.m_UIButton.onClick(this, this.UITest);
    }

    //打开测试页面
    private Test() {
        UIManagerProxy.instance.setUIState([
            { typeIndex: EUI.TestPlatform },
        ], false);
    }

    //打开测试页面
    private UITest() {
        PGameUITestMediator.instance.Show();
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}