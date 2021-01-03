import RootScript from './RootScript';
import ProScriptLink from '../ProScriptLink';
import ConsoleEx from '../../../../aTGame/Console/ConsoleEx';
/**
 * 基类加工者脚本（继承这个脚本的脚本可以和加工者之间保持链接）
 */
export default class BaseProScript<Pro extends ProScriptLink, Data> extends RootScript {
    //加工者
    private m_Pro: Pro;
    //数据
    private m_data: Data;

    /**
     * 当前脚本的加工者对象
     */
    public get pro(): Pro {
        if (this.m_Pro) {
            return this.m_Pro;
        } else {
            console.warn(...ConsoleEx.packWarn('->没有找到Pro!<-'));
        }
    }

    /**
     * 获取附带的数据
     */
    public get data(): Data {
        return this.m_data;
    }

    /**
     * 设置加工者
     * @param _Pro 加工者
     */
    public setPro(_Pro: Pro) {
        this.m_Pro = _Pro;
    }

    /**
     * 设置数据
     * @param _data 数据
     */
    public setData(_data: Data) {
        this.m_data = _data;
    }
}