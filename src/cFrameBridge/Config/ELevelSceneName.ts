/**
 * 关卡场景名字枚举列表，必须共用一套预制体
 */
export enum ELevelSceneName {
    /** 默认导出关卡场景 */
    Export = 'export',
}

/**
 * 关卡场景配置类
 */
export default class LevelSceneNameConst {
    /** 默认关卡场景名字 */
    public static get defaultLevelSceneName(): ELevelSceneName {
        return ELevelSceneName.Export;
    }
}