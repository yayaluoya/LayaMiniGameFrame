import PlatformManager from "../../../aTGame/Platform/PlatformManager";
import BaseUIMediator from "../../../aTGame/UI/FGUI/BaseUIMediator";
import FGUI_PGameTestPlatform from "../../../FGUI/GameMain/FGUI_PGameTestPlatform";
import { EUI } from "../../Enum/EUI";
import UIManagerProxy from "../../Manager/Proxy/UIManagerProxy";
/**
 * 游戏测试页面调度者
 */
export default class PGameTestPlatformMediator extends BaseUIMediator<FGUI_PGameTestPlatform> {
    private static m_instance: PGameTestPlatformMediator;
    /** 单例 */
    public static get instance(): PGameTestPlatformMediator {
        if (!this.m_instance) {
            this.m_instance = new PGameTestPlatformMediator();
            this.m_instance._classDefine = FGUI_PGameTestPlatform;
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //显示时的生命周期函数
    protected _OnShow() {
        this.ui.m_bg.onClick(this, this.close);
        this.ui.m_lookVAd.onClick(this, this.lookVAd);
        this.ui.m_showToast.onClick(this, this.showToast);
        this.ui.m_share.onClick(this, this.share);
    }

    //看广告
    private lookVAd() {
        console.log('看广告测试');
        //广告测试
        PlatformManager.PlatformInstance.ShowRewardVideoAdAsync().then((ifLook: boolean) => {
            console.log('看广告完成测试', ifLook);
        });
    }

    //显示消息
    private showToast() {
        console.log('显示消息测试');
        //显示消息测试
        PlatformManager.PlatformInstance.ShowToast('显示消息测试');
    }

    //分享
    private share() {
        console.log('分享测试');
        //分享测试
        PlatformManager.PlatformInstance.ShareAppMessage({
            shareId: undefined,
            shareImg: undefined,
            sharePath: undefined,
            shareTitle: '分享消息',
        }, Laya.Handler.create(this, () => {
            console.log('分享成功');
        }), Laya.Handler.create(this, () => {
            console.log('分享失败！');
        }));
    }

    //关闭
    private close() {
        UIManagerProxy.instance.setUIState([
            { typeIndex: EUI.TestPlatform, state: false },
        ], false);
    }

    //隐藏时的生命周期函数
    protected _OnHide() { }
}