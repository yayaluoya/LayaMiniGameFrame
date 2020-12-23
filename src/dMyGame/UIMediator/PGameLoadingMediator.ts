import BaseUIMediator from '../../aTGame/UI/FGUI/BaseUIMediator';
import { EUILayer } from '../../aTGame/UI/FGUI/EUILayer';
import { EEventGlobal } from '../EventEnum/EEventGlobal';
import FGUI_PGameLoading from '../../FGUI/GameMain/FGUI_PGameLoading';
import MesManager from '../Manager/MesManager';
/**
 * 游戏加载中页面调度者
 */
export default class PGameLoadingMediator extends BaseUIMediator<FGUI_PGameLoading>{
    private static m_instance: PGameLoadingMediator;
    /** 单例 */
    public static get instance(): PGameLoadingMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameLoadingMediator();
            this.m_instance._classDefine = FGUI_PGameLoading;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //层级
    protected _layer: EUILayer = EUILayer.Loading;//加载层

    //显示时的生命周期函数
    protected _OnShow() {
        MesManager.instance.onEvent(EEventGlobal.GameLoading, this, this.gameLoading);//游戏加载中
    }

    /**
     * 关卡加载中事件
     * @param _number 加载进度 
     */
    private gameLoading(_number: number) {
        //设置进度条进度
        this.ui.m_progress.value = _number;
    }

    //隐藏时的生命周期函数
    protected _OnHide() {
        //取消监听
        MesManager.instance.offEnent(EEventGlobal.GameLoading, this, this.gameLoading);
    }
}