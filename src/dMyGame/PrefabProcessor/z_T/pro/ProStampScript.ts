import { EProcessor } from '../../c_Enum/EProcessor';
/**
 * 加工印记脚本，所有经过加工者加工过的精灵都有的脚本 (用来判断加工记录)
 */
export default class ProStampScript extends Laya.Script3D {
    //加工印记
    private m_proStamp: EProcessor[] = [];

    /**
     * 添加加工印记
     * @param _pro 加工者标识
     */
    public addProStamp(_pro: EProcessor) {
        if (this.m_proStamp.findIndex((item) => { return item == _pro }) == -1) {
            this.m_proStamp.push(_pro);
        }
    }

    /**
     * 获取加工印记列表
     */
    public get proStamp(): EProcessor[] {
        return this.m_proStamp;
    }

    /**
     * 判断是否被某个加工者加工过
     * @param _pro 某加工者标识
     */
    public ifAtPro(_pro: EProcessor): boolean {
        return this.m_proStamp.findIndex((item) => { return item == _pro }) != -1;
    }
}