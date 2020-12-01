import McLoad from './McLoad';
import McMv from './McMv';
import MovieClipProxy from './MovieClipProxy';
/**
 * 动画裁剪类
 */
export class MovieClip {
    private static _mcArr: object = {};
    private static _handNum: object = {};

    public static get mcArr() {
        return this._mcArr;
    }
    public static get handNum() {
        return this._handNum;
    }

    /**
     * 动画尽量都从这里取出来 请操作拷贝的数据  默认锚点0.5 0.5
     * @param type 一般指的包名
     * @param callBack 回调new出的动画
     * @param userClass 绑定的类  McCom的子类
     */
    static getMcByType<T extends McMv>(type: string, complete: Laya.Handler, userClass: new () => T): McLoad {
        MovieClip._mcArr[type] || (MovieClip._mcArr[type] = new McLoad(type));
        (MovieClip._mcArr[type] as McLoad).getMcCom(complete, userClass);
        MovieClip._handNum[type] ? MovieClip._handNum[type]++ : MovieClip._handNum[type] = 1;
        return MovieClip._mcArr[type];
    }
}

// 设置数据代理
MovieClipProxy.SetProxy(MovieClip.mcArr, MovieClip.handNum);