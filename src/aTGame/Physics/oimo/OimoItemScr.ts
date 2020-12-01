import { OimoManager } from "./OimoManager";
/**
 * OIMO物理基础脚本
 */
export class OimoItemScr extends Laya.Script3D {
    public rig: OIMO.RigidBody;

    private target = new Laya.Vector3();

    public get transform(): Laya.Transform3D {
        return (this.owner as Laya.Sprite3D).transform;
    }

    private _forceOpen = false;
    private force: number = 0;
    public ApplyForce(force: number, target: Laya.Vector3) {
        this._forceOpen = true;
        this.force = force;
        target.cloneTo(this.target);
    }

    onUpdate() {
        // this.rig.applyImpulse(this.rig.pos, )
    }

    onDestroy() {
        OimoManager.instance.RemoveRig(this.rig, undefined, true);
    }
}