import RootGameData from "./RootGameData";

/**
 * 本地保存数据基类
 * 会同步项目的版本
 */
export default class RootLocalStorageData extends RootGameData {
    /** 返回一个副本 */
    public clone(): RootLocalStorageData {
        return JSON.parse(JSON.stringify(this));
    }
}