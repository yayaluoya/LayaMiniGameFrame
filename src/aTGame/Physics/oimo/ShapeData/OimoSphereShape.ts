import { OimoBaseShape } from "./OimoBaseShape";
/**
 * 球形状OIMO
 */
export class OimoSphereShape extends OimoBaseShape {
    public radius: number;

    constructor(radius: number = 0.5, pos: Laya.Vector3, scale: Laya.Vector3) {
        super('sphere', pos, new Laya.Vector3(), new Laya.Vector3(radius, radius, radius));
        Laya.Vector3.multiply(this.size, scale, this.size);
        this.radius = radius;
    }
}