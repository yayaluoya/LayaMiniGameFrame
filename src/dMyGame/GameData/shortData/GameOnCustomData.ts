import RootGameData from "../../../aTGame/Data/RootGameData";

/**
 * 当前关卡数据
 */
export default class GameOnCustomData extends RootGameData {
    /** 返回一个副本 */
    public clone(): GameOnCustomData {
        return JSON.parse(JSON.stringify(this));
    }
    //
}