import { ECommonLeve } from '../../aTGame/Commom/CommonLeveEnum';
import RootDataProxyShell from '../../aTGame/Data/RootDataProxyShell';
import { EEventUI } from '../EventEnum/EEventUI';
import GameData from '../GameData/GameData';
import GameDataProxy from '../GameData/GameDataProxy';
import MesManager from '../Manager/MesManager';
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

    //游戏主数据
    private m_gameData: GameData;

    /** 游戏主数据 */
    public get gameData(): GameData {
        return this.m_gameData;
    }

    //初始化数据
    protected initData() {
        this.m_gameData = GameDataProxy.instance.saveData;
        //
    }

    /**
     * 初始化关卡数据
     * @param _maxCustoms 最大关卡数量
     */
    public initCustoms(_maxCustoms: number) {
        //化整
        _maxCustoms = Math.floor(_maxCustoms);
        //
        if (this.m_gameData.maxCustoms == _maxCustoms) { return; }
        //判断其他关卡数据是否超出了界限
        this.m_gameData.maxCustoms = _maxCustoms;
        if (this.m_gameData.maxCustomsRecord > _maxCustoms) {
            this.m_gameData.maxCustomsRecord = _maxCustoms;
        }
        if (this.m_gameData.onCustoms > _maxCustoms) {
            this.m_gameData.onCustoms = ECommonLeve.DefaultLeveId;
        }
    }

    /**
     * 判断是否是新手关卡
     */
    public ifNewHandCustoms(): boolean {
        return this.m_gameData.onCustoms == ECommonLeve.NewHandLeveId && this.m_gameData.maxCustomsRecord <= ECommonLeve.NewHandLeveId;
    }

    /**
     * 设置是否打开背景音乐
     * @param _b 状态
     */
    public setIfOpenBGM(_b: boolean) {
        this.m_gameData.ifOpenBgm = _b;
    }

    /**
     * 设置是否打开音效
     * @param _b 状态
     */
    public setIfOpenSound(_b: boolean) {
        this.m_gameData.ifOpenSound = _b;
    }

    /**
     * 设置是否打开振动
     * @param _b 状态
     */
    public setIfOpenVibrate(_b: boolean) {
        this.m_gameData.ifOpenVibrate = _b;
    }

    /**
     * 设置关卡
     * @param _number 增加关卡数量
     * @return 是否增加成功
     */
    public setCustoms(_number: number = 1): boolean {
        //化整
        _number = Math.floor(_number);
        //设置当前关卡
        let _sum: number = this.m_gameData.onCustoms + _number;
        let _win: boolean = false;
        if (_sum <= this.m_gameData.maxCustoms) {
            this.m_gameData.onCustoms = _sum;
            if (_sum > this.m_gameData.maxCustomsRecord) {
                this.m_gameData.maxCustomsRecord = _sum;
            }
            _win = true;
        } else {
            this.m_gameData.onCustoms = ECommonLeve.DefaultLeveId;
            _win = true;
        }
        //传出事件
        MesManager.instance.sendEvent(EEventUI.CustomsChange);
        //
        return _win;
    }

    /**
     * 返回默认的关卡
     */
    public getDefaultCustoms(): number {
        if (this.m_gameData.onCustoms > this.m_gameData.maxCustoms) {
            this.m_gameData.onCustoms = ECommonLeve.DefaultLeveId;
            //保存数据
        }
        return this.m_gameData.onCustoms;
    }

    /**
     * 返回需要预加载的关卡id
     */
    public getPreloadCustoms(): number {
        return this.getNextCustoms();
    }

    /**
     * 获取下一个关卡
     */
    public getNextCustoms(): number {
        let _customs: number = this.m_gameData.onCustoms + 1;
        if (_customs > this.m_gameData.maxCustoms) {
            _customs = ECommonLeve.DefaultLeveId;
        }
        //
        return _customs;
    }
}