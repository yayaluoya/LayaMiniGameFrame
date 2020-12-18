/**
 * 基类数据代理外壳
 * 在数据代理的外面一层，对进出数据进行包装并监听
 */
export default class RootDataProxyShell {
    //
    public constructor() {
        this.initData();
    }

    /**
     * 初始化数据，并注册代理外壳
     */
    protected initData() { }
}