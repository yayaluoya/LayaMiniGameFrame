import ConsoleEx from '../../Console/ConsoleEx';
import IUIClass from './UITool';
/**
 * 多UI调度者基类
 * 可以直接获取某个UI并进行管理
 */
export default class BaseUIMediators<T extends fgui.GComponent> {
    /** UI类型，必须初始化前设置 */
    protected _classDefine: IUIClass;

    //是否隐藏
    protected m_ifShow: boolean = false;;

    /** 当前ui实例 */
    public get ui(): T {
        return this._ui;
    }
    protected _ui: T;

    protected constructor() {
        this._classDefine = this.getClass();
        if (!this._classDefine) {
            console.error(...ConsoleEx.packError('没有设置UI类型'));
        }
        this._ui = this._classDefine.createInstance() as T;
    }

    /**
     * 获取UI类型
     */
    protected getClass(): IUIClass {
        return;
    }

    /**
     * 显示
     */
    public Show() {
        if (this.m_ifShow) { return; }
        this.m_ifShow = true;
        this.ui.visible = true;
        this._Show();
    }

    /**
     * 隐藏
     */
    public Hide() {
        if (!this.m_ifShow) { return; }
        this.m_ifShow = false;
        this.ui.visible = false;
        this._Hide();
    }

    /**
     * 显示回调
     */
    protected _Show() { }

    /**
     * 隐藏回调
     */
    protected _Hide() { }
}