import BaseUIMediator from "./BaseUIMediator";

/**
 * 基类UI代理调度者
 * 当一个页面UI种类过多时，可以通过继承这个类把不同的UI功能分出来
 */
export default class BaseUIProxyMediator<UI extends fgui.GComponent, Mediator extends BaseUIMediator<fgui.GComponent>> {
    /** 是否开始代理 */
    protected m_ifProxy: boolean = false;

    /** 代理的调度者 */
    protected m_mediator: Mediator;

    /** 代理的UI */
    protected m_ui: UI;

    /** 是否开始代理 */
    public get ifProxy(): boolean {
        return this.m_ifProxy;
    }

    /**
     * 设置代理
     * @param _med 代理的该UI的调度者
     * @param _ui 代理的UI
     */
    public setProxy(_med: Mediator, _ui: UI) {
        this.m_ifProxy = true;
        this.m_mediator = _med;
        this.m_ui = _ui;
        //
        this._start();
    }

    /**
     * 结束代理
     */
    public endProxy() {
        this.m_ifProxy = false;
        this.m_mediator = null;
        this.m_ui = null;
        this._end();
    }

    /** 开始代理 继承使用 */
    protected _start() { }

    /** 结束代理 继承使用*/
    protected _end() { }
}