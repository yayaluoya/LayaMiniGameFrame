//各个属性应有的键值
let _comKeys = [];
_comKeys.push(...Object.getOwnPropertyNames(Object));
_comKeys.push(...Object.getOwnPropertyNames(Array));
_comKeys.push('__proto__');
_comKeys = Array.from(new Set(_comKeys));

//获取对象键值，包括所有原型链上的键
function getKeys(_o, _filter) {
    let _keys = [];
    _getKey(_o, _keys, _filter);
    //去重
    _keys = Array.from(new Set(_keys));
    //
    return _keys;
}
//配合获取所哟原型链上的内容
function _getKey(_o, _keys, _filter) {
    if (typeof _o == "object") {
        //判断对象是否为null
        if (!_o) {
            return;
        }
        let __keys = Object.getOwnPropertyNames(_o);
        //剔除这个对象公共的键
        __keys = __keys.filter((item) => {
            return _comKeys.findIndex((item1) => {
                return item1 == item;
            }) == -1;
        });
        //过滤键
        if (_filter) {
            __keys = __keys.filter((item) => {
                return _filter(item, _o);
            });
        }
        //获取所哟键值
        _keys.push(...__keys);
        //判断有没有原型
        if (_o['__proto__']) {
            _getKey(_o['__proto__'], _keys, _filter);
        }
    }
}

//获取类名
function getClassName(obj) {
    if (obj && obj.constructor && obj.constructor.toString()) {
        if (obj.constructor.name) {
            return obj.constructor.name;
        }
        let str = obj.constructor.toString();
        let arr;
        if (str.charAt(0) == '[') {
            arr = str.match(/\w+\s∗(\w+)\w+\s∗(\w+)/);
        } else {
            arr = str.match(/function\s*(\w+)/);
        }
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }
    return undefined;
}

//
export {
    getKeys,
    getClassName,
};