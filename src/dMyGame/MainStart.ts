import Game3D from './Main/Game/Game3D';
import GameLoad from './Main/GameLoad';
import Game2D from './Main/Game/Game2D';
import MainTest from '../aTGame/Test/MainTest';
import MainGameConfig from '../bTGameConfig/MainGameConfig';
import ConsoleEx from '../aTGame/Console/ConsoleEx';
import MyMainTest from '../eTest/MyMainTest';
import MainDebug from '../aTGame/Debug/MainDebug';
import MyMainDebug from '../fDebug/MyMainDebug';
import RootDebug from '../aTGame/Debug/RootDebug';
import FrameSubpackages from '../cFrameBridge/FrameSubpackages';
import PlatformManager from '../aTGame/Platform/PlatformManager';
/**
 * 游戏开始类
 */
export default class MainStart {
    //游戏开始创建
    constructor() {
        //初始化
        this.init().then(() => {
            //
            this.upGameLoad();
            //
            this.gameLoad();
        });
    }

    //初始化之前执行
    private init(): Promise<void> {
        return new Promise<void>((r: Function) => {
            //初始化平台管理器
            PlatformManager.instance.init();
            PlatformManager.instance.initPlatform();
            //加载分包资源
            this.loadSubpackage().then(() => {
                r();
            });
        });
    }

    //加载分包资源
    private loadSubpackage(): Promise<void> {
        //
        return new Promise<void>((r) => {
            //分包列表
            if (FrameSubpackages.subpackages.length > 0) {
                //加载所有分包
                let _promiseList: Promise<void>[] = [];
                for (let _o of FrameSubpackages.subpackages) {
                    //
                    if (_o.name) {
                        _promiseList.push(new Promise<void>((r) => {
                            PlatformManager.PlatformInstance.LoadSubpackage(
                                _o.name,
                                Laya.Handler.create(this, () => {
                                    r();
                                }), Laya.Handler.create(this, () => {
                                    r();
                                }),
                                undefined
                            );
                        }));
                    }
                }
                //
                Promise.all<Promise<void>>(_promiseList).then(() => {
                    r();
                });
            } else {
                r();
            }
        });
    }

    /** 游戏加载之前 */
    private upGameLoad() {
        //判断是否开启测试
        if (MainGameConfig.ifTest) {
            //激活测试类
            new MainTest().startTest();//主测试
            new MyMainTest().startTest();//项目测试
        }
        //判断是否开启调试
        if (MainGameConfig.ifDebug) {
            //激活调试类
            new MainDebug().startDebug();//主调试
            new MyMainDebug().startDebug();//项目调试
            //判断是否打开新窗口调试
            if (MainGameConfig.ifOpenWindowDebug) {
                //打开新窗口进行调试
                RootDebug.openWindowDebug();
            }
        }
    }

    /** 加载游戏 */
    private gameLoad() {
        let _gameLoad: GameLoad = new GameLoad();
        //
        console.log(...ConsoleEx.comLog('开始加载游戏'));
        //开始加载处理
        _gameLoad.Enter(this, undefined, this.OnGameLoad);
    }

    /** 游戏进入之前的操作之前之后 */
    private OnGameLoad(): Promise<void> {
        return new Promise<void>((_r) => {
            _r();
            //
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
        });
    }

    /** 进入游戏之后 */
    private OnGameEnter() { }
}