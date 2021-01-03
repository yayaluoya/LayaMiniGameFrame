import ConsoleEx from "../Console/ConsoleEx";
import RootTest from "./RootTest";

/**
 * 打印测试
 */
export default class ConsoleTest extends RootTest {
    // 打印字符串
    private _consoleExStr: string = '输出测试';
    //开始测试
    public startTest() {
        //
        console.log('->开启测试<-');
        //
        console.log(...ConsoleEx.packLog(this._consoleExStr));
        console.warn(...ConsoleEx.packWarn(this._consoleExStr));
        console.error(...ConsoleEx.packError(this._consoleExStr));
    }
}