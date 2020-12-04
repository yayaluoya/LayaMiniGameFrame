import LevelConfigProxy from "../../dMyGame/ConfigProxy/LevelConfigProxy";
import OtherLevelConfigProxy from "../../dMyGame/ConfigProxy/OtherLevelConfigProxy";
import { LevelConfig } from "../../dMyGame/_config/LevelConfig";
import { OtherLevelConfig } from "../../dMyGame/_config/OtherLevelConfig";

/**
 * 框架依赖的关卡配置文件
 */
export default class FrameLevelConfig {
    /**
     * 根据关卡id获取关卡数据
     * @param _id 关卡id
     */
    public static byLevelIdGetLevelData(_id: number): IFrameLevelData {
        let _levelConfigData: LevelConfig.config = LevelConfigProxy.instance.byIdGetData(_id);
        return this.getLevelData(_id.toString(), _levelConfigData.sceneName, _levelConfigData.sceneOtherRes);
    }

    /**
     * 通过其他关卡名字获取关卡数据
     * @param _name 关卡名字
     */
    public static byLevelNameGetOtherLevelData(_name: string): IFrameLevelData {
        let _levelConfigData: OtherLevelConfig.config = OtherLevelConfigProxy.instance.byNameGetData(_name);
        return this.getLevelData(_name, _levelConfigData.sceneName, _levelConfigData.sceneOtherRes);
    }

    //获取关卡数据
    private static getLevelData(_sceneKey: string, _sceneName: string, _sceneOtherRes: string): IFrameLevelData {
        //格式化，去空格和首尾逗号
        _sceneName.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
        _sceneOtherRes.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
        return {
            sceneKey: _sceneKey,
            sceneName: _sceneName.split(','),
            sceneOtherRes: _sceneOtherRes.split(','),
        };
    }
}

/**
 * 框架依赖的关卡数据
 */
export interface IFrameLevelData {
    /** 关卡唯一键值 */
    readonly sceneKey: string;

    /** 关卡名字列表 */
    readonly sceneName: string[],

    /** 关卡其他资源名字列表 */
    readonly sceneOtherRes: string[],
}