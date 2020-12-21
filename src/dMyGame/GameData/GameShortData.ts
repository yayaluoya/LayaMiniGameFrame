import RootGameData from "../../aTGame/Data/RootGameData";
import GameOnCustomData from "./shortData/GameOnCustomData";

/**
 * 游戏临时数据类
 */
export default class GameShortData extends RootGameData {
    /** 当前关卡的数据 */
    public onCustomsData: GameOnCustomData = new GameOnCustomData();

    //
}