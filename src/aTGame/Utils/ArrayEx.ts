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
     * 随机获取数组中的随机值，可指定长度和权重分配
     * @param _array 源数组
     * @param _n 随机产生的个数
     * @param _weight 权重分配
     */
    public static RandomGet<T>(_array: T[], _n: number = 1, _weight: number[] = _array.map<number>((item) => { return 1; })): T[] {
        let _newArray: T[] = [];
        //索引权重映射表
        let _weightArray: {
            _weight: number,
            _index: number,
        }[] = [];
        //总权重
        let _weightSum: number = 0;
        _weight.forEach((item) => {
            _weightSum += item;
        });
        _weightArray = _array.map((item, _index) => {
            return {
                _index: _index,
                _weight: _weight[_index] / _weightSum,
            };
        });
        //最大权重值
        let _maxWeight: number = 0;
        //
        let _index: number;
        let _random: number;
        for (let _i = 0; _i < _n; _i++) {
            //检测是否已经全部取出
            if (_weightArray.length <= 0) { break; }
            //权重表升序排列
            _weightArray.sort((a, b) => { return a._weight - b._weight; });
            //找出现在的最大权重值
            _weightArray.forEach((item) => {
                _maxWeight = Math.max(_maxWeight, item._weight);
            });
            //获取0~最大权重值之间的随机值
            _random = Math.random() * _maxWeight;
            //获取一个随机的索引
            _index = 0;
            for (let _x = 0; _x < _weightArray.length; _x++) {
                if (_weightArray[_x]._weight >= _random) {
                    _index = _x;
                    break;
                }
            }
            //提取
            _newArray.push(_array[_weightArray.splice(_index, 1)[0]._index]);
        }
        //
        return _newArray;
    }
}