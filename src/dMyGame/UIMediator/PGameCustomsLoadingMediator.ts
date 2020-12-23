import BaseUIMediator from '../../aTGame/UI/FGUI/BaseUIMediator';
import { EUILayer } from '../../aTGame/UI/FGUI/EUILayer';
import UIManagerProxy from '../Manager/Proxy/UIManagerProxy';
import { EUI } from '../Enum/EUI';
import FGUI_PGameCustomsLoading from '../../FGUI/GameMain/FGUI_PGameCustomsLoading';
import { EEventUI } from '../EventEnum/EEventUI';
import MesManager from '../Manager/MesManager';
/**
 * 游戏关卡加载中页面调度者
 */
export default class PGameCustomsLoadingMediator extends BaseUIMediator<FGUI_PGameCustomsLoading>{
    private static m_instance: PGameCustomsLoadingMediator;
    /** 单例 */
    public static get instance(): PGameCustomsLoadingMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameCustomsLoadingMediator();
            this.m_instance._classDefine = FGUI_PGameCustomsLoading;
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
        //关卡加载中
        MesManager.instance.onEvent(EEventUI.SceneGameCustomsLoading, this, this.CustomsLoading);
    }

    /**
     * 关卡加载中事件
     * @param _number 加载进度 
     */
    private CustomsLoading(_number: number) {
        //设置进度条进度
        this.ui.m_progress.value = _number;
        //加载完成时
        if (_number == 100) {
            UIManagerProxy.instance.setUIState([
                { typeIndex: EUI.CustomsLoading, state: false },
            ], false);
        }
    }

    //隐藏时的生命周期函数
    protected _OnHide() {
        //取消监听
        MesManager.instance.offEnent(EEventUI.SceneGameCustomsLoading, this, this.CustomsLoading);
    }
}