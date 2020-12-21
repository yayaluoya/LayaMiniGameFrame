import { ECommonLeve } from "../../aTGame/Commom/CommonLeveEnum";
import RootLocalStorageData from "../../aTGame/Data/RootLocalStorageData";

/**
 * 游戏需要持久化的主要数据
 */
export default class GameData extends RootLocalStorageData {
    /** 最大关卡数量 */
    public maxCustoms: number = 0;

    /** 是否打开背景音乐 */
    public ifOpenBgm: boolean = true;

    /** 是否打开音效 */
    public ifOpenSound: boolean = true;

    /** 是否打开振动 */
    public ifOpenVibrate: boolean = true;

    /** 当前关卡 默认为调试关卡 */
    public onCustoms: number = ECommonLeve.DebugLeveId;

    /** 最大关卡记录 */
    public maxCustomsRecord: number = 1;
}