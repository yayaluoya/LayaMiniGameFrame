/**
 * 字符串处理工具
 */
export default class NumberUtils {
    /**
     * 获取指定尾数位数字符串
     * @param num 源字符串
     * @param decimal 尾数位置 
     */
    public static toFixed(num: number, decimal: number = 0) {
        let _num: string = num.toString();
        let index = _num.indexOf('.');
        if (index !== -1) {
            _num = _num.substring(0, decimal + index + 1);
        } else {
            _num = _num.substring(0);
        }
        return parseFloat(_num);
    }

    private static _strMap: string[];
    /**
     * 获得金币字符串显示
     * @param num 
     */
    public static GetCoinStr(num: number): string {
        if (this._strMap == null) {
            this._strMap = ["", "K", "M", "B", "T", "Q"];
            for (let i = 0; i < 500; ++i) {
                let firstC = String.fromCharCode(Math.floor(i / 24) + 97);
                let behind = String.fromCharCode(Math.floor(i % 24) + 97);
                this._strMap.push(firstC + behind);
            }
        }
        let count = 0;
        while (num > 1000) {
            num /= 1000;
            count++;
        }
        if (count >= this._strMap.length) {
            console.error("单位表越界");
            return num.toFixed(1) + "aa"//"越界";
        }
        if (count <= 0) {
            return num.toFixed(0);
        }
        return num.toFixed(1) + this._strMap[count];
    }

    /**
     * 获得金币字符串显示
     * @param num 
     */
    public static GetCoinStr1(num: number): string {
        if (this._strMap == null) {
            this._strMap = ["", "K", "M", "B", "T", "Q"];
            for (let i = 0; i < 500; ++i) {
                let firstC = String.fromCharCode(Math.floor(i / 24) + 97);
                let behind = String.fromCharCode(Math.floor(i % 24) + 97);
                this._strMap.push(firstC + behind);
            }
        }
        let count = 0;
        while (num > 1000) {
            num /= 1000;
            count++;
        }
        if (count >= this._strMap.length) {
            console.error("单位表越界");
            return num.toFixed(1) + "aa"//"越界";
        }
        if (count <= 0) {
            return num.toFixed(0);
        }
        return num.toFixed(0) + this._strMap[count];
    }

    /**
     * 获取一个数的符号
     * @param _n 
     */
    public static getNumberSymbol(_n: number): 1 | -1 | 0 {
        if (_n > 0) {
            return 1;
        } else if (_n < 0) {
            return -1;
        } else {
            return 0;
        }
    }
}