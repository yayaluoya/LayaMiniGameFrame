import ConsoleTest from "./ConsoleTest";
import RootTest from "./RootTest";

/**
 * 测试类入口
 */
export default class MainTest extends RootTest {
    //开始测试
    public startTest() {
        //开始测试
        new ConsoleTest().startTest();
    }
}