import RootDebug from "./RootDebug";

/**
 * 数据调试类
 */
export default class DataDebug extends RootDebug {
    protected _name: string = 'Data';

    //单例
    private static _instance: DataDebug;
    /** 单例对象 */
    public static get instance(): DataDebug {
        if (this._instance) {
            return this._instance;
        } else {
            this._instance = new DataDebug();
            return this._instance;
        }
    }
    //
    private constructor() { super(); }

    //开启调试
    protected _startDebug() {
        console.log('开启数据调试');
    }
}