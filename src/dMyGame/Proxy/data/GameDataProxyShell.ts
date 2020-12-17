import RootDataProxyShell from '../../../aTGame/Data/RootDataProxyShell';
import { EEventUI } from '../../EventEnum/EEventUI';
import GameDataProxy from '../../GameData/GameDataProxy';
import MesManager from '../../Manager/MesManager';
/**
 * 游戏数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GameDataProxyShell;
    /** 单例 */
    public static get instance(): GameDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GameDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    /**
     * 增加关卡
     * @param _number 增加关卡数量
     * @return 是否增加成功
    */
    public addCustoms(_number: number = 1): boolean {
        let _result = GameDataProxy.addCustoms(_number);
        //传出事件
        MesManager.instance.eventUI(EEventUI.CustomsChange);
        return _result;
    }
}