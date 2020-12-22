import { ESpecialUIIndex } from "./ESpecialUIIndex";
import { EUILayer } from "./EUILayer";
import FGuiData from "./FGuiData";
import FGuiRootManager from "./FGuiRootManager";
import IUIClass from './UITool';

/**
 * UI调度者基类(用来控制UI界面)
 * 说明：
 * 单页面一定要单例，且可以通过管理器调用，多个就不行了
 * 在显示或者隐藏回调中不要使用UI状态管理器设置某个UI的状态
 * 不主动打开当前页面无关的页面，如果实在要打开就发送事件通过UI管理器打开
 * 不主动调用Show，Hide方法显示和隐藏其他UI，需要就通过UI状态管理器打开和关闭
 * 可以自己调用自己的Show，Hide方法，但是不能就再UI管理器中打开了
 * 尽量不主动监听一些与页面无关的UI事件,可以自由发出事件
 * 附属UI会在自身UI显示时一起显示，隐藏时一起隐藏， 
 */
export default class BaseUIMediator<T extends fgui.GComponent> {
    /** 当前ui实例 */
    public get ui(): T {
        return this._ui;
    }
    protected _ui: T;

    //唯一序号
    protected m_serialNumber: number;

    /** 获取唯一序号 */
    public get serialNumber(): number {
        return this.m_serialNumber;
    }

    //唯一键值
    protected m_keyId: string;

    /** UI类型，必须初始化时设置 */
    protected _classDefine: IUIClass;
    /** UI层级类型，必须在初始化时设置 */
    protected _layer: EUILayer = EUILayer.Panel;

    /** ui层级 */
    public get layer(): EUILayer {
        return this._layer;
    }

    /** fgui数据 */
    protected get _fguiData(): FGuiData {
        return new FGuiData;
    }

    // 附属UI

    /** 是否属于附属UI调度者 */
    protected _ifBelongUIMediator: boolean = false;

    /** 获取是否属于附属UI调度者 */
    public get ifBelongUIMediator(): boolean {
        return this._ifBelongUIMediator;
    }

    /** 属于该UI之下的UI调度者列表 */
    protected _belongDownUIMediator: BaseUIMediator<fgui.GComponent>[] = [];

    /** 获取下层的附属UI */
    public get belongDownUIMediator(): BaseUIMediator<fgui.GComponent>[] {
        return this._belongDownUIMediator;
    }

    /** 属于该UI之下的UI调度者列表 */
    protected _belongUpUIMediator: BaseUIMediator<fgui.GComponent>[] = [];

    /** 获取上层的附属UI */
    public get belongUpUIMediator(): BaseUIMediator<fgui.GComponent>[] {
        return this._belongUpUIMediator;
    }

    //

    /** 是否显示 */
    protected _isShow: boolean = false;

    /** 是否显示 */
    public get isShow(): boolean {
        return this._isShow;
    }
    /** 是否删除 */
    public get isDispose(): boolean {
        return this.ui.isDisposed;
    }

    /** 设置keyId */
    public set keyId(_s: string) {
        this.m_keyId = _s;
    }
    /** 获取keyId */
    public get keyId(): string {
        return this.m_keyId;
    }
    //
    constructor() {
        //设置一个唯一的序号
        this.m_serialNumber = BaseUIMediatorGlobalSerialNumber.GlobalSerialNumber;
    }

    //设置ui到最顶层
    protected setUIToTopShow() {
        //先判断是否存在ui
        if (this._ui) {
            FGuiRootManager.setUIToTopShow(this._ui, this._layer);
        }
    }

    /**
     * 显示UI
     */
    public Show() {
        //判断是否已经显示过了
        if (this._isShow) {
            //直接设置层级
            this.setUIToTopShow();
            return;
        }
        //显示前回调
        this.OnshowBefore();
        //
        this._isShow = true;
        //判断是不是真的删除了这个UI(为null或者被删除)
        if (!this._ui || (this._ui && this._ui.isDisposed)) {
            //添加ui
            this._ui = FGuiRootManager.AddUI(this._classDefine, this._fguiData, this._layer) as T;
            //判断是否是单页面
            if (this._layer == EUILayer.OneUI) {
                FGuiRootManager.oneUIs.push(this);
            }
        } else {
            this.ui.visible = true;
        }
        //设置该ui层级为最高层
        this.setUIToTopShow();
        //显示结束回调
        this._OnShow();
        //播放动画
        if (this._ui[ESpecialUIIndex.anim_enter]) {
            let anim = this._ui[ESpecialUIIndex.anim_enter] as fgui.Transition;
            anim.play(Laya.Handler.create(this, this._CallEnterAnimEnd));
        } else {
            //
            this.OnEnterAnimEnd();
        }
    }

    //播放动画完成
    private _CallEnterAnimEnd() {
        this.OnEnterAnimEnd();
    }

    /**
     * 进入动画回调,使用时覆盖即可
     */
    protected OnEnterAnimEnd() { }

    /** 显示之前调用 */
    protected OnshowBefore() { }

    /** 显示之后调用 */
    protected _OnShow() { }

    /**
     * 隐藏
     * @param dispose 是否删除
     */
    public Hide(dispose: boolean = true) {
        if (this._ui == null) return;
        if (this._ui.isDisposed) return;
        if (!this._isShow) return;
        this._isShow = false;
        this.OnHideBefore();
        //播放动画
        if (this._ui[ESpecialUIIndex.anim_exit]) {
            let anim = this._ui[ESpecialUIIndex.anim_exit] as fgui.Transition;
            anim.play(Laya.Handler.create(this, this._DoHide, [dispose]));
        } else {
            this._DoHide(dispose);
        }
    }
    //隐藏之后
    private _DoHide(dispose: boolean) {
        //判断是否删除
        if (dispose) {
            this._ui.dispose();
        } else {
            this._ui.visible = false;
        }
        //
        this._OnHide();
    }

    /** 隐藏之前调用 */
    protected OnHideBefore() { }

    /** 隐藏之后调用 */
    protected _OnHide() { }
}

/**
 * 基类UI调度者序号管理
 */
class BaseUIMediatorGlobalSerialNumber {
    private static m_GlobalSerialNumber: number = 0;

    /** 获取一个全局的序号 */
    public static get GlobalSerialNumber(): number {
        this.m_GlobalSerialNumber++;
        return this.m_GlobalSerialNumber;
    }
}