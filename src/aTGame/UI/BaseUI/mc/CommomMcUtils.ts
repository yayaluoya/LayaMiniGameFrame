import MovieClipProxy from './MovieClipProxy';
import McLoad from './McLoad';
/**
 * 公共Mc工具类
 */
export default class CommomMcUtils {
    /**
     * 加载Mc资源
     * @param type 类型
     * @param complete 完成时回调
     */
    public static loadMcRes(type: string, complete?: Laya.Handler) {
        MovieClipProxy.mcArr[type] || (MovieClipProxy.mcArr[type] = new McLoad(type));
        (MovieClipProxy.mcArr[type] as McLoad).loadRes(complete);
    }

    /**
     * 增加一次引用
     * @param type 类型
     */
    public static addMcNode(type: string) {
        MovieClipProxy.mcArr[type] || (MovieClipProxy.mcArr[type] = new McLoad(type));
        MovieClipProxy.handNum[type] ? MovieClipProxy.handNum[type]++ : MovieClipProxy.handNum[type] = 1;
    }

    /**
     * 清除此类特效
     * @param type 类型
     */
    public static clearAllMcByType(type: string) {
        let num = MovieClipProxy.handNum[type];
        if (num != null) {
            delete MovieClipProxy.handNum[type];
            (MovieClipProxy.mcArr[type] as McLoad).clearMcAndCom();
            delete MovieClipProxy.mcArr[type];
        }
    }

    /**
     * 清理同类特效引用 次数
     * @param type 类型
     * @param times 次数
     */
    public static clearMcTimesByType(type: string, times: number = 1) {
        let num = MovieClipProxy.handNum[type];
        if (num != null) {
            MovieClipProxy.handNum[type] = num - times;
            if (MovieClipProxy.handNum[type] <= 0) {
                if (num > 0) {
                    (MovieClipProxy.mcArr[type] as McLoad).clearMcAndCom();
                }
                if (MovieClipProxy.handNum[type] <= 0) {
                    delete MovieClipProxy.mcArr[type];
                    delete MovieClipProxy.handNum[type];
                }
            }
        }
    }
}