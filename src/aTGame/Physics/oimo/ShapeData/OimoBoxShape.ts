import { OimoBaseShape } from "./OimoBaseShape";
/**
 * box形状OIMO
 */
export class OimoBoxShape extends OimoBaseShape {
    constructor(pos: Laya.Vector3, eular: Laya.Vector3, size: Laya.Vector3) {
        super('box', pos, eular, size);
    }
}