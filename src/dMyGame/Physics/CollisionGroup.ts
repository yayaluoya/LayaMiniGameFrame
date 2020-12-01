/**
 * 所属碰撞组
 */
export default class CollisionGroup {
    //普通物理
    static readonly Ray: number = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//射线
    static readonly BeRayDetected: number = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2;//被射线检测
}

/**
 * 可碰撞的碰撞组
 */
export class CanCollideWith {
    /** 射线 */
    static get RayCan(): number {
        return CollisionGroup.BeRayDetected;
    }

    /** 被射线检测 */
    static get BeRayDetectedCan(): number {
        return CollisionGroup.Ray;
    }
}