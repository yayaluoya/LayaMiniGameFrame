import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的测试数据
 */
export default class GameTestData extends RootLocalStorageData {
    /** 返回一个副本 */
    public clone(): GameTestData {
        return JSON.parse(JSON.stringify(this));
    }

    /** 测试数值 */
    public testNumber: number = 0;

    /** 测试布尔值 */
    public testBoolean: boolean = false;

    /** 测试数组 */
    public testArray: string[] = [];

    /** 测试对象 */
    public testObject: object = {
        a: 0,
        b: 0,
        c: 0,
    };
}