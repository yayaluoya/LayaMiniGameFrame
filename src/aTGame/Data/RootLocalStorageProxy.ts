import RootLocalStorageData from './RootLocalStorageData';
import MainConfig from '../../bTGameConfig/MainConfig';
import StringUtils from '../Utils/StringUtils';
import Md5 from './Md5';
import RootDataManger from './RootDataManger';
import Base64 from './Base64';
import ConsoleEx from '../Console/ConsoleEx';
/**
 * 本地数据代理基类，用以使用和保存数据
 * 泛型为数据类型
 */
export default abstract class RootLocalStorageProxy<T extends RootLocalStorageData> extends RootDataManger {
    /** 
     * 全局唯一属性，代理数据根数据
     * 根据这个可以找到代理数据的原始数据和原始数据对比就能找出数据代理层级
     */
    public static $RootObjectKey: symbol = Symbol('$RootObjectKey');

    /** 需要保存的数据 */
    protected _saveData: T;

    /** 原始数据，用来和和代理数据对比查看哪个数据被改动了*/
    protected _rootData: T;

    /** 
     * 是否设置数据代理
     * 监听数据变化自动保存
     * 最低监听数组变化，当数组内容是对象时不会监听该对象。
     */
    protected _ifSetDataProxy: boolean = false;

    /** 数据设置监听，当数据设置时会执行的监听 */
    private _dataSetMonitor: {
        _this: any,
        _f: (target, key, value, rootData) => any,
    }[] = [];

    /**
     * 是否对比数据
     * 默认为true，如果为真当为线上模式时会生成一个加密的对比数据，防止用户改动本地数据
     */
    protected _ifDifferData: boolean = true;

    /** 获取保存名称 */
    protected abstract get _saveName(): string;

    //获取保存数据的名字
    private get saveName(): string {
        return MainConfig.GameName + this._saveName;
    }

    // 获取对比数据的保存名字
    private get differName(): string {
        //
        return this.encrypt(this.saveName + '__LayaMiniGame__DifferData__');
    }

    /** 获取保存数据，非副本，谨慎更改 */
    public get saveData(): T {
        return this._saveData;
    }

    /** 获取原始数据，不能更改 */
    public get rootData(): T {
        return this._rootData;
    }

    /** 
     * 添加数据设置监听
     */
    public addDataSetMonitor(_this: any, _dataSetMonitor: (target, key, value, rootData) => void) {
        //判断是否设置了数据代理
        if (!this._ifSetDataProxy) {
            console.log(...ConsoleEx.packWarn('没有设置数据代理，数据被设置时不会被监听！'));
        } else {
            this._dataSetMonitor.push({
                _this: _this,
                _f: _dataSetMonitor,
            });
        }
    }

    /** 
     * 删除设置数据监听
     */
    public offDataSetMonitor(_this: any, _dataSetMonitor: (target, key, value, rootData) => void) {
        this._dataSetMonitor = this._dataSetMonitor.filter((item) => {
            return item._this !== _this && item._f !== _dataSetMonitor;
        });
    }

    /** 
     * 删除全部设置数据监听
     */
    public offAllDataSetMonitor(_this: any) {
        this._dataSetMonitor = this._dataSetMonitor.filter((item) => {
            return item._this !== _this;
        });
    }

    /**
     * 初始化数据
     */
    public InitData() {
        this._saveData = this._ReadFromFile();
        //保存原始数据
        this._rootData = this._saveData;
        //判断是否设置数据代理
        if (this._ifSetDataProxy) {
            this._saveData = this.getProxyData(this._saveData) as T;
        }
        //
        this._initData();
    }

    /**
     * 获取一个代理对象
     * @param _obj 需要代理的对象
     */
    private getProxyData(_obj: any): any {
        //防止原始对象被污染
        let _rootObj: any = {};
        if (typeof _obj == 'object' && _obj) {
            //不监听数组中的对象
            if (!Array.prototype.isPrototypeOf(_obj)) {
                //遍历对象属性
                for (let _i in _obj) {
                    //注意 null 也为object
                    if (typeof _obj[_i] == 'object' && _obj[_i]) {
                        _rootObj[_i] = this.getProxyData(_obj[_i]);
                    } else {
                        _rootObj[_i] = _obj[_i];
                    }
                }
            } else {
                _rootObj = _obj;
            }
        } else {
            return _obj;
        }
        //设置原始对象
        _rootObj[RootLocalStorageProxy.$RootObjectKey] = _obj;
        // console.log('设置原始对象', _rootObj);
        //返回代理对象
        return new Proxy<any>(_rootObj, {
            set: (target, key, value) => {
                this.proxyDataSet(target, key, value);
                return true;
            },
        });
    }

    /** 代理数据被设置时调用 */
    protected proxyDataSet(target, key, value) {
        //判断是不是原始数据节点
        if (key == RootLocalStorageProxy.$RootObjectKey) {
            console.warn('试图更改数据的原始对象，被阻止', target, key, value);
            return;
        }
        // console.log('数据属性改变', target, key, value);
        //如果赋的值是一个对象则继续监听
        if (typeof value == 'object' && value && !Array.prototype.isPrototypeOf(target)) {
            target[key] = this.getProxyData(value);
        } else {
            target[key] = value;
            //判断是不是数组长度改变，这个不用被监听
            if (Array.prototype.isPrototypeOf(target) && key == 'length') {
                return;
            }
        }
        //执行数据监听
        this._dataSetMonitor.forEach((item) => {
            item._f.call(item._this, target, key, value, target[RootLocalStorageProxy.$RootObjectKey]);
        });
        //保存数据
        this._SaveToDisk(this._saveData);
    }

    /** 初始化完成，继承使用 */
    protected _initData() { }

    /**
     * 保存数据到本地
     */
    protected _SaveToDisk(_saveData: T) {
        let json = JSON.stringify(_saveData);
        Laya.LocalStorage.setJSON(this.saveName, json);
        //判断是否是线上环境
        if (MainConfig.OnLine && this._ifDifferData) {
            //获取对比数据
            let _differJson = this.getDifferData(json);
            //保存对比数据
            Laya.LocalStorage.setJSON(this.differName, _differJson);
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
        _saveData.versions = undefined;
        //判断数据是否被篡改
        try {
            if (!StringUtils.IsNullOrEmpty(readStr)) {
                let jsonData = JSON.parse(readStr);
                for (let key in jsonData) {
                    _saveData[key] = jsonData[key];
                }
            } else {
                return this._saveNewData();
            }
        }
        catch {
            return this._saveNewData();
        }
        //判断数据版本
        if (_saveData.versions == MainConfig.versions) {
            return _saveData as T;
        } else {
            return this._saveNewData();
        }
    }

    //获取并保存一个新数据
    private _saveNewData(): T {
        let _saveData: T = this.getNewData();
        //设置相关数据
        _saveData.versions = MainConfig.versions;
        _saveData.GameName = MainConfig.GameName;
        _saveData.GameExplain = MainConfig.GameExplain;
        //保存数据
        this._SaveToDisk(_saveData as T);
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
        let _encryptStr: string = 'LayaMiniGame' + '-(-' + _string + '-)' + '-ModifiedWithout-' + MainConfig.GameName + '-' + MainConfig.versions;
        //判断能否使用md5
        if (Md5.ifUse) {
            return Md5.hashStr(_encryptStr).toString();
        } else {
            //使用base64
            return Base64.encode(_encryptStr);
        }
    }
}