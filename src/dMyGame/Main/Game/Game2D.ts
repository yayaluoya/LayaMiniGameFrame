/**
 * 2d 游戏 入口
 */
export default class Game2D {
    //
    private static _instance: Game2D;
    /** 单例 */
    public static get instance(): Game2D {
        if (this._instance == null) {
            this._instance = new Game2D();
        }
        return this._instance;
    }
    //
    private constructor() { }

    /**
     * 进入游戏
     */
    public enterGame() {
        this.initGame();
    }

    //初始化游戏
    private initGame() {
        //
    }
}