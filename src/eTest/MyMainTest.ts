import RootTest from "../aTGame/Test/RootTest";
import AsyncTest from "./AsyncTest";
import OIMODebug from "./OIMODebug";
/**
 * 我的测试类
 */
export default class MyMainTest extends RootTest {
    //开始测试
    protected startTest() {
        //
        new AsyncTest();
        new OIMODebug();
    }
}