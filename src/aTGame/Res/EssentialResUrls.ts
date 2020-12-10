import { EKeyResName } from './EKeyResName';
import KeyResManager from './KeyResManager';
/**
 * 必要的游戏资源路径
 * 游戏必须要得资源，会在游戏加载时被默认加载
 */
export default class EssentialResUrls {

    /**
     * 获取所有的其他资源列表
     * 资源列表必须在EssentialResUrls类中获取，便于清理
     */
    public static EssentialOtherResUrl(): string[] {
        let _URLs: string[] = [];
        //添加资源
        //
        //
        return _URLs;
    }

    //* ----------单个资源---------- *//

    /**
     * 获取关卡配置文件
     * @param _name 场景名字
     */
    public static levelConfigURL(_name: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.LvConfig) + _name + '.json';
    }

    /**
     * 获取配置表RUL
     * @param _name 配置表名字
     */
    public static ConfigURL(_name: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.Config) + _name;
    }

    /**
     * FGUI包
     * @param _name 包名
     */
    public static FGUIPack(_name: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.FGUI) + _name;
    }

    /**
     * 预制体资源路径
     * @param prefab 预制体名字
     */
    public static prefab_url(prefab: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.Prefab) + 'Conventional/' + prefab + '.lh';
    }
}