/**
 * Prefabs 场景的所有预制体名字
 * ! 此文件是Unnity自动导出的，不要修改，也不要直接依赖。
 */
export default class _PrefabsPrefabName {
    //所有预制体
    //---->
    public static readonly Camera: string = 'Camera';
    public static readonly DirectionalLight: string = 'DirectionalLight';
    public static readonly Cube: string = 'Cube';
    public static readonly Sphere: string = 'Sphere';
    public static readonly Cylinder: string = 'Cylinder';
    //所有隐藏的节点都会当成注释，分类除外

}

/**
 * Prefabs 场景的所有预制体名字分类
 */
export class _PrefabsPrefabClass { 
    
    /**
    * 测试分类
    */
    public static get GetDebugClass(): string[] {
        //返回数据
        return [
            'Cube',
            'Sphere',
            'Cylinder',
        ];
    }

}
//