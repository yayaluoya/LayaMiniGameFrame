import _PrefabsPrefabName from "../_prefabsName/_PrefabsPrefabNames";
import { _PrefabsPrefabClass } from "../_prefabsName/_PrefabsPrefabNames";

/**
 * 所有预制体名字
 */
export default class PrefabNames extends _PrefabsPrefabName {
    //* 默认预制体
    public static readonly Camera: string = 'camera';//相机
    public static readonly Environment: string = 'environment';//环境
    public static readonly HeightFog: string = 'heightFog';//高度雾效
    //
}


/**
 * 预制体集类
 */
export class PrefabsGather extends _PrefabsPrefabClass {
    //
}