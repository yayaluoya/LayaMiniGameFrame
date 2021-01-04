import { IPrefabsGather } from "src/aTGame/3D/SceneUtils";
import RootTest from "../aTGame/Test/RootTest"
/**
 * OIMO物理测试
 */
export default class OIMODebug extends RootTest {
    //单例
    private static _instance: OIMODebug;
    /** 单例对象 */
    public static get instance(): OIMODebug {
        if (this._instance) {
            return this._instance;
        } else {
            this._instance = new OIMODebug();
            return this._instance;
        }
    }
    //
    public goodsList: Laya.Sprite3D[];
    public wallList: Laya.Sprite3D[];

    //
    public start(_prefabs: IPrefabsGather) {
        let _spr: Laya.Sprite3D[] = [];
    }
}