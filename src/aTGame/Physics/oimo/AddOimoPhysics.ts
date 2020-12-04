import { OimoBaseShape } from './ShapeData/OimoBaseShape';
import { OimoBoxShape } from './ShapeData/OimoBoxShape';
import { OimoManager } from "./OimoManager";
import { OimoSphereShape } from './ShapeData/OimoSphereShape';
import ValueConst from '../../../dMyGame/Common/ValueConst';
import CommonPhysicsUtils from '../common/CommonPhysicsutils';
import { OimoItemScr } from './OimoItemScr';
/**
 * 添加 Oimo 物理
 */
export default class AddOimoPhysics {

    /**
     * 为一个精灵添加 BlendOIMO 物理组件
     * @param _spr 添加物理的节点
     * @param _physicsSpr 获取物理的节点，默认是添加物理的节点
     */
    public static addBlendOimo(_spr: Laya.Sprite3D, _physicsSpr: Laya.Sprite3D = _spr, _isMove: boolean = true, _update: boolean = true, _reverseUpdate: boolean = false, _isKinematic: boolean = false, _density: number = 10, _ifKeepMesh: boolean = true, _diaphaneity: number = 1): OimoItemScr {
        let shapes: OimoBaseShape[] = [];
        let shape: OimoBaseShape;
        let scale: Laya.Vector3;//缩放
        let cc: Laya.Sprite3D;
        //添加碰撞形状列表
        for (let j = 0; j < _physicsSpr.numChildren; j++) {
            //删除mesh
            cc = _physicsSpr.getChildAt(j) as Laya.Sprite3D;
            scale = cc.transform.localScale;
            shape = null;
            //盒子
            if (/cube/i.test(cc.name)) {
                shape = new OimoBoxShape(cc.transform.localPosition, cc.transform.rotationEuler, cc.transform.getWorldLossyScale());
            }
            //球
            else if (/sphere/i.test(cc.name)) {
                shape = new OimoSphereShape(0.5, cc.transform.position, cc.transform.getWorldLossyScale());
            }
            //什么都不是
            else {
                continue;
            }
            if (shape) {
                shapes.push(shape);
            }
            //设置物理网格
            CommonPhysicsUtils.setPhysicsMesh(cc, _ifKeepMesh, _diaphaneity);
        }
        //添加 Oimo组件
        let ot: OimoItemScr;
        //检测物体是否有该组件
        ot = _spr.getComponent(OimoItemScr);
        if (!ot) {
            ot = _spr.addComponent(OimoItemScr) as OimoItemScr;
        }
        ot.rig = OimoManager.instance.CreateCompoundRig(_spr.transform, shapes, _isMove, _update, _reverseUpdate, _isKinematic, _density);
        //
        //返回数据
        return ot;
    }

    /**
     * 为一个精灵添加 BoxOimo 组件
     * @param _spr 添加物理的节点
     * @param _physicsSpr 获取物理的节点，默认是添加物理的节点
     */
    public static addBoxOimo(_spr: Laya.Sprite3D, _physicsSpr: Laya.Sprite3D = _spr, _isMove: boolean = true, _update: boolean = true, _reverseUpdate: boolean = false, _isKinematic: boolean = false, _density: number = 10, _ifKeepMesh: boolean = false, _diaphaneity: number = 1): OimoItemScr {
        //
        return this.addBoxOimoByParam(_spr, _physicsSpr.transform.rotationEuler, _physicsSpr.transform.getWorldLossyScale(), _isMove, _update, _reverseUpdate, _isKinematic, _density, _ifKeepMesh, _diaphaneity);
    }

    /**
     * 根据自定义参数添加BOX物理
     * @param _spr 当前精灵
     * @param _rotationEuler 旋转值
     * @param _worldLossyScale 世界缩放值
     */
    public static addBoxOimoByParam(_spr: Laya.Sprite3D, _rotationEuler: Laya.Vector3, _worldLossyScale: Laya.Vector3, _isMove: boolean = true, _update: boolean = true, _reverseUpdate: boolean = false, _isKinematic: boolean = false, _density: number = 10, _ifKeepMesh: boolean = false, _diaphaneity: number = 1): OimoItemScr {
        //添加oimo
        let ot: OimoItemScr;
        //检测物体是否有该组件
        ot = _spr.getComponent(OimoItemScr);
        if (!ot) {
            ot = _spr.addComponent(OimoItemScr) as OimoItemScr;
        }
        let shape: OimoBaseShape = new OimoBoxShape(ValueConst.zeroV3, _rotationEuler, _worldLossyScale);
        ot.rig = OimoManager.instance.CreateCompoundRig(_spr.transform, [shape], _isMove, _update, _reverseUpdate, _isKinematic, _density);
        //设置物理网格
        CommonPhysicsUtils.setPhysicsMesh(_spr, _ifKeepMesh, _diaphaneity);
        //返回数据
        return ot;
    }

    /**
     * 为一个精灵添加 SphereOimo 组件
     * @param _spr 添加物理的节点
     * @param _physicsSpr 获取物理的节点，默认是添加物理的节点
     */
    public static addSphereOimo(_spr: Laya.Sprite3D, _physicsSpr: Laya.Sprite3D = _spr, _isMove: boolean = true, _update: boolean = true, _reverseUpdate: boolean = false, _isKinematic: boolean = false, _density: number = 10, _ifKeepMesh: boolean = false, _diaphaneity: number = 1): OimoItemScr {
        //添加oimo
        let ot: OimoItemScr;
        //检测物体是否有该组件
        ot = _spr.getComponent(OimoItemScr);
        if (!ot) {
            ot = _spr.addComponent(OimoItemScr) as OimoItemScr;
        }
        let shape: OimoBaseShape = new OimoSphereShape(0.5, _physicsSpr.transform.position, _physicsSpr.transform.getWorldLossyScale());
        ot.rig = OimoManager.instance.CreateCompoundRig(_physicsSpr.transform, [shape], _isMove, _update, _reverseUpdate, _isKinematic, _density);
        //设置物理网格
        CommonPhysicsUtils.setPhysicsMesh(_physicsSpr, _ifKeepMesh, _diaphaneity);
        //返回数据
        return ot;
    }
}