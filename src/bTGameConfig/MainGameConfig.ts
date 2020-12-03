/**
 * 游戏最高层不需要配表的配置
 */
export default class MainGameConfig {
    /** 支持2D */
    public static support2D: boolean = false;

    /** 支持3D */
    public static support3D: boolean = true;

    /** 是否开启oimo物理 */
    public static ifAddOimoSystem: boolean = false;

    /** 是否开启测试类 */
    public static ifTest: boolean = false;
}