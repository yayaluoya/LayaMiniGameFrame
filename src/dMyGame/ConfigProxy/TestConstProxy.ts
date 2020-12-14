import { BaseConstDataProxy } from '../../aTGame/Config/RootDataProxy';
import MainGameConfig from '../../bTGameConfig/MainGameConfig';
import { TestConst } from '../_config/TestConst';

/**
 * 测试配置表数据代理
 */
export default class TestConstProxy extends BaseConstDataProxy<TestConst.config>{
    //
    private static _instance: TestConstProxy;
    /** 单例 */
    public static get instance(): TestConstProxy {
        if (this._instance == null) {
            this._instance = new TestConstProxy();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    /** 不能直接访问 */
    public get data(): TestConst.config {
        return undefined;
    }

    //初始化
    protected initData() {
        this.m_data = TestConst.data;
    }

    /** 是否开启调试 */
    public get ifDebug(): boolean {
        if (!MainGameConfig.ifGameTest) return false;
        return this.m_data.if_debug;
    }

    /** 是否开启oimo物理 */
    public get ifShowOimoMesh(): boolean {
        if (!MainGameConfig.ifGameTest) return false;
        return this.m_data.if_show_oimo_mesh;
    }

    /** oimo物理网格透明度 */
    public get oimoMeshDiaphaneity(): number {
        return this.m_data.oimo_mesh_diaphaneity;
    }
}