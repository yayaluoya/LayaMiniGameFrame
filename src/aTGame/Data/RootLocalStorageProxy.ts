import RootLocalStorageData from './RootLocalStorageData';
import MainConfig from '../../bTGameConfig/MainConfig';
import StringUtils from '../Utils/StringUtils';
import Md5 from './Md5';
import RootDataManger from './RootDataManger';
import Base64 from './Base64';
import DataDebug from '../Debug/DataDebug';
import ConsoleEx from '../Console/ConsoleEx';
/**
 * 本地数据代理基类，用以使用和保存数据
 * 泛型为数据类型
 */
export default abstract class RootLocalStorageProxy<T extends RootLocalStorageData> extends RootDataManger {
    /** 
    * 是否设置数据代理,默认为true
    * 监听数据变化并且自动保存
    * 最低监听数组变化，当数组内容是对象时不会监听该对象。
    */
    protected _ifSetDataProxy: boolean = true;

    /** 需要保存的数据 */
    protected _saveData: T;

    /** 原始数据，用来和和代理数据对比查看哪个数据被改动了*/
    protected _rootData: T;

    /**
     * 是否对比数据
     * 默认为true，如果为真当为线上模式时会生成一个加密的对比数据，防止用户改动本地数据
     */
    protected _ifDifferData: boolean = true;

    /** 获取保存名称 */
    protected abstract get _saveName(): string;

    //获取保存数据的名字
    private get saveName(): string {
        return MainConfig.GameName + '->' + this._saveName + '->' + MainConfig.versions;
    }

    // 获取对比数据的保存名字
    private get differName(): string {
        //
        return this.encrypt(this.saveName + '__verify');
    }

    /** 获取保存数据 */
    public get saveData(): T {
        return this._saveData;
    }

    /** 
     * 获取原始数据，不能更改
     * 使用这个数据来设置监听数据的层级和位置
     */
    public get rootData(): T {
        return this._rootData;
    }

    /**
     * 初始化数据
     */
    public InitData() {
        let _time = Date.now();
        this._saveData = this._ReadFromFile();
        //保存原始数据
        this._rootData = this._saveData;
        //判断是否设置数据代理
        if (this._ifSetDataProxy) {
            //代理数据
            this._saveData = this.getProxyData(this._saveData) as T;
        }
        //添加到调试当中
        DataDebug.instance.addItem(this._saveName, this);
        //
        this._initData();
        _time = Date.now() - _time;
        //判断时间差
        if (_time > 100) {
            console.warn(...ConsoleEx.packWarn('初始化本地数据时间过长', this.saveName, _time));
        }
    }

    /** 初始化完成，继承使用 */
    protected _initData() { }

    /** 数据被设置回调 */
    protected _proxyDataSet() {
        this.SaveToDisk(this._saveData);
    }

    /** 保存执行队列 */
    private m_saveToDiskQueue: number = 0;
    private m_saveToDiskTime: number = 0;
    /**
     * 保存数据到本地
     * @param _saveData 数据
     * @param _ifCl 是否限流
     */
    protected SaveToDisk(_saveData: T, _ifCl: boolean = true) {
        //添加时间判断
        if (this.m_saveToDiskTime == 0) {
            this.m_saveToDiskTime = Date.now();
        }
        //判断是否限流
        if (!_ifCl) {
            this._SaveToDisk(_saveData);
        }
        else {
            this.m_saveToDiskQueue++;
            //当前帧末尾执行
            setTimeout(() => {
                this.m_saveToDiskQueue--;
                // console.log('保存数据前');
                if (this.m_saveToDiskQueue == 0) {
                    //限流，每一帧只保存一次数据
                    this._SaveToDisk(_saveData);
                }
            }, 0);
        }
    }
    //保存数据到本地
    private _SaveToDisk(_saveData?: T) {
        // console.log('保存数据');
        //序列化
        let json = JSON.stringify(_saveData);
        Laya.LocalStorage.setJSON(this.saveName, json);
        //判断是否是线上环境
        if (MainConfig.OnLine && this._ifDifferData) {
            //获取对比数据
            let _differJson = this.getDifferData(json);
            //保存对比数据
            Laya.LocalStorage.setJSON(this.differName, _differJson);
        }
        //判断时间
        let _time = Date.now() - this.m_saveToDiskTime;
        this.m_saveToDiskTime = 0;
        //判断时间差
        if (_time > 1000) {
            console.warn(...ConsoleEx.packWarn('场景保存时间过长', this.saveName, _time));
        }
    }

    //从本地获取数据
    protected _ReadFromFile(): T {
        let readStr = Laya.LocalStorage.getJSON(this.saveName);
        //判断是否是线上环境
        if (MainConfig.OnLine && this._ifDifferData) {
            //对比数据
            let _differ = Laya.LocalStorage.getJSON(this.differName);
            if (this.getDifferData(readStr) != _differ) {
                return this._saveNewData();
            }
        }
        let _saveData: T = this.getNewData();
        //判断数据是否被篡改
        try {
            if (!StringUtils.IsNullOrEmpty(readStr)) {
                let jsonData = JSON.parse(readStr);
                for (let key in _saveData) {
                    _saveData[key] = jsonData[key];
                }
            } else {
                return this._saveNewData();
            }
        }
        catch {
            return this._saveNewData();
        }
        //
        return _saveData;
    }

    //获取并保存一个新数据
    private _saveNewData(): T {
        let _saveData: T = this.getNewData();
        //保存数据，马上保存，不然后续这个数据会被修改
        this.SaveToDisk(_saveData as T, false);
        //
        return _saveData as T;
    }

    /**
     * 获取一个新的数据
     * 当数据出现问题时会重构数据
     */
    protected abstract getNewData(): T;

    //处理对比数据
    private getDifferData(_string: string): string {
        //判断是否为空
        if (StringUtils.IsNullOrEmpty(_string)) return '';
        //加密
        return this.encrypt(_string);
    }

    //加密
    private encrypt(_string: string) {
        let _encryptStr: string = 'LayaMiniGame-(-' + _string + '-)-ModifiedWithout-' + this.saveName;
        //判断能否使用md5
        if (Md5.ifUse) {
            return Md5.hashStr(_encryptStr).toString();
        } else {
            //使用base64
            return Base64.encode(_encryptStr);
        }
    }
}