import LevelConfigProxy from "../../dMyGame/ConfigProxy/LevelConfigProxy";
import { LevelConfig } from "../../dMyGame/_config/LevelConfig";

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
        let _sceneName: string = _levelConfigData.sceneName;
        let _sceneOtherRes: string = _levelConfigData.sceneOtherRes;
        //格式化，去空格和首尾逗号
        _sceneName.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
        _sceneOtherRes.replace(/\s+/g, '').replace(/^,+/, '').replace(/,+$/, '').replace(/,+/g, ',');
        return {
            sceneName: _sceneName.split(','),
            sceneOtherRes: _sceneOtherRes.split(','),
        };
    }
}

/**
 * 框架依赖的关卡数据
 */
export interface IFrameLevelData {
    /** 关卡名字列表 */
    readonly sceneName: string[],

    /** 关卡其他资源名字列表 */
    readonly sceneOtherRes: string[],
}