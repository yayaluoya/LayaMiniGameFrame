import BasePrefabPro from './BasePrefabPro';
/**
 * 加工者周边脚本
 */
export default class ProRim<Pro extends BasePrefabPro>{
    //加工者
    private m_pro: Pro;

    /** 获取加工者 */
    public get pro(): Pro {
        return this.m_pro;
    }

    /**
     * 初始化
     * @param _pro 加工者 
     */
    public _initPro(_pro: Pro) {
        this.m_pro = _pro;
        this.init();
    }

    //init生命周期函数
    protected init() { }
}