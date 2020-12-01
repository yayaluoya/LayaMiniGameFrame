import V3Utils from "../Utils/V3Utils";

/**
 * 节点
 */
export interface ISceneNode {
    name: string;
    child: ISceneNode[] | IScenePrefab[];
    position: string;
    euler: string;
    scale: string;
}

/**
 * 预制体
 */
export interface IScenePrefab {
    name: string;
    prefabName: string;
    position: string;
    euler: string;
    scale: string;
}

/**
 * 场景实用工具类
 */
export default class SceneUtils {
    /**
     * 根据spr精灵初始化节点
     * @param _spr 精灵
     * @param _target 目标节点
     */
    public static initNode(_spr: Laya.Sprite3D, _target: ISceneNode | IScenePrefab) {
        _spr.name = _target.name;
        //设置位置
        if (!_target.position) {
            //默认位置
            _spr.transform.localPosition = new Laya.Vector3(0, 0, 0);
        } else {
            _spr.transform.localPosition = V3Utils.parseVector3(_target.position);
        }
        //设置旋转
        if (!_target.euler) {
            //默认旋转
            _spr.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        } else {
            _spr.transform.localRotationEuler = V3Utils.parseVector3(_target.euler);
        }
        //设置缩放
        if (!_target.scale) {
            //默认缩放
            _spr.transform.localScale = new Laya.Vector3(1, 1, 1);
        } else {
            _spr.transform.localScale = V3Utils.parseVector3(_target.scale)
        }
    }
}