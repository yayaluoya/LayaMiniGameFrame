import RootDebug from "../aTGame/Debug/RootDebug";
import CustomDebug from "./CustomDebug";
/**
 * 我的调试类
 */
export default class MyMainDebug extends RootDebug {
    protected _name: string = 'MyMainDebug';

    //开始调试
    protected _startDebug() {
        //开启自定义调试
        CustomDebug.instance.startDebug();
    }
}