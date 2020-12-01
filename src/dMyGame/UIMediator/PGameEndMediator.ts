import BaseUIMediator from "../../aTGame/UI/FGUI/BaseUIMediator";
import FGUI_PGameEnd from "../../FGUI/GameMain/FGUI_PGameEnd";

/**
 * 游戏暂停页面调度者
 */
export default class PGameEndMediator extends BaseUIMediator<FGUI_PGameEnd>{
    private static m_instance: PGameEndMediator;
    /** 单例 */
    public static get instance(): PGameEndMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameEndMediator();
            this.m_instance._classDefine = FGUI_PGameEnd;
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