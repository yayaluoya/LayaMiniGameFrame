import RootDebug from "./RootDebug";

/**
 * 环境调试对象
 */
export default class EnvironmentDebug extends RootDebug {
    protected _name: string = 'Environment';

    //单例
    private static _instance: EnvironmentDebug;
    /** 单例对象 */
    public static get instance(): EnvironmentDebug {
        if (this._instance) {
            return this._instance;
        } else {
            this._instance = new EnvironmentDebug();
            return this._instance;
        }
    }
    //
    private constructor() { super(); }

    /** 3d场景 */
    public s3d: Laya.Scene3D;

    /** 摄像机 */
    public camera: Laya.Camera;

    /** 灯光 */
    public light: Laya.DirectionLight;

    //开启调试
    protected _startDebug() {
        console.log('开启环境调试');
    }
}