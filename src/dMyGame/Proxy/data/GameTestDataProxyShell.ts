import RootDataProxyShell from "../../../aTGame/Data/RootDataProxyShell";
import GameTestData from "../../GameData/GameTestData";
import GameTestDataProxy from "../../GameData/GameTestDataProxy";

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
        GameTestDataProxy.instance.addDataSetMonitor(this, this.propDataSetMonitor);
    }

    //
    private propDataSetMonitor(target, key, value, rootData) {
        if (rootData == GameTestDataProxy.instance.rootData.testObject) {
            console.log('对象属性改变', target, key, value);
        } else if (rootData == GameTestDataProxy.instance.rootData) {
            console.log('根属性改变', target, key, value);
        } else if (rootData == GameTestDataProxy.instance.rootData.testArray) {
            console.log('数组属性改变', target, key, value);
        }
    }
}