import BaseUIMediator from "../../aTGame/UI/FGUI/BaseUIMediator";
import { EUILayer } from "../../aTGame/UI/FGUI/EUILayer";
import FGUI_PGameMain from "../../FGUI/GameMain/FGUI_PGameMain";

/**
 * 游戏主页面调度者
 */
export default class PGameMainMediator extends BaseUIMediator<FGUI_PGameMain> {
    private static m_instance: PGameMainMediator;
    /** 单例 */
    public static get instance(): PGameMainMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameMainMediator();
            this.m_instance._classDefine = FGUI_PGameMain;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //层级
    protected _layer: EUILayer = EUILayer.Main;

    //显示时的生命周期函数
    protected _OnShow() {
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}