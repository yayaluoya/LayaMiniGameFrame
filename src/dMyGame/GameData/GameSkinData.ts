import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的皮肤数据
 */
export default class GameSkinData extends RootLocalStorageData {
    /** 返回一个副本 */
    public clone(): GameSkinData {
        return JSON.parse(JSON.stringify(this));
    }
}