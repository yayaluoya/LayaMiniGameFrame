/**
 * 普通工具类
 */
export class TUtils {

    /**
     * 缓存文件
     * @param url 文件地址
     */
    public static CachFile(url: string) {
        if (!Laya.Browser.onWeiXin) return;
        var fullUrl = Laya.URL.formatURL(url);
        var fileInfo = Laya.MiniAdpter.getFileInfo(fullUrl);
        if (fileInfo == null) {
            Laya.MiniAdpter.downLoadFile(fullUrl);
        }
    }

    /**
     * 下载文件
     * @param urls 文件地址 
     * @param complete 完成时回调
     * @param progress 下载进度
     */
    public static DownLoadFiles(urls: string[], complete?: Laya.Handler, progress?: Laya.Handler) {
        Laya.loader.create(urls, complete, progress, null, null, null, 1, true);
    }

    /**
    * 时间转换
    */
    static ONE_YEAR: number = 60 * 60 * 24 * 365;
    static ONE_DAY: number = 60 * 60 * 24;
    public static makeTimeLeftString(time: number, separator: string = ":", flag: Boolean = false): string {
        var ret: string = "";
        var hour: number;
        if (time <= 0) {
            ret = ret + "00:00";
            return ret;
        }
        if (time > TUtils.ONE_YEAR) {
            ret = "大于一年";
            return ret;
        }
        if (flag) {
            if (time > TUtils.ONE_DAY) {
                var day: number = Math.floor(time / TUtils.ONE_DAY);
                ret = day + "天";
            } else if (time >= 3600) {
                hour = Math.floor(time / 3600);
                ret = hour + "时";
            } else {
                var minute: number = Math.floor(time / 60);
                if (minute < 10) ret += "0";
                ret += minute.toString() + separator;
                var second: number = time % 60;
                if (second < 10) ret += "0";
                ret += second.toString();
            }
            return ret;
        }
        if (time > TUtils.ONE_DAY) {
            var day: number = Math.floor(time / TUtils.ONE_DAY);
            ret = day + "天";
            time = time - day * TUtils.ONE_DAY;
            if (flag) {
                hour = Math.floor(time / 3600);
                if (hour > 0) {
                    ret += hour + "时";
                }
                return ret;
            }
        }
        if (time <= 0) {
            ret = ret + "00:00";
            return ret;
        }
        ret = '';
        hour = Math.floor(time / 3600);
        if (hour > 0) {
            if (hour < 10) {
                ret += "0" + hour.toString() + separator;
            } else {
                ret += hour.toString() + separator;
            }
        }
        var minute: number = Math.floor((time - hour * 3600) / 60);
        if ((minute > 0) || (hour > 0)) {
            if (minute < 10) ret += "0";
            ret += minute.toString() + separator;
        } else {
            ret += "00" + separator;
        }
        var second: number = time % 60;
        if (second < 10) ret += "0";
        ret += second.toString();
        return ret;
    }

    /**
    * 获取当前天数
    */
    public static GetCurrentDayCount(tick: number) {
        let dayCount = Math.floor(tick / 1000 / 60 / 60 / 24);
        return dayCount;
    }

    /**
     * 获取一个范围内随机整数
     * @param min 最小值
     * @param max 最大值
     */
    public static randomRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    //
    public static timeScale = 1;
    private static _recordFrame: number = 0;
    private static _deltaTime: number = 30;
    private static _deltaTimeSec: number = 0.016;

    /**
     * 获取每一帧的时间。毫秒级
     */
    public static get deltaTime(): number {
        if (this._recordFrame != Laya.timer.currFrame) {
            this._deltaTime = Math.min(Laya.timer.delta, 100);
            this._deltaTimeSec = this._deltaTime * 0.001;
            this._recordFrame = Laya.timer.currFrame;
        }
        return this._deltaTime * this.timeScale;
    }

    /**
     * 获取每一帧的时间，秒级
     */
    public static get deltaTimeSec(): number {
        if (this._recordFrame != Laya.timer.currFrame) {
            this._deltaTime = Math.min(Laya.timer.delta, 100);
            this._deltaTimeSec = this._deltaTime * 0.001;
            this._recordFrame = Laya.timer.currFrame;
        }
        var d: Laya.TrailSprite3D;
        return this._deltaTimeSec * this.timeScale;
    }

    /**
     * 克隆一个对象
     * @param _O 该对象
     */
    public static cloneObject<T>(_data: T): T {
        return JSON.parse(JSON.stringify(_data)) as T;
    }
}