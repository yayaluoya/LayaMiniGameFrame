import V3Utils from "../Utils/V3Utils";

/**
 * 场景配置表
 */
export interface ISceneConfig {
    root: any;
    zip: boolean;
}

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
    differ: IPrefabsDiffer;
}
/**
 * 预制体差异
 */
interface IPrefabsDiffer {
    index: number;
    position: string;
    euler: string;
    scale: string;
    child: IPrefabsDiffer[];
}

/**
 * 预制体集合
 */
export interface IPrefabsGather {
    [_prefabsName: string]: Laya.Sprite3D[];
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
            _spr.transform.localPosition.setValue(0, 0, 0);
        } else {
            V3Utils.parseVector3(_target.position, _spr.transform.localPosition);
        }
        _spr.transform.localPosition = _spr.transform.localPosition;
        //设置旋转
        if (!_target.euler) {
            //默认旋转
            _spr.transform.localRotationEuler.setValue(0, 0, 0);
        } else {
            V3Utils.parseVector3(_target.euler, _spr.transform.localRotationEuler);
        }
        _spr.transform.localRotationEuler = _spr.transform.localRotationEuler;
        //设置缩放
        if (!_target.scale) {
            //默认缩放
            _spr.transform.localScale.setValue(1, 1, 1);
        } else {
            V3Utils.parseVector3(_target.scale, _spr.transform.localScale);
        }
        _spr.transform.localScale = _spr.transform.localScale;
        //设置差异
        _target = _target as IScenePrefab;
        if (_target.prefabName != "undefined") {
            if (_target.differ) {
                this.setDiffer(_spr, _target.differ);
            }
        }
    }

    private static _centreV3: Laya.Vector3 = new Laya.Vector3();
    /**
     * 设置一个精灵和源精灵的差异
     * @param _spr 精灵
     * @param _differ 差异数据
     */
    private static setDiffer(_spr: Laya.Sprite3D, _differ: IPrefabsDiffer) {
        // console.log('设置差异', _spr, _differ);
        if (_differ.child) {
            for (let _diff of _differ.child) {
                this.setDiffer(_spr.getChildAt(_diff.index) as Laya.Sprite3D, _diff);
            }
        }
        //
        if (_differ.position) {
            V3Utils.parseVector3(_differ.position, this._centreV3);
            Laya.Vector3.add(_spr.transform.localPosition, this._centreV3, this._centreV3);
            this._centreV3.cloneTo(_spr.transform.localPosition);
            _spr.transform.localPosition = _spr.transform.localPosition;
        }
        if (_differ.euler) {
            V3Utils.parseVector3(_differ.euler, this._centreV3);
            Laya.Vector3.add(_spr.transform.localRotationEuler, this._centreV3, this._centreV3);
            this._centreV3.cloneTo(_spr.transform.localRotationEuler);
            _spr.transform.localRotationEuler = _spr.transform.localRotationEuler;
        }
        if (_differ.scale) {
            V3Utils.parseVector3(_differ.scale, this._centreV3);
            Laya.Vector3.add(_spr.transform.localScale, this._centreV3, this._centreV3);
            this._centreV3.cloneTo(_spr.transform.localScale);
            _spr.transform.localScale = _spr.transform.localScale;
        }
    }
}