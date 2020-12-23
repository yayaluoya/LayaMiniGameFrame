import IRootManager from '../../aTGame/Manager/IRootManager';
import { EEventScene } from '../EventEnum/EEventScene';
import GameShortDataProxy from '../GameData/GameShortDataProxy';
import MesManager from './MesManager';
/**
 * 游戏管理器
 */
export default class GameManager implements IRootManager {
    //
    private static m_instance: GameManager;
    /** 单例 */
    public static get instance(): GameManager {
        if (!this.m_instance) {
            this.m_instance = new GameManager();
        }
        return this.m_instance;
    }
    //
    private constructor() { }

    /**
     * 初始化
     */
    public init() {
        MesManager.instance.onEvent(EEventScene.GameLevelsBuildBefore, this, this.gameLevelsBuildBefore);
        MesManager.instance.onEvent(EEventScene.GameLevelsOnBuild, this, this.gameLevelsOnBuild);
        MesManager.instance.onEvent(EEventScene.GameLevelsDelete, this, this.gameLevelsDelete);
        MesManager.instance.onEvent(EEventScene.GameStart, this, this.gameStart);
    }

    //游戏关卡构建之前调用
    private gameLevelsBuildBefore() {
        //清空临时数据
        GameShortDataProxy.emptyGameOnCustomData();
    }

    //游戏关卡构建完成调用
    private gameLevelsOnBuild() {
        //
    }

    //关卡清除时调用
    private gameLevelsDelete() {
        //
    }

    //游戏开始
    private gameStart() {
        //
    }
}