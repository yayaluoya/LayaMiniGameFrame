import ConsoleEx from "../Console/ConsoleEx";

/**
 * 基类数据代理类
 */
export default abstract class BaseDataProxy {
    /** 数据设置监听，当数据设置时会执行的监听 */
    private _dataSetMonitor: {
        _this: any,
        _f: IDataMonitorF,
        _rootData: any,
        _key: string[],//键数组
    }[] = [];

    /**
     * 添加属性设置监听
     * @param _this 执行域
     * @param _dataSetMonitorF 数据设监听
     * @param _key 受监听的属性或者列表
     */
    public addKeySetMonitor(_this: any, _dataSetMonitorF: IDataMonitorF, _key?: string | number | boolean | (string | number | boolean)[]) {
        let __key: string[] = [];
        //判断是否是对象属性
        if (_key instanceof Array) {
            __key.push(..._key as string[]);
        } else {
            __key.push(_key as string);
        }
        let __keys: {
            rootData: any,
            key: string[],
        }[] = [];
        let _index: number;
        __key.forEach((item) => {
            if (typeof item == 'object' && item) {
                _index = __keys.findIndex((keys) => {
                    return keys.rootData == item[SaticBaseDataProxy.$RootParentDataKey];
                });
                if (_index == -1) {
                    __keys.push({
                        rootData: item[SaticBaseDataProxy.$RootParentDataKey],
                        key: [item[SaticBaseDataProxy.$RootDataCruxKey]],
                    });
                } else {
                    __keys[_index].key.push(item[SaticBaseDataProxy.$RootDataCruxKey]);
                }
            }
        });
        //
        if (__keys.length <= 0) { return; }
        __keys.forEach((item) => {
            //添加到监听列表
            this._dataSetMonitor.push({
                _this: _this,
                _f: _dataSetMonitorF,
                _rootData: item.rootData,
                _key: item.key,
            });
        });
    }

    /**
     * 添加对象设置监听
     * @param _this 执行域
     * @param _dataSetMonitorF 执行方法
     * @param _rootData 受监听的原始对象，不设置则监听全部内容，只能在this.rootData找属性进行监听
     * @param _key 受监听的对象的属性，可以直接是个字符串，也可以是个列表
     */
    public addObjectSetMonitor(_this: any, _dataSetMonitorF: IDataMonitorF, _rootData?: object, _key?: string | number | boolean | (string | number | boolean)[]) {
        let __key: string[] = [];
        if (typeof _key != "undefined") {
            if (_key instanceof Array) {
                __key.push(..._key as string[]);
            } else {
                __key.push(_key as string);
            }
        }
        __key = __key.map((item) => {
            //判断是否是对象属性，且不是数组
            if (item) {
                if (typeof item == 'object') {
                    //判断对象和键值是否匹配
                    if (item[SaticBaseDataProxy.$RootParentDataKey] != _rootData) {
                        console.warn(...ConsoleEx.packWarn('监听的对象属性不存在该对象属性列表中！', _rootData, item));
                    } else {
                        return item[SaticBaseDataProxy.$RootDataCruxKey];
                    }
                } else {
                    return item;
                }
            }
        }).filter((item) => {
            return typeof item != "undefined";
        });
        //添加到监听列表
        this._dataSetMonitor.push({
            _this: _this,
            _f: _dataSetMonitorF,
            _rootData: _rootData,
            _key: __key,
        });
    }

    /** 
     * 删除设置数据监听
     */
    public offDataSetMonitor(_this: any, _dataSetMonitor: IDataMonitorF) {
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
     * 清除所有数据监听
     */
    public clearDataSetMonitor() {
        this._dataSetMonitor = [];
    }

    /**
     * 获取一个代理对象
     * ! 注意，被代理的原始对象会被包装，所以原始对象就不能再被使用了，只能用来判断监听层级
     * @param _obj 需要代理的对象
     */
    protected getProxyData(_obj: any): any {
        //防止原始对象被污染
        let _rootObj: any = {};
        //
        if (typeof _obj == 'object' && _obj) {
            //不监听数组中的对象
            if (!Array.prototype.isPrototypeOf(_obj)) {
                //遍历对象属性
                for (let _i in _obj) {
                    //注意 null 也为object
                    if (typeof _obj[_i] == 'object' && _obj[_i]) {
                        _rootObj[_i] = this.getProxyData(_obj[_i]);
                    } else {
                        //
                        _rootObj[_i] = _obj[_i];
                        //包装原始对象值类型
                        _obj[_i] = {
                            //关键键值
                            [SaticBaseDataProxy.$RootDataCruxKey]: Symbol('$key'),
                            //父对象
                            [SaticBaseDataProxy.$RootParentDataKey]: _obj,
                            //本身值
                            value: _obj[_i],
                        };
                    }
                }
            } else {
                _rootObj = _obj;
            }
        } else {
            return _obj;
        }
        //设置原始对象
        _rootObj[SaticBaseDataProxy.$RootObjectKey] = _obj;
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
    private proxyDataSet(target, key, value) {
        //判断是不是原始数据节点
        if (key == SaticBaseDataProxy.$RootObjectKey) {
            console.warn('试图更改数据的原始对象，被阻止', target, key, value);
            return;
        }
        //原来的值
        let _rootValue: any = target[key];
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
        let _ifIncludes: boolean;
        for (let item of this._dataSetMonitor) {
            if (item._rootData && item._rootData != target[SaticBaseDataProxy.$RootObjectKey]) {
                continue;
            }
            if (typeof item._key != 'undefined' && item._key.length > 0) {
                _ifIncludes = false;
                for (let _keyItem of item._key) {
                    if (typeof _keyItem == 'symbol') {
                        if (_keyItem == target[SaticBaseDataProxy.$RootObjectKey][key][SaticBaseDataProxy.$RootDataCruxKey]) {
                            _ifIncludes = true;
                            continue;
                        }
                    }
                    else {
                        if (_keyItem == key) {
                            _ifIncludes = true;
                            continue;
                        }
                    }
                }
                if (!_ifIncludes) {
                    continue;
                }
            }
            //
            item._f.call(item._this, target, key, value, _rootValue);
        }
        //执行回调
        this._proxyDataSet();
    }
    /**
     * 被代理数据被设置时执行的监听
     */
    protected _proxyDataSet() { }
}

/**
 * 数据监听方法接口
 */
export interface IDataMonitorF {
    (target: any, key: any, newValue: any, value: any): void;
}

/**
 * 静态数据代理值
 */
class SaticBaseDataProxy {
    /** 
     * 全局唯一属性，代理数据根数据键名
     * 根据这个可以找到代理数据的原始数据然后和原始数据对比就能判断数据监听键名
     */
    public static $RootObjectKey: symbol = Symbol('$RootObjectKey');

    /** 根数据关键键名 */
    public static $RootDataCruxKey: symbol = Symbol('$RootDataCruxKey');

    /** 根数据父节点 */
    public static $RootParentDataKey: symbol = Symbol('$RootParentDataKey');
}