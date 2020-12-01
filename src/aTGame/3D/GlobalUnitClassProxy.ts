import RootClassProxy from "../Root/RootClassProxy";

/**
 * 全局内容类代理
 */
export default class GlobalUnitClassProxy extends RootClassProxy {
    /** 3d场景 */
    public static s3d: Laya.Scene3D;

    /** 摄像机 */
    public static camera: Laya.Camera;

    /** 灯光 */
    public static light: Laya.DirectionLight;
}