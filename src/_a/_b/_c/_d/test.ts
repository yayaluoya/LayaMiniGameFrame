import RootDebug from "src/aTGame/Debug/RootDebug";

/**
 * 自定义调试
 */
export default class newTest extends RootDebug {
    private static m_instance: newTest;
    /** 单例 */
    public static get instance(): newTest {
        if (!this.m_instance) {
            this.m_instance = new newTest();
        }
        //
        return this.m_instance;
    }

    //
    protected _name: string = 'Custom';
}