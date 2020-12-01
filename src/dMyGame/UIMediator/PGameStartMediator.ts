import BaseUIMediator from '../../aTGame/UI/FGUI/BaseUIMediator';
import FGUI_PGameStart from '../../FGUI/GameMain/FGUI_PGameStart';
/**
 * 游戏开始页面调度者
 */
export default class PGameStartMediator extends BaseUIMediator<FGUI_PGameStart>{
    private static m_instance: PGameStartMediator;
    /** 单例 */
    public static get instance(): PGameStartMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameStartMediator();
            this.m_instance._classDefine = FGUI_PGameStart;
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