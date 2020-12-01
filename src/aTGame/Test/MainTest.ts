import ConsoleEx from "../Console/ConsoleEx";

/**
 * 测试类入口
 */
export default class MainTest {
    //
    constructor() {
        console.log('->开启测试<-');
        //
        console.log(...ConsoleEx.packLog('输出测试'));
        console.log(...ConsoleEx.packWarn('输出测试'));
        console.log(...ConsoleEx.packError('输出测试'));
    }
}