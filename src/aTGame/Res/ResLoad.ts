import ConsoleEx from "../Console/ConsoleEx";

/**
 * 资源加载类
 */
export default class ResLoad {
    /**
     * 加载资源
     * @param urls 资源路径
     * @param onCompleted 完成回调
     * @param onProgress 
     */
    public static Load(urls: string | string[], onCompleted: Laya.Handler, onProgress: Laya.Handler = null) {
        if (onProgress && onProgress.once) {
            onProgress.once = false;
        }
        //判断是否有内容需要加载
        if (!urls || urls.length == 0) {
            onCompleted.run();
            onProgress.run();
            return;
        }
        Laya.loader.create(urls, onCompleted, onProgress);
    }

    /**
     * 加载2D资源
     * @param urls 资源路径 
     * @param onCompleted 完成时回调
     * @param onProgress 
     */
    public static Load2d(urls: string | string[], onCompleted: Laya.Handler, onProgress: Laya.Handler = null) {
        if (onProgress && onProgress.once) {
            onProgress.once = false;
        }
        //判断是否有内容需要加载
        if (!urls || urls.length == 0) {
            onCompleted.run();
            onProgress.run();
            return;
        }
        Laya.loader.load(urls, onCompleted, onProgress);
    }

    /**
     * 异步加载资源
     * @param urls 资源路径
     * @param onProgress 
     */
    public static LoadAsync(urls: string | string[], onProgress: Laya.Handler = null): Promise<void> {
        //
        return new Promise((resolve) => {
            ResLoad.Load(urls, Laya.Handler.create(null, () => {
                resolve();
            }), onProgress);
        });
    }

    /**
     * 异步加载2D资源
     * @param urls 资源路径
     * @param onProgress 
     */
    public static Load2dAsync(urls: string | string[], onProgress: Laya.Handler = null): Promise<void> {
        //
        return new Promise(function (resolve) {
            ResLoad.Load2d(urls, Laya.Handler.create(null, () => {
                resolve();
            }), onProgress);
        });
    }

    /**
     * 获取资源
     * @param resUrl 资源路径
     * @param noClone 是否不获取克隆的资源
     */
    public static Get(resUrl: string, noClone: boolean = false): any {
        let getRes = Laya.loader.getRes(resUrl);
        if (getRes == null) {
            console.error(...ConsoleEx.packError("资源尚未加载", resUrl));
            return null;
        }
        return noClone ? getRes : getRes.clone();
    }

    /**
     * 加载并获取资源
     * @param resUrl 资源路径
     * @param noClone 是否获取克隆的资源
     */
    public static LoadAndGet(resUrl: string, noClone: boolean = false): Promise<any> {
        return new Promise<any>((r: Function) => {
            ResLoad.LoadAsync(resUrl).then((_data: any) => {
                r(ResLoad.Get(resUrl, noClone));
            });
        });
    }

    /**
     * 清理指定资源地址缓存。
     * @param resUrl 资源路径
     */
    public static Unload(resUrl: string) {
        Laya.loader.clearRes(resUrl);
    }
}