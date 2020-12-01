/**
 * 基础OIMO形状
 */
export abstract class OimoBaseShape {
    public type: string;
    public localOffset: Laya.Vector3 = new Laya.Vector3();
    public pos: Laya.Vector3;
    public eular: Laya.Vector3;
    public size: Laya.Vector3;
    constructor(type: string, pos: Laya.Vector3, eular: Laya.Vector3, size: Laya.Vector3) {
        this.type = type;
        this.pos = pos;
        this.eular = eular;
        this.size = size;
    }
}