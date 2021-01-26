import PlatformManager from '../../aTGame/Platform/PlatformManager';
import GameDataProxyShell from '../GameDataShell/GameDataProxyShell';
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
        if (!GameDataProxyShell.instance.gameData.ifOpenVibrate) return;
        //
        PlatformManager.PlatformInstance.device.Vibrate(isLong);
    }

    /**
     * 调用平台原震动
     * @param pattern 震动时间
     */
    public originalVibration(pattern: number | number[]) {
        if (!GameDataProxyShell.instance.gameData.ifOpenVibrate) return;
        //
    }
}