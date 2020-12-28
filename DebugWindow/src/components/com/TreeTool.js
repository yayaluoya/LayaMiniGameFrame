import { getKeys, getClassName } from "./Tool";

//免过滤键
let _keyNotFilterArray = ['_children'];

//
function getAllKeys_(_o) {
    let _ifKey = true;
    let _ifValue = true;
    let _keys = getKeys(_o, (key, o) => {
        //不是方法和不是下划线开头的属性
        _ifKey = true;
        _ifValue = true;
        try {
            if (typeof o[key] != "undefined") {
                _ifKey = typeof o[key] != "function";
            }
        } catch {
            _ifKey = false;
            // console.log('有一个键获取值时出错了', key, o);
        }
        //保留指定不过滤的内容
        if (_keyNotFilterArray.findIndex((item) => { return item == key }) == -1) {
            //去掉前缀是下划线的
            _ifValue = !/^_/.test(key);
        }
        return _ifKey && _ifValue;
    });
    //
    return _keys;
}

//获取对象可依次遍历的属性值
function getKeys_(_o) {
    //判断是否为空
    if (typeof _o == "undefined" || (typeof _o == "object" && !_o)) {
        return [];
    }
    let _keys = Object.getOwnPropertyNames(_o);
    //剔除方法和_开头的属性
    _keys = _keys.filter((item) => {
        let _if = true;
        try {
            //判断是不是方法
            if (typeof _o[item] == "function") {
                _if = false;
            } else {
                //判断是不是下划线开头
                if (/^_/.test(item)) {
                    _if = false;
                }
            }
        }
        catch {
            _if = false;
        }
        return _if;
    });
    //判断有没有原型
    if (typeof _o == "object" && _o['__proto__']) {
        _keys.push('__proto__');
    }
    //去重
    _keys = Array.from(new Set(_keys));
    //
    return _keys;
}

//调试对象根对象
function getDebugDataRoot() {
    if (!window.opener) {
        window.opener = {};
    }
    return window.opener;
}

//调试键
function getDebugDataRootKey() {
    return '$Debug';
}

/** 树形结构工具 */
let _TreeTool = {
    //
    getDebugDataRoot: getDebugDataRoot,
    getDebugDataRootKey: getDebugDataRootKey,
    //
    getDebugData() {
        //
        if (!getDebugDataRoot()[getDebugDataRootKey()]) {
            var myObj = {
                get a() {
                    return 10;
                },
            };

            var anotherObj = Object.create(myObj);

            let _ap = new Proxy({ a: 1, b: 2 }, {});

            // console.log(anotherObj);

            var o = {};
            Object.defineProperty(o, "x", {
                value: { a: 1, b: 2 },
                writable: false,
                enumerable: false,  // bu可枚举
                configurable: true
            });
            Object.defineProperty(o, "y", {
                value: { a: 2, b: 4 },
                writable: true,
                enumerable: false,  // bu可枚举
                configurable: true
            });
            let _f = function () {
                this.null = undefined;
                this.anotherObj = {
                    a: anotherObj,
                };
                this.ap = _ap;
                this.o = o;
                this._a = 0;
                this.boole = true;
                this.a = 1;
                this.b = 2;
                this.flot = 1.004;
                _f.prototype.c = 3;
                _f.prototype.d = 4;
                _f.prototype.f = function () {
                    console.log('f');
                };
                _f.prototype.e = {
                    g: 1,
                    x: 0,
                    boole: false,
                };
            }
            getDebugDataRoot()[getDebugDataRootKey()] = new _f();
            // console.log(getDebugDataRoot()[getDebugDataRootKey()]);
        }
        //
        return getDebugDataRoot()[getDebugDataRootKey()];
    },

    //获取对象所有键值
    getAllKeys: getAllKeys_,

    //获取对象可依次遍历的属性值
    getKeys: getKeys_,

    //获取对象的名字
    getClassName: getClassName,

    //判断是否显示键
    ifShowKey(_o, _key) {
        try {
            let _data = _o[_key];
            _o[_key] = _data;
        }
        catch {
            return false;
        }
        return true;
    }
};
//
export default _TreeTool;