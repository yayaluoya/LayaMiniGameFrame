import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的新手引导数据
 */
export default class GameNewHandData extends RootLocalStorageData {
    /** 返回一个副本 */
    public clone(): GameNewHandData {
        return JSON.parse(JSON.stringify(this));
    }
}