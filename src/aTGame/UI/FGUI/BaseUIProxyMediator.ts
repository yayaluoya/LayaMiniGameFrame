import BaseUIMediator from "./BaseUIMediator";

/**
 * 基类UI代理调度者
 * 当一个页面UI种类过多时，可以通过继承这个类把不同的UI功能分出来
 */
export default class BaseUIProxyMediator<UI extends fgui.GComponent, Mediator extends BaseUIMediator<fgui.GComponent>> {
    private m_mediator: Mediator;
    private m_ui: UI;

    /**
     * 设置代理
     * @param _med 代理的该UI的调度者
     * @param _ui 代理的UI
     */
    public setProxy(_med: Mediator, _ui: UI) {
        this.m_mediator = _med;
        this.m_ui = _ui;
        //
        this._start();
    }

    /**
     * 结束代理
     */
    public endProxy() {
        this._end();
    }

    /** 开始代理 继承使用 */
    protected _start() { }

    /** 结束代理 继承使用*/
    protected _end() { }
}