/**
 * laya工具
 */
export default class LayaUtils {
    /**delta
     * 获取帧率
     */
    public static get frameRate(): number {
        return 1000 / this.deltaTime;
    }

    /**
     * 获取每一帧的时间。毫秒级
     * 很卡的时候可能会很大
     */
    public static get deltaTime(): number {
        return Laya.timer.delta;
    }

    /**
     * 获取每一帧的时间，秒级
     * 很卡的时候可能会很大
     */
    public static get deltaTimeSec(): number {
        return Laya.timer.delta / 1000;
    }

    /**
     * 获取当前帧的缩放值
     */
    public static get deltaTimeScale(): number {
        return Math.min(60, Laya.timer.delta) / 60;
    }
}