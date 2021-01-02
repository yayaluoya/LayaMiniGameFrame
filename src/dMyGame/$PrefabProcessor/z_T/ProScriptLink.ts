import BaseProScript from './scr/BaseProScript';
import { EProcessor } from '../c_Enum/EProcessor';
/**
 * 脚本和加工者沟通的类
 */
export default class ProScriptLink {
    //加工者类型
    private m_proTypeof: EProcessor;

    /**
     * 初始化
     * @param _plantTypeof 加工者类型
     */
    public constructor(_plantTypeof: EProcessor) {
        this.m_proTypeof = _plantTypeof;
    }

    /** 获取加工者类型 */
    public get proTypeof(): EProcessor {
        return this.m_proTypeof;
    }


    /**
     * 给一个预制体添加脚本链接
     * @param _o 该预制体
     * @param _com 需要添加的脚本
     * @param _data 须有添加的数据
     */
    protected addScript<Com extends BaseProScript<ProScriptLink, any>>(_o: Laya.Sprite3D, _com: any, _data?: any): Com {
        let _scr: Com = _o.addComponent(_com) as Com;
        //设置该脚本的加工者
        _scr.setPro(this);
        //设置该脚本的标识数据
        _scr.setData(_data);
        //
        return _scr;
    }
}