import MainConfig from "../../bTGameConfig/MainConfig";
import MainGameConfig from "../../bTGameConfig/MainGameConfig";
import ConsoleEx from "../Console/ConsoleEx";
import DebugWindowCommunication from "./DebugWindowCommunication";
import debugIndex from "./html/debugHTML";
import { EDebugWindow } from "./mes/EDebugWindow";

/**
 * 根调试类，所有调试类必须由此继承
 */
export default class RootDebug {
    /** 前缀 */
    public static readonly prefix: string = '$Debug';

    /** 名字，用 Window[前缀 + _name] 访问 */
    protected _name: string;

    /** 是否开始调试 */
    private _ifStart: boolean = false;

    /**
     * 添加一个调试对象
     * @param _key key
     * @param _item 该对象
     */
    public static addItem(_key: string, _item: any) {
        let _rootKey: string = this.prefix + ':' + _key;
        if (this[_rootKey]) {
            console.warn(...ConsoleEx.packWarn('该调试对象已经存在了，将会被第二个覆盖', _rootKey));
        }
        this[_rootKey] = _item;
    }

    /** 开启调试 */
    public startDebug() {
        this._ifStart = true;
        //注入到全局中
        if (window[RootDebug.prefix][this._name]) {
            console.warn(...ConsoleEx.packWarn('有一个调试对象名字重名了，将会被第二个覆盖', this._name));
        }
        window[RootDebug.prefix][this._name] = this;
        //
        this._startDebug();
    }

    /**
     * 添加一个调试对象
     * @param _key key
     * @param _item 该对象
     */
    public addItem(_key: string, _item: any) {
        //判断是否开启了调试
        if (!this._ifStart) { return; }
        //
        if (this[_key]) {
            console.warn(...ConsoleEx.packWarn('该调试对象已经存在了，将会被第二个覆盖', this._name, '-', _key));
        }
        this[_key] = _item;
    }

    /** 开启调试回调 */
    protected _startDebug() { }

    /**
     * 打开一个新窗口调试
     */
    public static openWindowDebug() {
        let _win: Window = window.open('', MainConfig.GameName);
        //把新窗口注入到当前win
        window[EDebugWindow.DebugWindow] = _win;
        //写入首页
        let _url: string = window.location.href.replace('bin/index.html', 'DebugWindow/dist/');
        _win.document.getElementsByTagName('html')[0].innerHTML = debugIndex.replace(/"\//g, '"' + _url);
        //
        console.warn(...ConsoleEx.packWarn('打开调式窗口。'));
        //提取JavaScript标签并且重新添加
        let _HTMLCollection: any = _win.document.getElementsByTagName('body')[0].getElementsByTagName('script');
        //注入消息沟通对象
        _win[EDebugWindow.Mes] = new DebugWindowCommunication();
        //
        let _scriptSrc: string[] = [];
        for (let item of _HTMLCollection) {
            _scriptSrc.push(item.src);
        };
        _scriptSrc.forEach((item) => {
            let script = _win.document.createElement("script");
            script.async = false;
            script.src = item;
            _win.document.body.appendChild(script);
        });
    }

    /**
     * 向调试页面发送一个消息
     */
    public static fendDebugWindow(_mes: string, ..._data: any[]) {
        (window[EDebugWindow.DebugWindow][EDebugWindow.Mes] as DebugWindowCommunication).eventMes(_mes, ..._data);
    }
}

//注册全局调试对象
window[RootDebug.prefix] = {};

//判断是否开启了调试模式
if (MainGameConfig.ifDebug) {
    console.warn(...ConsoleEx.packWarn('开启调试模式，通过', RootDebug.prefix, '访问'));
}