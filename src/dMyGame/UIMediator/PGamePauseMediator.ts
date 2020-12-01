import BaseUIMediator from "../../aTGame/UI/FGUI/BaseUIMediator";
import { EUILayer } from "../../aTGame/UI/FGUI/EUILayer";
import FGUI_PGamePause from "../../FGUI/GameMain/FGUI_PGamePause";

/**
 * 游戏暂停页面调度者
 */
export default class PGamePauseMediator extends BaseUIMediator<FGUI_PGamePause>{
    private static m_instance: PGamePauseMediator;
    /** 单例 */
    public static get instance(): PGamePauseMediator {
        if (!this.m_instance) {
            this.m_instance = new PGamePauseMediator();
            this.m_instance._classDefine = FGUI_PGamePause;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //层级
    protected _layer: EUILayer = EUILayer.Pause;//暂停层

    //显示时的生命周期函数
    protected _OnShow() {
        //
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}