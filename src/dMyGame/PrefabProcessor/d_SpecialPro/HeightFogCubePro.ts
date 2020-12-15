import BasePrefabPro from '../z_T/pro/BasePrefabPro';
import { HeightFogManager } from '../../../aTGame/3D/material/HeightFogManager';
import { LTBlinnPhong_HeightFog } from '../../../aTGame/3D/material/LTBlinnPhong_HeightFog';
import ColorUtils from '../../../aTGame/Utils/ColorUtils';
/**
 * 高度雾效加工者
 */
export default class HeightFogCubePro extends BasePrefabPro {
    protected ifAddProStampScript: boolean = false;//是否添加工厂印记
    // 加高度雾小
    // private addHightFog(_color: string){
    //     HeightFogManager.instance.fogColor = ColorUtils.HexToV3(_color);
    //     HeightFogManager.instance.fogDistance = 300;
    //     HeightFogManager.instance.fogStartHeight = 100;
    //     let _shareMat: LTBlinnPhong_HeightFog;
    //     let _cubes: Laya.Sprite3D[] = [];
    //     let _getChild: Laya.MeshSprite3D;
    //     for(let _o of _cubes){
    //         for (let i = 0; i < _o.numChildren; ++i) {
    //             _getChild = _o.getChildAt(i) as Laya.MeshSprite3D;
    //             if(_getChild){
    //                 _shareMat = _shareMat || LTBlinnPhong_HeightFog.CreateFromBlinnPhong(_getChild.meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial);
    //                 _getChild.meshRenderer.sharedMaterial = _shareMat;
    //             }
    //         }
    //     }
    // }
}