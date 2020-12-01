/**
 * 在fgui上显示3D物体的类
 * 通过更改显示的3dNode节点对象显示不同的内容
 */
export default class FGUIShow3DPrefabe {

    //显示3d物体的节点
    private m_show3DNode: Laya.Sprite3D;

    //
    public constructor(parent: fgui.GComponent = fgui.GRoot.inst, _position: Laya.Vector3) {
        this.top3DScene(parent);
        this.m_show3DNode = new Laya.Sprite3D();
        this.scene.addChild(this.m_show3DNode);
        this.setShow3DNode(_position);
    }

    public get show3DNode(): Laya.Sprite3D {
        return this.m_show3DNode;
    }

    /**
     * 设置需要显示的3D物体的节点的位置
     * @param _position 位置
     */
    public setShow3DNode(_position: Laya.Vector3) {
        //设置节点位置
        let outPos = new Laya.Vector3();
        this.camera.convertScreenCoordToOrthographicCoord(new Laya.Vector3(_position.x, _position.y, 0), outPos);
        this.m_show3DNode.transform.position = outPos;
        this.orthographicVerticalSize = _position.z;
    }

    /** 设置正交投影垂直矩阵尺寸 */
    public set orthographicVerticalSize(_n: number) {
        this.camera.orthographicVerticalSize = _n;
    }

    /** 设置灯光强度 */
    public set lightIntensity(_n) {
        this.directionLight.intensity = _n;
    }

    private scene: Laya.Scene3D;
    private camera: Laya.Camera = new Laya.Camera(0, 0.1, 1000);
    private directionLight: Laya.DirectionLight;
    private top3DScene(parent: fgui.GComponent) {
        this.scene = new Laya.Scene3D();
        parent.displayObject.addChild(this.scene);
        this.scene.mouseEnabled = false;
        this.scene.addChild(this.camera);
        //设置正交显示
        this.camera.orthographic = true;
        //设置清除标记为不清楚
        this.camera.clearFlag = Laya.CameraClearFlags.Nothing;
        //添加灯光
        this.directionLight = new Laya.DirectionLight();
        //设置灯光强度为默认环境中的灯光强度
        this.directionLight.intensity = 0.8;
        this.scene.addChild(this.directionLight);
    }
}