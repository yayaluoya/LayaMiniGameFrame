import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的道具数据
 */
export default class GamePropData extends RootLocalStorageData {
    /** 返回一个副本 */
    public clone(): GamePropData {
        return JSON.parse(JSON.stringify(this));
    }

    /** 金币数量 */
    public coinCount: number = 0;
}