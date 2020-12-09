import Physics3DUtilsEX from "../../aTGame/Physics/Laya/Physics3DUtilsEX";

/**
 * 所属碰撞组
 */
export default class OimoCollisionGroup {
    //普通物理
    static readonly NULL: number = Physics3DUtilsEX.COLLISIONFILTERGROUP_CUSTOMFILTER0;//空，不与任何物体产生碰撞
}

/**
 * 可碰撞的碰撞组
 */
export class OimoCanCollideWith {
    //
}