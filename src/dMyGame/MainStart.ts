import Game3D from './Main/Game/Game3D';
import GameLoad from './Main/GameLoad';
import Game2D from './Main/Game/Game2D';
import MainTest from '../aTGame/Test/MainTest';
import MainGameConfig from '../bTGameConfig/MainGameConfig';
import ConsoleEx from '../aTGame/Console/ConsoleEx';
import MyMainTest from '../eTest/MyMainTest';
/**
 * 游戏开始类
 */
export default class MainStart {
    //游戏开始创建
    constructor() {
        //
        this.upGameLoad();
        //
        this.gameLoad();
    }

    /** 游戏加载之前 */
    private upGameLoad() {
        //判断是否开启测试
        if (MainGameConfig.ifTest) {
            //激活测试类
            new MainTest();
            new MyMainTest();
        }
    }

    /** 加载游戏 */
    private gameLoad() {
        let _s: GameLoad = new GameLoad();
        //
        console.log(...ConsoleEx.comLog('开始加载游戏'));
        //开始加载处理
        _s.Enter(Laya.Handler.create(this, this.OnGameLoad));
    }

    /** 游戏进入之前的操作之前之后 */
    private OnGameLoad() {
        console.log(...ConsoleEx.comLog('游戏加载完成'));
        //判断游戏类型
        if (MainGameConfig.support3D) {
            //进入3D游戏
            Game3D.instance.enterGame();
        }
        if (MainGameConfig.support2D) {
            //进入2D游戏
            Game2D.instance.enterGame();
        }
        //
        this.OnGameEnter();
    }

    /** 进入游戏之后 */
    private OnGameEnter() { }
}