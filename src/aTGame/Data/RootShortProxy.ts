import RootDataManger from './RootDataManger';
import RootGameData from './RootGameData';
/**
 * 临时数据代理基类
 * 泛型为数据类型
 */
export default abstract class RootShortProxy<T extends RootGameData> extends RootDataManger {
    /**
     * 初始化数据
     */
    public abstract InitData();
}