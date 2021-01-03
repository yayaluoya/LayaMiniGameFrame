import ConsoleEx from '../../../Console/ConsoleEx';
import RootClassProxy from '../../../Root/RootClassProxy';
/**
 * MovieClipProxy类代理
 */
export default class MovieClipProxy extends RootClassProxy {
    //
    private static m_mcArr: object = {};
    private static m_handNum: object = {};

    public static get mcArr() {
        return this.m_mcArr;
    }
    public static get handNum() {
        return this.m_handNum;
    }

    /**
     * 设置代理数据
     * @param _mcArr 
     * @param _handNum 
     */
    public static SetProxy(_mcArr: object, _handNum: object) {
        if (this.m_ifSetProxy) {
            console.error(...ConsoleEx.packError('已经设置过代理了！'));
            return;
        }
        this.m_ifSetProxy = true;
        //
        this.m_mcArr = _mcArr;
        this.m_handNum = _mcArr;
    }
}