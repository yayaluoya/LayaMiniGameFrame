import CustomsManager from '../../Manager/CustomsManager';
import UIManager from '../../Manager/UIManager';
import { GlobalStateManager } from '../../Manager/GlobalStateManager';
import GameManager from '../../Manager/GameManager';
import EnvironmentManager from '../../Manager/EnvironmentManager';
import MesManager from '../../Manager/MesManager';
import TestConstProxy from '../../ConfigProxy/TestConstProxy';
import AudioManager from '../../Manager/AudioManager';

/**
 * 3d 游戏 入口
 */
export default class Game3D {
    //
    private static _instance: Game3D;
    /** 单例 */
    public static get instance(): Game3D {
        if (this._instance == null) {
            this._instance = new Game3D();
        }
        return this._instance;
    }
    //
    private constructor() { }

    /**
     * 进入游戏
     */
    public enterGame() {
        //初始化游戏
        this.initGame();
        //开始游戏前
        this._startGame();
        //开始游戏
        this.startGame();
    }

    //初始化游戏
    private initGame() {
        //初始化全局状态管理器
        GlobalStateManager.instance.init();
        //简易消息管理器
        MesManager.instance.init();
        //音效管理器
        AudioManager.instance.init();
        //游戏管理器
        GameManager.instance.init();
        //初始化环境管理器
        EnvironmentManager.instance.init();
        //初始化UI
        UIManager.instance.init();
        //初始化场景
        CustomsManager.instance.init();
    }

    //开始游戏之前
    private _startGame() {
        //打开debug显示页面
        if (TestConstProxy.instance.ifDebug) {
            Laya.Stat.show();
        } else {
            Laya.Stat.hide();
        }
        // 关闭多点触控
        // Laya.MouseManager.multiTouchEnabled = true;
    }

    //开始游戏
    private startGame() {
        //
        UIManager.instance.Start();
        //
        CustomsManager.instance.initLevelBuild();
    }
}