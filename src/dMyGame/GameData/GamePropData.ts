import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的道具数据
 */
export default class GamePropData extends RootLocalStorageData {
    /** 金币数量 */
    public coinCount: number = 0;
}