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