import BaseUIMediator from "../../aTGame/UI/FGUI/BaseUIMediator";
import FGUI_PGameCom from "../../FGUI/GameMain/FGUI_PGameCom";

/**
 * 游戏完成页面调度者   
 */
export default class PGameComMediator extends BaseUIMediator<FGUI_PGameCom>{
    private static m_instance: PGameComMediator;
    /** 单例 */
    public static get instance(): PGameComMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameComMediator();
            this.m_instance._classDefine = FGUI_PGameCom;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //显示时的生命周期函数
    protected _OnShow() {
        //
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}