/**
 * 异步等待类
 */
export default class Awaiters {

    /**
     * 等待2帧
     */
    public static NextFrame(): Promise<void> {
        // 一帧有可能刚好当帧执行,这里跳两帧
        return this.Frames(2);
    }

    /**
     * 等待一定帧数
     * @param num 帧数
     */
    public static Frames(num: number): Promise<void> {
        return new Promise(function (resolve) {
            Laya.timer.frameOnce(num, null, () => {
                resolve();
            })
        });
    }

    /**
     * 等待多少秒
     * @param num 多少秒
     */
    public static Seconds(num: number): Promise<void> {
        return new Promise(function (resolve) {
            Laya.timer.once(num * 1000, null, () => {
                resolve();
            })
        });
    }
}