/**
 * 类代理类基类 (为需要双向引用的类代理数据)
 * 在该类里面引入的其他类必须没有循环代理问题
 * ! 注意！只能处理静态或者单例类型，并且必须在使用前初始化
 * ! 初始化不要写到constructor方法里面,写到主动调用的方法里面
 */
export default class RootClassProxy {
    //是否已经设置过代理
    protected static m_ifSetProxy: boolean = false;

    //代理数据
    private static m_datas: IRootClassProxyData;

    //代理方法
    private static m_handlers: IRootClassProxyFunction;

    /** 获取代理数据 */
    public static get Datas(): IRootClassProxyData {
        return this.m_datas;
    }

    /** 设置代理数据 */
    public static set Datas(_data: IRootClassProxyData) {
        this.m_datas = _data;
    }

    /** 获取代理数据 */
    public static get Handlers(): IRootClassProxyFunction {
        return this.m_handlers;
    }

    /** 设置代理数据 */
    public static set Handlers(_handler: IRootClassProxyFunction) {
        this.m_handlers = _handler;
    }
}

/**
 * 代理类代理数据类型
 */
export interface IRootClassProxyData {
    [index: string]: any,
}

/**
 * 代理类代理方法类型
 */
export interface IRootClassProxyFunction {
    [index: string]: Laya.Handler,
}

/**
 * 踩坑
 * 循环依赖问题产生原因
 * 不是a导入了b，b又导入a引起的
 * 而是a文件实例化了b，b文件有实例化了a引起了
 */