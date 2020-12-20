import { OimoSystem } from '../Physics/oimo/OimoSystem';
import GlobalUnitClassProxy from "./GlobalUnitClassProxy";
import SceneManagerProxy from "./SceneManagerProxy";
import MainGameConfig from '../../bTGameConfig/MainGameConfig';
import ConsoleEx from '../Console/ConsoleEx';
import EnvironmentDebug from '../Debug/EnvironmentDebug';
/**
 * 全局3D类
 */
export default class Global3D {

    /** 3d场景 */
    public static s3d: Laya.Scene3D;

    /** 摄像机 */
    public static camera: Laya.Camera;

    /** 灯光 */
    public static light: Laya.DirectionLight;

    /**
     * 场景初始化
     */
    public static InitAll() {
        //判断是否支持3D
        if (MainGameConfig.support3D) {
            this.s3d = Laya.stage.addChildAt(new Laya.Scene3D(), 0) as Laya.Scene3D;
            this.camera = new Laya.Camera();
            this.s3d.addChild(this.camera);
            SceneManagerProxy.initCamera(this.camera);
            this.light = new Laya.DirectionLight;
            this.s3d.addChild(this.light);
            SceneManagerProxy.initLight(this.light);
            //
            //查看是否添加oimo物理
            if (MainGameConfig.ifAddOimoSystem) {
                this.addOimoSystem();
            }
            //设置代理类代理数据
            GlobalUnitClassProxy.s3d = this.s3d;
            GlobalUnitClassProxy.camera = this.camera;
            GlobalUnitClassProxy.light = this.light;
            //添加环境调试
            EnvironmentDebug.instance.s3d = this.s3d;
            EnvironmentDebug.instance.camera = this.camera;
            EnvironmentDebug.instance.light = this.light;
        } else {
            //
            console.log(...ConsoleEx.packLog('请设置支持3D!'));
        }
    }

    //添加oimo物理
    private static addOimoSystem() {
        //使用新物理系统
        let oimoNode: Laya.Sprite3D = new Laya.Sprite3D();
        this.s3d.addChild(oimoNode);
        oimoNode.addComponent(OimoSystem);
    }
}