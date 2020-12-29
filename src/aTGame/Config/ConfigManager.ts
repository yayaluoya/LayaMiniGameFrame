import EssentialResUrls from "../Res/EssentialResUrls";
import ResLoad from "../Res/ResLoad";
import ArrayUtils from "../Utils/ArrayUtils";

/**
 * 配置管理器
 * 所有配置文件加载完处理后就销毁,只有额外的配置文件列表中的配置文件不会被销毁
 */
export class ConfigManager {
    //
    private static _configList: any[] = [];
    //
    private static _extraConfig: string[] = [];

    /** 加载配置文件数量 */
    static get needLoadCount(): number {
        return this._configList.length;
    }

    /**
     * 添加配置文件
     * @param configName 配置文件
     */
    public static AddConfig(configName: { [index: string]: any, config: any, data: any, path: string }) {
        ConfigManager._configList.push(configName);
    }

    /**
     * 添加额外的配置文件列表
     * @param _url 
     */
    public static AddExtraConfig(_url: string[]) {
        //
        if (_url.length > 0) {
            //添加
            ConfigManager._extraConfig.push(..._url);
            //去重
            ConfigManager._extraConfig = ArrayUtils.Unique(ConfigManager._extraConfig);
        }
    }

    /**
     * 开始加载配置
     * @param onFinished 加载完成回调
     * @param onProgress 加载进度回调
     */
    public static StartLoad(onFinished: Laya.Handler, onProgress: Laya.Handler = null) {
        //判断是否有配置
        if (ConfigManager._configList.length == 0) {
            if (onFinished) {
                onFinished.run();
            }
            return;
        }
        //获取配置路径列表
        let loadUrls = [];
        for (let configName of ConfigManager._configList) {
            loadUrls.push(EssentialResUrls.ConfigURL(configName.path.match(/[a-zA-Z0-9.]*$/)[0]));
        }
        //获取需要清理掉的配置文件路径
        let _clearURLs: string[] = [];
        loadUrls.forEach((item) => {
            _clearURLs.push(item);
        });
        //添加额外的配置文件
        loadUrls.push(...this._extraConfig);
        //加载文件
        Laya.loader.create(loadUrls, Laya.Handler.create(this, () => {
            //获取文件并初始化数据
            for (let configName of ConfigManager._configList) {
                configName.data = Laya.loader.getRes(EssentialResUrls.ConfigURL(configName.path.match(/[a-zA-Z0-9.]*$/)[0]));
                configName.dataList = [];
                for (let configKey in configName.data) {
                    let value = configName.data[configKey];
                    if (value != null) {
                        configName.dataList.push(value);
                    }
                }
                if (configName.dataList.length > 0) {
                    configName.lastData = configName.dataList[configName.dataList.length - 1];
                }
            }
            if (onFinished) {
                onFinished.run();
            }
            //清理资源
            _clearURLs.forEach((item) => {
                ResLoad.Unload(item);
            });
        }), onProgress);
    }
}