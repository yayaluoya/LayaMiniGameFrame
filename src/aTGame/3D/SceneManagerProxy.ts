import SceneUtils from "./SceneUtils";

/**
 * SceneManager类代理类
 */
export default class SceneManagerProxy {
    //关卡配置信息
    private static m_sevelConfig: {} = {};

    /** 设置关卡配置信息 */
    public static set sevelConfig(_data: {}) {
        this.m_sevelConfig = _data;
    }

    /**
     * 根据场景配置数据初始化相机参数
     * @param camera 相机
     */
    public static initCamera(camera: Laya.Camera) {
        let cameraData = this.m_sevelConfig["camera"];
        if (cameraData) {
            SceneUtils.initNode(camera, cameraData);
        }
    }

    /**
     * 根据场景配置数据初始化灯光参数
     * @param light 灯光
     */
    public static initLight(light: Laya.DirectionLight) {
        let lightData = this.m_sevelConfig["light"];
        if (lightData) {
            SceneUtils.initNode(light, lightData);
        }
    }
}