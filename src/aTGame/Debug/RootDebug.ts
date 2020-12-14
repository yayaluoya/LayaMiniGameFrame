import ConsoleEx from "../Console/ConsoleEx";

/**
 * 根调试类，所有调试类必须由此继承
 */
export default class RootDebug {
    /** 前缀 */
    public static readonly prefix: string = '$Debug';

    /** 名字，用 Window[前缀 + _name] 访问 */
    protected _name: string;

    /**
     * 添加一个调试对象
     * @param _key key
     * @param _item 该对象
     */
    public static addItem(_key: string, _item: any) {
        let _rootKey: string = this.prefix + ':' + _key;
        if (this[_rootKey]) {
            console.log(...ConsoleEx.packWarn('该调试对象已经存在了，将会被第二个覆盖', _rootKey));
        }
        this[_rootKey] = _item;
    }

    /** 开启调试 */
    public startDebug() {
        //注入到全局中
        if (window[RootDebug.prefix][this._name]) {
            console.log(...ConsoleEx.packWarn('有一个调试对象名字重名了，将会被第二个覆盖', this._name));
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
        if (this[_key]) {
            console.log(...ConsoleEx.packWarn('该调试对象已经存在了，将会被第二个覆盖', this._name, '-', _key));
        }
        this[_key] = _item;
    }

    /** 开启调试回调 */
    protected _startDebug() { }
}

//注册全局调试对象
window[RootDebug.prefix] = {};