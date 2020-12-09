/**
 * 数组扩展类
 */
export default class ArrayEx {

    /**
     * 数组去重保留靠前的内容
     * @param arr 源数组
     */
    public static Unique<T>(arr: T[]): T[] {
        return Array.from(new Set(arr));
    }

    /**
     * 数组去重保留靠后的内容
     * @param arr 源数组
     */
    public static ReverseReserveUnique<T>(arr: T[]): T[] {
        return Array.from(new Set(arr.reverse())).reverse();
    }

    /**
     * 对象数组去重
     * @param arr 源数组
     * @param _F 获取对比键值函数
     */
    public static ObjUnique<T>(arr: T[], _F: (o: T) => string): T[] {
        for (let i = 0, len = arr.length; i < len; i++) {
            for (let j = i + 1, len = arr.length; j < len; j++) {
                if (_F(arr[i]) === _F(arr[j])) {
                    arr.splice(j, 1);
                    j--;        // 每删除一个数j的值就减1
                    len--;      // j值减小时len也要相应减1（减少循环次数，节省性能）   
                }
            }
        }
        return arr;
    }

    /**
     * 替换数组的某个元素
     * @param arr 源数组
     * @param oldObj 被替换的元素
     * @param newObj 替换元素
     */
    public static Replace<T>(arr: T[], oldObj: T, newObj: T): boolean {
        let index = arr.indexOf(oldObj);
        if (index < 0) return false;
        arr.splice(index, 1, newObj);
        return true;
    }

    /**
     * 删除一个元素并返回结果
     * @param arr 源数组
     * @param obj 删除目标对象
     */
    public static RemoveItem<T>(arr: T[], obj: T): boolean {
        let index = arr.indexOf(obj);
        if (index < 0) return false;
        arr.splice(index, 1);
        return true;
    }

    /**
     * 根据索引删除一个数据
     * @param arr 源数组
     * @param index 索引
     */
    public static RemoveAt<T>(arr: T[], index: number): boolean {
        if (arr.length <= index) return false;
        arr.splice(index, 1);
        return true;
    }

    /**
     * 数组是否包含某个数据
     * @param arr 
     * @param obj 
     */
    public static Contains<T>(arr: T[], obj: T): boolean {
        let index = arr.indexOf(obj);
        return index >= 0;
    }

    /**
     * 复制一个数组
     * @param arr 源数组
     */
    public static Copy<T>(arr: T[]): T[] {
        let result = [];
        for (let i = 0; i < arr.length; ++i) {
            result.push(arr[i]);
        }
        return result;
    }

    /**
     * 随机打乱数组
     * @param _array 目标数组 
     */
    public static upsetArray<T>(_array: T[]) {
        //乱序
        _array.sort(() => {
            return Math.random() - 0.5;
        });
    }

    /**
     * 随机获取数组中的随机值，可指定长度
     */
    public static RandomGet<T>(_array: T[], _n: number = 1): T[] {
        let _rootArray: T[] = [];
        let _newArray: T[] = [];
        _array.forEach((item) => {
            _rootArray.push(item);
        });
        let _index: number;
        for (let _i = 0; _i < _n; _i++) {
            if (_rootArray.length <= 0) { break; }
            _index = Math.floor(Math.random() * _rootArray.length);
            _newArray.push(_rootArray.splice(_index, 1)[0]);
        }
        //
        return _newArray;
    }
}