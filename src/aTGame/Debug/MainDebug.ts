import DataDebug from "./DataDebug";
import EnvironmentDebug from "./EnvironmentDebug";
import RootDebug from "./RootDebug";

/**
 * 调试类入口
 */
export default class MainDebug extends RootDebug {
    protected _name: string = 'Main';

    /** 开启调试 */
    protected _startDebug() {
        console.log('开启主调试');
        //环境调试类
        EnvironmentDebug.instance.startDebug();
        //数据调试
        DataDebug.instance.startDebug();
    }
}