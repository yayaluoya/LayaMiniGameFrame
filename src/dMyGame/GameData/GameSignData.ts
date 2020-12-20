import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的签到数据
 */
export default class GameSignData extends RootLocalStorageData {
    /** 是否签到 */
    public ifSignIn: boolean = false;

    /** 是否是第一天 */
    public ifOneDay: boolean = false;
}