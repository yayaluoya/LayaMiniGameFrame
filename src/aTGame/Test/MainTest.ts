import ConsoleTest from "./ConsoleTest";
import RootTest from "./RootTest";

/**
 * 测试类入口
 */
export default class MainTest extends RootTest {
    //开始测试
    protected startTest() {
        //打印测试
        new ConsoleTest();
    }
}