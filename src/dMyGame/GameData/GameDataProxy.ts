import { ECommonLeve } from '../../aTGame/Commom/CommonLeveEnum';
import RootLocalStorageProxy from '../../aTGame/Data/RootLocalStorageProxy';
import GameData from './GameData';

/**
 * 数据保存类
 */
export default class GameDataProxy extends RootLocalStorageProxy<GameData>{
    //
    private static _instance: GameDataProxy;
    /** 单例 */
    public static get instance(): GameDataProxy {
        if (this._instance == null) {
            this._instance = new GameDataProxy();
        }
        //
        return this._instance;
    }

    /** 不允许外界实例化 */
    private constructor() {
        super();
    }

    /** 获取保存名称 */
    protected get _saveName(): string {
        return "->GameData<-";
    }

    /** 获取原始数据 */
    public static get rootData(): GameData {
        //
        return this._instance._saveData;
    }

    /**
     * 获取当前游戏数据的副本
     */
    public static get gameData(): GameData {
        //返回一个副本防止被修改
        return this._instance._saveData.clone();
    }

    // ** -------------------------------------------------------------------------------------- ** //

    /**
     * 初始化关卡数据
     * @param _maxCustoms 最大关卡数量
     */
    public static initCustoms(_maxCustoms: number) {
        //化整
        _maxCustoms = Math.floor(_maxCustoms);
        //
        if (this._instance._saveData.maxCustoms == _maxCustoms) { return; }
        //
        this._instance._saveData.maxCustoms = _maxCustoms;
        if (this._instance._saveData.onCustoms > _maxCustoms) {
            this._instance._saveData.onCustoms = _maxCustoms;
        }
        if (this._instance._saveData.maxCustomsRecord > _maxCustoms) {
            this._instance._saveData.maxCustomsRecord = _maxCustoms;
        }
        this.SaveToDisk();
    }

    /**
     * 判断是否是新手关卡
     */
    public static ifNewHandCustoms(): boolean {
        return this._instance._saveData.onCustoms == ECommonLeve.NewHandLeveId && this._instance._saveData.maxCustomsRecord <= ECommonLeve.NewHandLeveId;
    }

    /**
     * 设置是否打开背景音乐
     * @param _b 状态
     */
    public static setIfOpenBGM(_b: boolean) {
        this._instance._saveData.ifOpenBgm = _b;
        this.SaveToDisk();
    }

    /**
     * 设置是否打开音效
     * @param _b 状态
     */
    public static setIfOpenSound(_b: boolean) {
        this._instance._saveData.ifOpenSound = _b;
        this.SaveToDisk();
    }

    /**
     * 设置是否打开振动
     * @param _b 状态
     */
    public static setIfOpenVibrate(_b: boolean) {
        this._instance._saveData.ifOpenVibrate = _b;
        this.SaveToDisk();
    }

    /**
     * 设置当前关卡id
     * @param _n 关卡id
     */
    public static setCustoms(_n: number) {
        //化整
        _n = Math.floor(_n);
        //
        if (_n > this._instance._saveData.maxCustoms) {
            return;
        }
        this._instance._saveData.onCustoms = _n;
    }

    /**
     * 增加关卡
     * @param _number 增加关卡数量
     * @return 是否增加成功
     */
    public static addCustoms(_number: number = 1): boolean {
        //化整
        _number = Math.floor(_number);
        //设置当前关卡
        let _sum: number = this._instance._saveData.onCustoms + _number;
        let _win: boolean = false;
        if (_sum <= this._instance._saveData.maxCustoms) {
            this._instance._saveData.onCustoms = _sum;
            if (_sum > this._instance._saveData.maxCustomsRecord) {
                this._instance._saveData.maxCustomsRecord = _sum;
            }
            _win = true;
        } else {
            this._instance._saveData.onCustoms = ECommonLeve.DefaultLeveId;
            _win = true;
        }
        //保存记录
        this.SaveToDisk();
        //
        return _win;
    }

    /**
     * 返回默认的关卡
     */
    public static getDefaultCustoms(): number {
        if (this._instance._saveData.onCustoms > this._instance._saveData.maxCustoms) {
            this._instance._saveData.onCustoms = ECommonLeve.DefaultLeveId;
            //保存数据
            this.SaveToDisk();
        }
        return this._instance._saveData.onCustoms;
    }

    /**
     * 返回需要预加载的关卡id
     */
    public static getPreloadCustoms(): number {
        return this.getNextCustoms();
    }

    /**
     * 获取下一个关卡
     */
    public static getNextCustoms(): number {
        let _customs: number = this._instance._saveData.onCustoms + 1;
        if (_customs > this._instance._saveData.maxCustoms) {
            _customs = ECommonLeve.DefaultLeveId;
        }
        //
        return _customs;
    }

    // ** -------------------------------------------------------------------------------------- ** //

    //获取一个新的数据
    protected getNewData(): GameData {
        return new GameData();
    }

    /**
     * 保存到本地 （改变本地数据时调用）
     */
    public static SaveToDisk() {
        this._instance._SaveToDisk(this._instance._saveData);
    }
}