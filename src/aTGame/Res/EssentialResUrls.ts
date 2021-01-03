import { AllScenePrefabsNames } from '../../cFrameBridge/Config/ELevelSceneName';
import ConsoleEx from '../Console/ConsoleEx';
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
     * 字体地址
     * @param _name 字体名字，加后缀
     */
    public static fontURL(_name): string {
        return KeyResManager.instance.getResURL(EKeyResName.Font) + _name;
    }

    //所有预制体名字列表
    private static _AllScenePrefabsNames: AllScenePrefabsNames = new AllScenePrefabsNames();
    private static _prefabsSceneCache: {
        [_index: string]: string,
    } = {};
    /**
     * 预制体资源路径
     * @param prefab 预制体名字
     */
    public static prefab_url(prefab: string): string {
        //先在缓存中查找场景名字
        if (this._prefabsSceneCache[prefab]) {
            return KeyResManager.instance.getResURL(EKeyResName[this._prefabsSceneCache[prefab]]) + 'Conventional/' + prefab + '.lh';
        }
        //判断该预制体在那个场景中被导出的
        for (let _i in this._AllScenePrefabsNames) {
            if (this._AllScenePrefabsNames[_i].indexOf('@' + prefab + '@') != -1) {
                //添加到缓存
                this._prefabsSceneCache[prefab] = _i;
                //
                return KeyResManager.instance.getResURL(EKeyResName[_i]) + 'Conventional/' + prefab + '.lh';
            }
        }
        //
        console.error(...ConsoleEx.packError('没有在场景找到预制体', prefab, '可能是没有导出场景预制体列表导致的。'));
    }
}