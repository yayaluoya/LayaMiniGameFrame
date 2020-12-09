import Physics3DUtilsEX from "../../aTGame/Physics/Laya/Physics3DUtilsEX";

/**
 * 所属碰撞组
 */
export default class CollisionGroup {
    //普通物理
    static readonly NULL: number = Physics3DUtilsEX.COLLISIONFILTERGROUP_CUSTOMFILTER0;//空，不与任何物体产生碰撞
    static readonly Ray: number = Physics3DUtilsEX.COLLISIONFILTERGROUP_CUSTOMFILTER1;//射线
    static readonly BeRayDetected: number = Physics3DUtilsEX.COLLISIONFILTERGROUP_CUSTOMFILTER2;//被射线检测
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