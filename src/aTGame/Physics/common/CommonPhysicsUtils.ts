/**
 * 公共物理工具
 */
export default class CommonPhysicsUtils {
    /**
     * 设置物理网格的显示
     * @param _spr 精灵
     * @param _ifKeepMesh 是否显示网格 
     */
    public static setPhysicsMesh(_spr: Laya.Sprite3D, _ifKeepMesh: boolean = false, _diaphaneity: number = 1) {
        //删除所有子物体
        _spr.removeChildren();
        //
        if (_spr instanceof Laya.MeshSprite3D) {
            let _mesh: Laya.MeshSprite3D = _spr as Laya.MeshSprite3D;
            _mesh.meshRenderer.enable = _ifKeepMesh;
            if (_ifKeepMesh) {
                let _m: Laya.BlinnPhongMaterial = _mesh.meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial;
                if (_diaphaneity >= 1) {
                    //设置渲染模式
                    _m.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_OPAQUE;
                }
                else {
                    //设置渲染模式
                    _m.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
                    //设置透明度
                    _m.albedoColorA = _diaphaneity;
                }
            }
        }
    }
}