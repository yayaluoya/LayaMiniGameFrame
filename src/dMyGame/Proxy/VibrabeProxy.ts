import PlatformManager from '../../aTGame/Platform/PlatformManager';
import GameDataProxy from '../GameData/GameDataProxy';
/**
 * 振动代理
 */
export default class VibrabeProxy {
    //
    private static m_instance: VibrabeProxy;
    /** 单例 */
    public static get instance(): VibrabeProxy {
        if (!this.m_instance) {
            this.m_instance = new VibrabeProxy();
        }
        return this.m_instance;
    }
    //
    private constructor() { }

    /**
     * 振动
     * @param _modle 振动模式
     */
    public vibrate(isLong: boolean) {
        if (!GameDataProxy.instance.saveData.ifOpenVibrate) return;
        //
        PlatformManager.PlatformInstance.device.Vibrate(isLong);
    }

    /**
     * 调用平台原震动
     * @param pattern 震动时间
     */
    public originalVibration(pattern: number | number[]) {
        if (!GameDataProxy.instance.saveData.ifOpenVibrate) return;
        //
    }
}