/**
 * 游戏数据基类
 * 会有一个返回副本的方法，防止被修改
 */
export default abstract class RootGameData {
    /** 返回一个副本 */
    public abstract clone(): RootGameData;
}