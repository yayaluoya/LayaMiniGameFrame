import { OimoManager } from "./OimoManager";
/**
 * OIMO物理系统
 */
export class OimoSystem extends Laya.Script3D {
    onUpdate() {
        OimoManager.instance.oimoWorld.timeStep = Laya.timer.delta / 1000;
        OimoManager.instance.oimoWorld.step();
        OimoManager.instance.updateAllTrans();
        OimoManager.instance.updateAllTransReverse();
    }
}