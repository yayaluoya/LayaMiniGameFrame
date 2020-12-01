import BaseUIMediator from '../../aTGame/UI/FGUI/BaseUIMediator';
import FGUI_PGamePlay from '../../FGUI/GameMain/FGUI_PGamePlay';
/**
 * 游戏玩耍页面调度者
 */
export default class PGamePlayMediator extends BaseUIMediator<FGUI_PGamePlay>{
    private static m_instance: PGamePlayMediator;
    /** 单例 */
    public static get instance(): PGamePlayMediator {
        if (!this.m_instance) {
            this.m_instance = new PGamePlayMediator();
            this.m_instance._classDefine = FGUI_PGamePlay;
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