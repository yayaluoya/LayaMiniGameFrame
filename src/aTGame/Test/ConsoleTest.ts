import ConsoleEx from "../Console/ConsoleEx";
import RootTest from "./RootTest";

/**
 * 打印测试
 */
export default class ConsoleTest extends RootTest {
    //开始测试
    protected startTest() {
        //
        console.log('->开启测试<-');
        //
        console.log(...ConsoleEx.packLog('输出测试'));
        console.log(...ConsoleEx.packWarn('输出测试'));
        console.log(...ConsoleEx.packError('输出测试'));
    }
}