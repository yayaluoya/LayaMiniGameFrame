/**
 * 游戏数据管理器基类
 */
export default abstract class RootDataManger {
    /**
    * 初始化,在这里读取数据
    */
    public abstract InitData(): void;
}