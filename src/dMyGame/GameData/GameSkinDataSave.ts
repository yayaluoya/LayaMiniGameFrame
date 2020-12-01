import RootLocalStorageSave from '../../aTGame/Data/RootLocalStorageSave';
import GameSkinData from './GameSkinData';


/**
 * 皮肤数据保存类
 */
export default class GameSkinDataSave extends RootLocalStorageSave<GameSkinData>{
    private _saveData: GameSkinData; // 需要保存的数据
    //
    private static _instance: GameSkinDataSave;
    /** 单例 */
    public static get instance(): GameSkinDataSave {
        if (this._instance == null) {
            this._instance = new GameSkinDataSave();
        }
        //
        return this._instance;
    }

    /** 不允许外界实例化 */
    private constructor() {
        super();
    }

    /** 获取保存名称 */
    protected get _saveName(): string {
        return "->GameSkinData<-";
    }

    // 初始化
    public InitData() {
        this._saveData = this._ReadFromFile();
    }

    /**
     * 获取当前游戏临时数据的副本
     */
    public static get skinData(): GameSkinData {
        //
        return this._instance._saveData.clone();
    }

    // ** -------------------------------------------------------------------------------------- ** //

    // ** -------------------------------------------------------------------------------------- ** //

    //获取一个新的数据
    protected getNewData(): GameSkinData {
        return new GameSkinData();
    }

    /**
     * 保存到本地 （改变本地数据时调用）
     */
    public static SaveToDisk() {
        this._instance._SaveToDisk(this._instance._saveData);
    }
}