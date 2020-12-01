import CommonPhysicsUtils from "../common/CommonPhysicsutils";

/**
 * 添加laya物理
 */
export default class AddPhysicsCollider {
    /**
     * 为一个精灵添加混合碰撞器
     * @param _spr 添加物理的节点
     * @param _physicsSpr 获取物理的节点，默认是添加物理的节点
     */
    public static addBlendPhysicsCollider(_spr: Laya.Sprite3D, _physicsSpr: Laya.Sprite3D = _spr, _isTrigger: boolean = false, _ifKeepMesh: boolean = false, _diaphaneity: number = 1): Laya.PhysicsCollider {
        // let cannonShapes = new Laya.CannonCompoundColliderShape();
        let rigShapes = new Laya.CompoundColliderShape();
        let rigShape: Laya.ColliderShape;
        let scale: Laya.Vector3;//缩放
        let cc: Laya.Sprite3D;
        //添加碰撞形状列表
        for (let j = 0; j < _physicsSpr.numChildren; j++) {
            //删除mesh
            cc = _physicsSpr.getChildAt(j) as Laya.Sprite3D;
            scale = cc.transform.localScale;
            rigShape = null;
            //盒子
            if (/cube/i.test(cc.name)) {
                rigShape = new Laya.BoxColliderShape(scale.x, scale.y, scale.z);
                rigShape.localRotation = cc.transform.localRotation;
            }
            //球
            else if (/sphere/i.test(cc.name)) {
                rigShape = new Laya.SphereColliderShape(scale.x / 2);
            }
            //什么都不是
            else {
                continue;
            }
            if (rigShape) {
                rigShape.localOffset = cc.transform.localPosition;
                // cannonShapes.addChildShape(cannonShape)//, cc.transform.localPosition);
                rigShapes.addChildShape(rigShape);
            }
            //设置网格
            CommonPhysicsUtils.setPhysicsMesh(cc, _ifKeepMesh, _diaphaneity);
        }
        //添加碰撞器
        let r: Laya.PhysicsCollider;
        r = _spr.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        r.colliderShape = rigShapes;
        r.isTrigger = _isTrigger;
        //
        return r;
    }

    /**
     * 为一个精灵添加Box碰撞器
     * @param _spr 添加物理的节点
     * @param _physicsSpr 获取物理的节点，默认是添加物理的节点
     */
    public static addBoxPhysicsCollider(_spr: Laya.Sprite3D, _physicsSpr: Laya.Sprite3D = _spr, _isTrigger: boolean = false, _ifKeepMesh: boolean = false, _diaphaneity: number = 1): Laya.PhysicsCollider {
        //
        let r: Laya.PhysicsCollider;
        r = _spr.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        let scale: Laya.Vector3 = _physicsSpr.transform.localScale;
        let boxs: Laya.BoxColliderShape = new Laya.BoxColliderShape(scale.x, scale.y, scale.z);
        r.colliderShape = boxs;
        r.isTrigger = _isTrigger;
        //
        CommonPhysicsUtils.setPhysicsMesh(_physicsSpr, _ifKeepMesh, _diaphaneity);
        //
        return r;
    }

    /**
     * 为一个精灵添加Sphere碰撞器
     * @param _spr 添加物理的节点
     * @param _physicsSpr 获取物理的节点，默认是添加物理的节点
     */
    public static addSpherePhysicsCollider(_spr: Laya.Sprite3D, _physicsSpr: Laya.Sprite3D = _spr, _isTrigger: boolean = false, _ifKeepMesh: boolean = false, _diaphaneity: number = 1): Laya.PhysicsCollider {
        //
        let r: Laya.PhysicsCollider;
        r = _spr.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        let radius: number = _physicsSpr.transform.localScaleX / 2;
        let ss: Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        r.colliderShape = ss;
        r.isTrigger = _isTrigger;
        //
        CommonPhysicsUtils.setPhysicsMesh(_physicsSpr, _ifKeepMesh, _diaphaneity);
        //
        return r;
    }
}