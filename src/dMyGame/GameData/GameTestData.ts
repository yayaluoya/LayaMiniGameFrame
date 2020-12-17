import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的测试数据
 */
export default class GameTestData extends RootLocalStorageData {
    /** 返回一个副本 */
    public clone(): GameTestData {
        return JSON.parse(JSON.stringify(this));
    }

    public testNumber: number = 0;

    public testBoolean: boolean = false;

    public testArray: string[] = [];

    public testObject: object = {
        a: 0,
        b: 0,
    };
}