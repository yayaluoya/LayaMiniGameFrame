import { OimoBaseShape } from "./ShapeData/OimoBaseShape";
import Dictionary from '../../Utils/Dictionary';
import OimoConst from "../../../cFrameBridge/Physics/OimoConst";
/**
 * OIMO物理管理器
 */
export class OimoManager {
    //刚体递增id
    private static m_rigId: number = 0;
    //
    private constructor() { this._init() }

    private _oimoWorld: OIMO.World;
    public get oimoWorld(): OIMO.World {
        return this._oimoWorld;
    }

    private static _instance: OimoManager;
    public static get instance(): OimoManager {
        if (!OimoManager._instance) {
            OimoManager._instance = new OimoManager();
        }
        return OimoManager._instance;
    }

    private _oimoRigDic = new Dictionary<string, OIMO.RigidBody>();
    private _transformDic = new Dictionary<string, Laya.Transform3D>();
    private _oimoOffset = new Dictionary<string, Laya.Vector3>();

    private _oimoRigDicR = new Dictionary<string, OIMO.RigidBody>();
    private _transformDicR = new Dictionary<string, Laya.Transform3D>();
    private _oimoOffsetR = new Dictionary<string, Laya.Vector3>();

    private _init() {
        this._oimoWorld = this.CreateWolrd();
        window['oimoWorld'] = this._oimoWorld;
    }

    // 建造场景
    CreateWolrd(): OIMO.World {
        let wolrd = new OIMO.World({
            timestep: OimoConst.timestep,
            iterations: OimoConst.iterations,
            broadphase: OimoConst.broadphase,// 1 brute force, 2 sweep and prune, 3 volume tree
            worldscale: OimoConst.worldscale, // scale full world 
            random: OimoConst.random,  // randomize sample
            info: OimoConst.info,   // calculate statistic or not
            gravity: OimoConst.gravity,
        });
        return wolrd;
    }

    private _createRigBox(world: OIMO.World, pos: Laya.Vector3, eulerRot: Laya.Vector3, size: Laya.Vector3, isMove: boolean, type = 'box'): OIMO.RigidBody {
        let addRig = world.add({
            type: type, // type of shape : sphere, box, cylinder 
            size: [size.x, size.y, size.z], // size of shape
            pos: [pos.x, pos.y, pos.z], // start position in degree
            rot: [eulerRot.x, eulerRot.y, eulerRot.z], // start rotation in degree
            move: isMove, // dynamic or statique
            density: 10,
            // friction: 0.89,
            // restitution: 0.01,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        } as any) as OIMO.RigidBody;
        return addRig;
    }

    /**
     * 创建一个物理刚体
     * @param ts 
     * @param shapes 
     * @param isMove 
     * @param update 
     * @param reverseUpdate 
     * @param isKinematic 
     * @param density 
     * @param belongsTo 
     * @param collidesWith 
     */
    public CreateCompoundRig(
        ts: Laya.Transform3D,
        shapes: OimoBaseShape[],
        isMove: boolean = true,
        update = true,
        reverseUpdate = false,
        isKinematic = false,
        density = 10,
        belongsTo = 1,
        collidesWith = 0xffffffff,
    ): OIMO.RigidBody {
        var type: string[] = [];
        var posShape: number[] = [];
        var rotShape: number[] = [];
        var size: number[] = [];
        for (var i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            type.push(shape.type);
            posShape.push(shape.pos.x, shape.pos.y, shape.pos.z);
            rotShape.push(shape.eular.x, shape.eular.y, shape.eular.z);
            size.push(shape.size.x, shape.size.y, shape.size.z);
        }
        let rig = this.oimoWorld.add({
            type: type,
            pos: [ts.position.x, ts.position.y, ts.position.z],
            rot: [ts.rotationEuler.x, ts.rotationEuler.y, ts.rotationEuler.z],
            posShape: posShape,
            rotShape: rotShape,
            size: size,
            move: isMove,
            density: density,
            friction: 0.999,
            restitution: 0.1,
            isKinematic: isKinematic,
            belongsTo: belongsTo, // The bits of the collision groups to which the shape belongs.
            collidesWith: collidesWith, // The bits of the collision groups with which the shape collides.

        } as any) as OIMO.RigidBody;
        //加一个不变的id
        rig.id = OimoManager.m_rigId;
        OimoManager.m_rigId++;
        //
        if (update) {
            this._oimoRigDic.set(rig.id, rig);
            this._transformDic.set(rig.id, ts);
            this._oimoOffset.set(rig.id, new Laya.Vector3());
        }
        if (reverseUpdate) {
            this._oimoRigDicR.set(rig.id, rig);
            this._transformDicR.set(rig.id, ts);
            this._oimoOffsetR.set(rig.id, new Laya.Vector3());
        }
        return rig;
    }

    /**
     * 设置一个刚体的各个参数
     * @param rig 
     * @param belongsTo 
     * @param collidesWith 
     * @param restitution 
     * @param friction 
     */
    public static SetCollideData(rig: OIMO.RigidBody, belongsTo?: number, collidesWith?: number, restitution?: number, friction?: number) {
        for (var shape = rig.shapes; shape !== null; shape = shape.next) {
            if (belongsTo != null) shape.belongsTo = belongsTo;
            if (collidesWith != null) shape.collidesWith = collidesWith;
            if (restitution != null) shape.restitution = restitution;
            if (friction != null) shape.friction = friction;
        }
    }

    /**
     * 设置是否是  静止物体
     * @param rig 
     * @param can 
     */
    public setCanMove(rig: OIMO.RigidBody, can: boolean) {
        if (can) {
            rig.setupMass(OIMO.BODY_DYNAMIC, false);
        }
        else {
            rig.setupMass(OIMO.BODY_STATIC, false);
        }
    }

    clearRig() {
        this._oimoWorld.clear();

        this._oimoRigDic.clear();
        this._transformDic.clear();
        this._oimoOffset.clear();
        this._oimoRigDicR.clear();
        this._transformDicR.clear();
        this._oimoOffsetR.clear();
    }

    /**
     * 添加刚体
     * @param rig 
     * @param world 
     * @param stopUpdate 是否停止更新
     */
    addRig(rig: OIMO.RigidBody, world: OIMO.World = this._oimoWorld) {
        if (rig) {
            world.addRigidBody(rig);
        }
    }

    /**
     * 删除刚体
     * @param rig 
     * @param world 
     * @param offList # 如果为true的话就是彻底删除，再添加也没有用了
     */
    RemoveRig(rig: OIMO.RigidBody, world: OIMO.World = this._oimoWorld, offList: boolean = false) {
        if (rig) {
            if (offList) {
                this._oimoRigDic.remove(rig.id);
                this._transformDic.remove(rig.id);
                this._oimoOffset.remove(rig.id);
                this._oimoRigDicR.remove(rig.id);
                this._transformDicR.remove(rig.id);
                this._oimoOffsetR.remove(rig.id);
            }
            world.removeRigidBody(rig);
        }
    }

    /**
     * 添加关节
     * @param type 
     * @param rig1 
     * @param rig2 
     * @param pos1 
     * @param pos2 
     * @param spring 
     */
    AddJoint(type: 'joint' | 'jointHinge' | 'jointDistance' | 'jointPrisme' | 'jointSlide' | 'jointBall' | 'jointWheel',
        rig1: OIMO.RigidBody, rig2: OIMO.RigidBody, pos1?: Laya.Vector3, pos2?: Laya.Vector3, spring?: number[]): OIMO.Joint {
        return this.oimoWorld.add({
            type: type as string,
            body1: rig1,
            body2: rig2,
            pos1: pos1 != null ? [pos1.x, pos1.y, pos1.z] : pos1,
            pos2: pos2 != null ? [pos2.x, pos2.y, pos2.z] : pos2,
            spring: spring,
        } as any)
    }

    /**
     * 删除一个关节
     * @param joint 
     */
    RemoveJoint(joint: OIMO.Joint) {
        this.oimoWorld.removeJoint(joint);
    }

    updateAllTrans() {
        let keys = this._oimoRigDic.keys();
        keys.forEach((key: string) => {
            this.UpdateTrans(this._transformDic.get(key), this._oimoRigDic.get(key), this._oimoOffset.get(key));
        })
    }

    /**
     * 运动物体的  反向赋值
     */
    updateAllTransReverse() {
        let keys = this._oimoRigDicR.keys();
        keys.forEach((key: string) => {
            this.UpdateTransReverse(this._transformDicR.get(key), this._oimoRigDicR.get(key));
        })
    }

    private _tempOimoV3: OIMO.Vec3 = new OIMO.Vec3;
    private _tempOimoQuat: OIMO.Quat = new OIMO.Quat;

    UpdateTransReverse(transform: Laya.Transform3D, rig: OIMO.RigidBody) {
        if (!transform || !rig || !rig.parent) return;
        let pos = transform.position;
        this._tempOimoV3.set(pos.x, pos.y, pos.z)
        rig.awake();
        rig.setPosition(this._tempOimoV3);
        let rotate = transform.rotation;
        this._tempOimoQuat.set(rotate.x, rotate.y, rotate.z, rotate.w);
        rig.setQuaternion(this._tempOimoQuat);
    }

    private _tempQuaternion: Laya.Quaternion = new Laya.Quaternion();
    UpdateTrans(transform: Laya.Transform3D, rig: OIMO.RigidBody, posOffset?: Laya.Vector3) {
        if (!transform || !rig || !rig.parent) return;
        let getPos = rig.getPosition() as any;
        transform.position.x = getPos.x;
        transform.position.y = getPos.y;
        transform.position.z = getPos.z;

        if (posOffset && !this.isZero(posOffset)) {
            // LIUTODO  可以规避的计算
            let offset = posOffset.clone() as Laya.Vector3;
            Laya.Quaternion.createFromYawPitchRoll(this.deg2rad(transform.rotationEuler.y), this.deg2rad(transform.rotationEuler.x),
                this.deg2rad(transform.rotationEuler.z), this._tempQuaternion);
            Laya.Vector3.transformQuat(offset, this._tempQuaternion, offset);
            Laya.Vector3.subtract(transform.position, offset, transform.position);
        }
        transform.position = transform.position;

        let getRot = rig.getQuaternion() as any;
        transform.rotation.x = getRot.x;
        transform.rotation.y = getRot.y;
        transform.rotation.z = getRot.z;
        transform.rotation.w = getRot.w;
        transform.rotation = transform.rotation;
    }

    isZero(pos: Laya.Vector3): boolean {
        return Laya.MathUtils3D.isZero(pos.x) && Laya.MathUtils3D.isZero(pos.y) && Laya.MathUtils3D.isZero(pos.z);
    }

    deg2rad(p_y: number): number {
        return p_y * Math.PI / 180.0;
    }

    public GetRig(name: string): OIMO.RigidBody {
        return this._oimoRigDic.get(name);
    }
}


