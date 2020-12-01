import RootGameData from "./RootGameData";

/**
 * 本地保存数据基类
 * 会同步项目的版本
 */
export default class RootLocalStorageData extends RootGameData {
    /** 游戏名字 */
    public GameName: string;
    /** 游戏说明 */
    public GameExplain: string;
    /** 数据版本 */
    public versions: string;

    /** 返回一个副本 */
    public clone(): RootLocalStorageData {
        return;
    }
}