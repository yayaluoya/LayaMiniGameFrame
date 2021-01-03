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
        return this.getLevelData('ID', _levelConfigData.id, _levelConfigData.sceneName, _levelConfigData.sceneOtherRes, _levelConfigData.rootScene);
    }

    /**
     * 通过其他关卡名字获取关卡数据
     * @param _name 关卡名字
     */
    public static byLevelNameGetOtherLevelData(_name: string): IFrameLevelData {
        let _levelConfigData: OtherLevelConfig.config = OtherLevelConfigProxy.instance.byNameGetData(_name);
        return this.getLevelData('Name', _levelConfigData.id, _levelConfigData.sceneName, _levelConfigData.sceneOtherRes, _levelConfigData.rootScene);
    }

    //获取关卡数据
    private static getLevelData(_key: string, _id: number, _sceneName: string, _sceneOtherRes: string, _rootScene: string): IFrameLevelData {
        //格式化，去空格和首尾逗号
        _sceneName.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
        _sceneOtherRes.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
        return {
            key: '$' + _rootScene + ':' + _key + '-' + _id + '-' + _sceneName,
            rootScene: _rootScene,
            sceneName: _sceneName.split(','),
            sceneOtherRes: _sceneOtherRes.split(','),
        };
    }
}

/**
 * 框架依赖的关卡数据
 */
export interface IFrameLevelData {
    /** 唯一键值 */
    readonly key: string;

    /** 根场景名字 */
    readonly rootScene: string;

    /** 关卡名字列表 */
    readonly sceneName: string[],

    /** 关卡其他资源名字列表 */
    readonly sceneOtherRes: string[],
}