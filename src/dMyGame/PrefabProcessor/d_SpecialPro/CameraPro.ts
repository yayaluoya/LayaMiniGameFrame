import BasePrefabPro from '../z_T/pro/BasePrefabPro';
import CameraScr from '../b_Script/CameraScr';
import ValueConst from '../../Common/ValueConst';
import EnvironmentManager from '../../Manager/EnvironmentManager';
import ConsoleEx from '../../../aTGame/Console/ConsoleEx';
/**
 * 摄像机加工者
 */
export default class CameraPro extends BasePrefabPro {
    //
    protected ifAddProStampScript: boolean = false;//是否添加工厂印记
    private m_camera: Laya.Camera;//摄像机
    private m_cameraNode: Laya.Sprite3D;//摄像机外围节点
    private m_retainNode: Laya.Sprite3D;//销毁场景时保留的节点
    private m_rootPos: Laya.Vector3;//摄像机原始位置
    private m_rootAng: Laya.Vector3;//摄像机原始旋转
    private m_Scr: CameraScr;//摄像机脚本

    /**
     * 销毁场景时保留摄像机
     */
    public retainVidicon() {
        if (!this.m_retainNode) {
            this.m_retainNode = new Laya.Sprite3D();
        }
        //
        this.m_retainNode.addChild(this.m_cameraNode);
    }

    //物体初始化完成后的生命周期函数
    protected sprInit() {
        if (!this.m_camera) {
            if (!this.m_sprList[0]) {
                console.log(...ConsoleEx.packError('没有找到摄像机!'));
            }
            //
            this.m_camera = this.m_sprList[0] as Laya.Camera;
            this.m_cameraNode = new Laya.Sprite3D();
            this.m_rootPos = this.m_camera.transform.position.clone();
            this.m_rootAng = this.m_camera.transform.rotationEuler.clone();
            this.m_rootAng.x = -this.m_rootAng.x;
            this.m_rootAng.y = this.m_rootAng.y - 180;
            this.m_cameraNode.addChild(this.m_camera);
            this.m_camera.transform.localPosition = ValueConst.zeroV3;
            this.m_camera.transform.localRotationEuler = new Laya.Vector3(0, -180, 0);
            //给摄像机添加脚本
            this.m_Scr = this.addScript<CameraScr>(this.m_camera, CameraScr);
            //设置节点
            this.m_Scr.cameraNode = this.m_cameraNode;
        }
        //添加到根节点
        EnvironmentManager.instance.s3d.addChild(this.m_cameraNode);
        //回到初始位置
        this.m_cameraNode.transform.position = this.m_rootPos;
        //回到初始旋转
        this.m_cameraNode.transform.rotationEuler = new Laya.Vector3(this.m_rootAng.x, this.m_rootAng.y, 0);
        //初始化
        this.m_Scr.init();
    }
}