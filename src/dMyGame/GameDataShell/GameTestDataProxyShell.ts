import RootDataProxyShell from "../../aTGame/Data/RootDataProxyShell";
import GameTestData from "../GameData/GameTestData";
import GameTestDataProxy from "../GameData/GameTestDataProxy";

/**
 * 测试数据代理处理类，用这个类处理数据会有事件传递出去
 */
export default class GameTestDataProxyShell extends RootDataProxyShell {
    //
    private static m_instance: GameTestDataProxyShell;
    /** 单例 */
    public static get instance(): GameTestDataProxyShell {
        if (!this.m_instance) {
            this.m_instance = new GameTestDataProxyShell();
        }
        return this.m_instance;
    }
    //
    private constructor() { super(); }

    //
    private m_data: GameTestData;

    /** 获取数据 */
    public get data(): GameTestData {
        return this.m_data;
    }

    //初始化数据
    protected initData() {
        //获取代理数据，并添加一个设置数据监听
        this.m_data = GameTestDataProxy.instance.saveData;
        GameTestDataProxy.instance.addKeySetMonitor(this, () => {
            console.log('根属性testNumber或者testBoolean改变，属性监听');
        }, [GameTestDataProxy.instance.rootData.testNumber, GameTestDataProxy.instance.rootData.testBoolean]);
        //
        GameTestDataProxy.instance.addObjectSetMonitor(this, () => {
            console.log('根属性testNumber改变，对象监听');
        }, GameTestDataProxy.instance.rootData, GameTestDataProxy.instance.rootData.testNumber);
        //
        GameTestDataProxy.instance.addObjectSetMonitor(this, () => {
            console.log('对象属性a改变');
        }, GameTestDataProxy.instance.rootData.testObject, GameTestDataProxy.instance.rootData.testObject['a']);
        //
        GameTestDataProxy.instance.addObjectSetMonitor(this, () => {
            console.log('数组属性改变');
        }, GameTestDataProxy.instance.rootData.testArray);
        //
        GameTestDataProxy.instance.addObjectSetMonitor(this, () => {
            console.log('对象属性a,或者b改变');
        }, GameTestDataProxy.instance.rootData.testObject, ['a', 'b']);
    }
}

/**
 * 数据包装测试
 */
class dataPackageTesting {
    private static m_ifSetMon: boolean = false;
    private data: any;
    public constructor() {
        this.data = new Proxy({ a: '数据' }, {
            get(target, key) {
                if (!dataPackageTesting.m_ifSetMon) {
                    return target[key];
                } else {
                    return 'get拦截：' + target[key];
                }
            }
        });
        //
        console.log(this.data.a);
        console.log(this.getData());
        console.log(this.data.a);
        console.log(JSON.stringify(this.data));
    }

    public getData() {
        dataPackageTesting.m_ifSetMon = true;
        let _data = this.data.a;
        dataPackageTesting.m_ifSetMon = false;
        return _data;
    }
}