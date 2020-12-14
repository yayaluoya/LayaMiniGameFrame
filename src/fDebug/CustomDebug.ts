import RootDebug from "../aTGame/Debug/RootDebug";
/**
 * 自定义调试
 */
export default class CustomDebug extends RootDebug {
    private static m_instance: CustomDebug;
    /** 单例 */
    public static get instance(): CustomDebug {
        if (!this.m_instance) {
            this.m_instance = new CustomDebug();
        }
        //
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //
    protected _name: string = 'Custom';
}