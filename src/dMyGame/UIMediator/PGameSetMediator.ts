import BaseUIMediator from '../../aTGame/UI/FGUI/BaseUIMediator';
import { EUILayer } from '../../aTGame/UI/FGUI/EUILayer';
import FGUI_PGameSet from '../../FGUI/GameMain/FGUI_PGameSet';
/**
 * 游戏设置页面调度者
 */
export default class PGameSetMediator extends BaseUIMediator<FGUI_PGameSet>{
    private static m_instance: PGameSetMediator;
    /** 单例 */
    public static get instance(): PGameSetMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameSetMediator();
            this.m_instance._classDefine = FGUI_PGameSet;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //设置层级
    protected _layer: EUILayer = EUILayer.Set;//设置层

    //显示时的生命周期函数
    protected _OnShow() {
        //
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}