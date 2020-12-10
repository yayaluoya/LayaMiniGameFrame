import LevelSceneNameConst, { ELevelSceneName } from "../../cFrameBridge/Config/ELevelSceneName";
import SceneUtils, { ISceneNode } from "./SceneUtils";

/**
 * SceneManager类代理类
 */
export default class SceneManagerProxy {
    //关卡配置信息
    private static m_sevelConfig: {
        [_index: string]: { [index: string]: ISceneNode },
    } = {};

    /** 设置关卡配置信息 */
    public static set sevelConfig(_data: {
        [_index: string]: { [index: string]: ISceneNode },
    }) {
        this.m_sevelConfig = _data;
    }

    /**
     * 根据场景配置数据初始化相机参数
     * @param camera 相机
     * @param _sceneName 场景名
     */
    public static initCamera(camera: Laya.Camera, _sceneName: ELevelSceneName = LevelSceneNameConst.defaultLevelSceneName) {
        let cameraData = this.m_sevelConfig[_sceneName]["camera"];
        if (cameraData) {
            SceneUtils.initNode(camera, cameraData);
        }
    }

    /**
     * 根据场景配置数据初始化灯光参数
     * @param light 灯光
     * @param _sceneName 场景名
     */
    public static initLight(light: Laya.DirectionLight, _sceneName: ELevelSceneName = LevelSceneNameConst.defaultLevelSceneName) {
        let lightData = this.m_sevelConfig[_sceneName]["light"];
        if (lightData) {
            SceneUtils.initNode(light, lightData);
        }
    }
}