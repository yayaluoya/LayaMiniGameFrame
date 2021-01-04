import BaseProScript from '../z_T/scr/BaseProScript';
import CameraPro from '../d_SpecialPro/CameraPro';
/**
 * 相机脚本
 */
export default class CameraScr extends BaseProScript<CameraPro, any>{
    private m_cameraNode: Laya.Sprite3D;//摄像机节点
    //
    private m_transform: Laya.Transform3D;//自身变换
    private m_cameraNodeTransform: Laya.Transform3D;//节点变换
    //

    /** 设置节点 */
    public set cameraNode(_spr: Laya.Sprite3D) {
        this.m_cameraNode = _spr;
        this.m_cameraNodeTransform = _spr.transform;
    }

    public onAwake() {
        //
        this.m_transform = (this.owner as Laya.Sprite3D).transform;
    }

    //每帧执行
    public onUpdate() {
        //
    }
}