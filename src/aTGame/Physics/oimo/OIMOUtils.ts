/**
 * OIMO物理工具
 */
export default class OIMOUtils {
    /**
     * OIMO物理向量转laya向量
     * @param _v3 OIMO物理向量
     */
    public static OIMOV3TurnLayaV3(_v3: OIMO.Vec3): Laya.Vector3 {
        return new Laya.Vector3(_v3.x, _v3.y, _v3.z);
    }

    /**
     * laya向量转OIMO物理向量
     * @param _v3 Laya物理向量
     */
    public static LayaV3TurnOIMOV3(_v3: Laya.Vector3): OIMO.Vec3 {
        return new OIMO.Vec3(_v3.x, _v3.y, _v3.z);
    }

    /**
     * OIMO物理向量转到一个Laya向量上
     * @param _v3 
     * @param _outV3 
     */
    public static OIMOV3ToLayaV3(_v3: OIMO.Vec3, _outV3: Laya.Vector3) {
        _outV3.setValue(_v3.x, _v3.y, _v3.z);
    }

    /**
     * Laya向量转到一个OIMO物理向量上
     * @param _v3 
     * @param _outV3 
     */
    public static LayaV3ToOIMOV3(_v3: Laya.Vector3, _outV3: OIMO.Vec3) {
        _outV3.set(_v3.x, _v3.y, _v3.z);
    }
}