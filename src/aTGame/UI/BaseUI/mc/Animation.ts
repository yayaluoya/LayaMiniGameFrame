import McMv from "./McMv";
import CommomMcUtils from './CommomMcUtils';
import { MovieClip } from './MovieClip';
/**
 * 动画类
 */
export default class Animation {
    private _x: number;
    private _y: number;
    private _scaleX: number;
    private _scaleY: number;
    private _mcMv: McMv;
    private _mcPackName: string;
    private _parent: fgui.GComponent;
    private _index: number;
    private _visible: boolean;
    private _recovered: boolean;

    private _playing: boolean;
    private _once: boolean;
    private _touchEnable: boolean;
    private _mcCpCallBack: Laya.Handler;
    private _onceHandler: Laya.Handler;
    private _frame: number;
    private _speed: number;

    private parentAtChild() {
        if (this._parent && this._mcMv) {
            if (this._index != null)
                this._parent.addChildAt(this._mcMv, this._index);
            else
                this._parent.addChild(this._mcMv);
        }
    }

    private initData() {
        this._visible = true;
        this._recovered = false;
        this._once = true;
        this._playing = false;
        this._touchEnable = false;
        this._frame = 0;
        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._speed = null;
    }

    private playOnceOrEver(value: boolean, onceHandler?: Laya.Handler) {
        this._once = value;
        if (onceHandler && this._onceHandler != onceHandler) {
            this._onceHandler && this._onceHandler.recover();
            this._onceHandler = onceHandler;
        }
        if (this._mcMv) {
            let times = value ? 1 : 0;
            this._mcMv.setPlaySettings(0, -1, times, -1, this._onceHandler);
            this._onceHandler = null;
        }
    }

    //动画初始化完成后的 回调可控制实际动画（现有封装不满足需求的情况下）
    public mcComplateBack(callBack: Laya.Handler) {
        if (this._mcMv) {
            callBack && callBack.runWith(this._mcMv);
            return;
        }
        if (callBack && this._mcCpCallBack != callBack) {
            this._mcCpCallBack && this._mcCpCallBack.recover();
            this._mcCpCallBack = callBack;
        }
    }

    public initPackName(packName: string, parent: fgui.GComponent, index?: number) {
        this._mcPackName = packName;
        this._parent = parent;
        this._index = index;
        this.initData();
        this.parentAtChild();
    }

    public initMc(mc: McMv) {
        if (!this._recovered) {
            this._mcMv = mc;
            this._mcMv.visible = this._visible;
            this._mcMv.setXY(this._x, this._y);
            this._mcMv.setScale(this._scaleX, this._scaleY);
            this.playOnceOrEver(this._once, this._onceHandler);
            this._speed && (this._mcMv['_movieClip'].interval = 150 / this._speed);
            this._mcMv.touchable = this._touchEnable;
            this._mcMv.playing = this._playing;
            this._mcCpCallBack && this._mcCpCallBack.runWith(this._mcMv);
            this._mcCpCallBack = null;
            this.parentAtChild();
        }
        else {
            mc.dispose();
        }
    }

    public set frame(value: number) {
        this._frame = value;
        if (this._mcMv) {
            this._mcMv.frame = this._frame;
        }
    }

    //设置为  一直播放  （类型不改变情况下 只需设置一次）
    public playEver() {
        if (this._once) {
            this.playOnceOrEver(false);
        }
        this.playing = true;
    }

    /**
     * 播放一次   
     * @param onceHandler 播放一次回调
     * @param coverLast 覆盖上一次播放一次
     */
    public playOnce(onceHandler?: Laya.Handler, coverLast: boolean = false) {
        if (coverLast || !this.playing || (this.playing && !this._once)) {
            this.playOnceOrEver(true, onceHandler);
        }
        this.playing = true;
    }

    public set touchEnable(value: boolean) {
        this._touchEnable = value;
        if (this._mcMv) {
            this._mcMv.touchable = value;
        }
    }

    public set speed(value: number) {
        this._speed = value;
        if (this._mcMv) {
            this._mcMv['_movieClip'].interval = 150 / this._speed;
        }
    }

    public get speed() {
        return this._speed;
    }

    public setXY(x: number, y: number) {
        if (this._mcMv) {
            this._mcMv.setXY(x, y);
        }
        this._x = x;
        this._y = y;
    }

    public setScale(scaleX: number, scaleY: number) {
        if (this._mcMv) {
            this._mcMv.setScale(scaleX, scaleY);
        }
        this._scaleX = scaleX;
        this._scaleY = scaleY;
    }

    public set visible(visible: boolean) {
        this._visible = visible;
        if (this._mcMv) {
            this._mcMv.visible = visible;
        }
    }

    public set playing(value: boolean) {
        if (this._mcMv) {
            this._mcMv.playing = value;
        }
        this._playing = value;
    }

    public get recovered() { //是否回收
        return this._recovered;
    }

    public get mcMv() {
        return this._mcMv;
    }

    public dispose() {
        this._mcMv && Laya.Tween.clearAll(this._mcMv);
        this._mcMv ? this._mcMv.dispose() : CommomMcUtils.clearMcTimesByType(this._mcPackName);
        this._mcMv = null;
        this._onceHandler && this._onceHandler.recover();
        this._onceHandler = null;
        this._recovered = true;
        this._frame = 0;
        this._playing = false;
        this._mcCpCallBack && this._mcCpCallBack.recover();
        this._mcCpCallBack = null;
        this._parent = null;
        this._mcPackName = null;
        Laya.Pool.recover('animation', this);
    }
}

export class AniManager {
    private _animationName: string = 'animation';

    private constructor() { }
    private static _instance: AniManager = null;
    static get instance(): AniManager {
        return AniManager._instance || (AniManager._instance = new AniManager());
    }

    /**
     * 创建一个动画  可以控制Animation动画
     * 优点：得到一个可控制对象
     * @param mcId  动画ID
     * @param parent 
     * @param index 位置
     */
    creatAnimation(mcId: string, parent: fgui.GComponent, index?: number): Animation {
        let animation = Laya.Pool.getItemByClass(this._animationName, Animation) as Animation;
        animation.initPackName(mcId, parent, index);
        MovieClip.getMcByType(mcId, Laya.Handler.create(this, (mv: McMv) => {
            if (!mv) return;
            let point = MovieClip.handNum[mcId];
            if (point == null || point <= 0 || parent.displayObject.destroyed || animation.recovered) {//parent dispose的时候已经清除一次引用
                return mv.dispose(false);
            }
            animation.initMc(mv);
        }), McMv);
        return animation;
    }


    /**
     * 普通的播放特效 UI层面
     * 优点：方便直接使用Id播放特效  缺点：不能控制实际mc的生命周期  长期在界面上的动效
     * 移除方法 使用MovieClip.clearAllMcByType() 或 MovieClip.clearMcTimesByType();
     * @param efId 动画ID
     * @param x 
     * @param y 
     * @param once 
     * @param parent 
     * @param chilidIndex 在父的位置 
     * @param scale 
     * @param onceCallBack 播放一次的回调
     * @param callBackMc 会在动画初始化完成传回动画——注意异步
     */
    playEFByID(efId: string, x: number, y: number, once: boolean, parent: fgui.GComponent,
        chilidIndex: number = -1, scale: number = 1, onceCallBack?: Laya.Handler, callBackMc?: Laya.Handler) {
        MovieClip.getMcByType(efId, Laya.Handler.create(this, (mv: McMv) => {
            if (!mv) return;
            let point = MovieClip.handNum[efId];
            if (point == null || point <= 0 || parent.displayObject.destroyed) {//parent dispose的时候已经清除一次引用
                return mv.dispose(false);
            }
            if (chilidIndex < 0)
                parent.addChild(mv);
            else
                parent.addChildAt(mv, chilidIndex);
            mv.setXY(x, y);
            mv.setScale(scale, scale);
            callBackMc ? callBackMc.runWith(mv) : null;
            callBackMc = null;
            if (once)
                mv.playOnce(onceCallBack, true);
            else {
                onceCallBack && onceCallBack.recover();
                mv.setPlaySettings(0, -1, 0, -1);
            }
        }), McMv);
    }
}