import BaseUIMediator from "../../../aTGame/UI/FGUI/BaseUIMediator";
import FGuiData from "../../../aTGame/UI/FGUI/FGuiData";
import FGUI_PGameTestUI from "../../../FGUI/GameMain/FGUI_PGameTestUI";

/**
 * 游戏测试UI页面调度者
 */
export default class PGameUITestMediator extends BaseUIMediator<FGUI_PGameTestUI> {
    private static m_instance: PGameUITestMediator;
    /** 单例 */
    public static get instance(): PGameUITestMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameUITestMediator();
            this.m_instance._classDefine = FGUI_PGameTestUI;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //
    protected get _fguiData(): FGuiData {
        let _fguiData: FGuiData = new FGuiData();
        _fguiData.top = 100;
        _fguiData.bottom = 50;
        return _fguiData;
    }

    //显示时的生命周期函数
    protected _OnShow() {
        //
        this.ui.m_bg.onClick(this, this.close);
    }

    //关闭
    private close() {
        this.Hide();
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}