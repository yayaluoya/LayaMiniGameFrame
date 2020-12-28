import { HeightFogManager } from './HeightFogManager';
import { LTBlinnPhong_HeightFog } from './LTBlinnPhong_HeightFog';
import ColorUtils from '../../Utils/ColorUtils';
/**
 * 高度雾工具
 */
export default class HeightFogUtils {
    /**
     * 加高度雾效
     * @param _cubes 物体
     * @param _color 颜色
     * @param _distance 距离
     * @param _startHeight 开始高度
     */
    public static addHightFog(_cubes: Laya.Sprite3D[], _color: string, _distance: number, _startHeight: number) {
        HeightFogManager.instance.fogColor = ColorUtils.HexToV3(_color);
        HeightFogManager.instance.fogDistance = _distance;
        HeightFogManager.instance.fogStartHeight = _startHeight;
        //
        for (let _o of _cubes) {
            this._addHightFog(_o);
        }
    }
    private static _addHightFog(_o: Laya.Sprite3D) {
        let _shareMat: LTBlinnPhong_HeightFog;
        let _getChild: Laya.MeshSprite3D;
        for (let i = 0; i < _o.numChildren; i++) {
            _getChild = _o.getChildAt(i) as Laya.MeshSprite3D;
            if (_getChild) {
                _shareMat = _shareMat || LTBlinnPhong_HeightFog.CreateFromBlinnPhong(_getChild.meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial);
                _getChild.meshRenderer.sharedMaterial = _shareMat;
            }
            //判断是否还有子节点
            if (_getChild.numChildren > 0) {
                this._addHightFog(_getChild);
            }
        }
    }
}

/**
 * # 坑
 * 如果_startHeight低于该物体的高度了就不会显示
 */