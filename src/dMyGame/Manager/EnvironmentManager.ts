import { EnvironmentConfig } from '../_config/EnvironmentConfig';
import ColorUtils from '../../aTGame/Utils/ColorUtils';
import Global3D from '../../aTGame/3D/Global3D';
import IRootManager from '../../aTGame/Manager/IRootManager';
import { EEventScene } from '../EventEnum/EEventScene';
import MesManager from './MesManager';
import { EOtherLevelName } from '../Enum/EOtherLevelName';
import { OtherEnvironmentConfig } from '../_config/OtherEnvironmentConfig';
import EnvironmentConfigProxy from '../ConfigProxy/EnvironmentConfigProxy';
import OtherEnvironmentConfigProxy from '../ConfigProxy/OtherEnvironmentProxy';
import MainGameConfig from '../../bTGameConfig/MainGameConfig';
import RootDebug from '../../aTGame/Debug/RootDebug';
import { EDebugWindowEvent } from '../../aTGame/Debug/mes/EDebugWindowEvent';
import GameDataProxyShell from '../GameDataShell/GameDataProxyShell';
/**
 * 环境管理器，负责场景的环境管理
 */
export default class EnvironmentManager implements IRootManager {
    //
    private static m_instance: EnvironmentManager;
    /** 单例 */
    public static get instance(): EnvironmentManager {
        if (!this.m_instance) {
            this.m_instance = new EnvironmentManager();
        }
        return this.m_instance;
    }
    //
    private constructor() { }

    //默认
    private m_s3d: Laya.Scene3D;//3d根节点
    private m_camera: Laya.Camera;//摄像机
    private m_scene: Laya.Sprite3D;//当前场景
    //
    private m_light: Laya.DirectionLight;//灯光
    private m_enviromentConfig: EnvironmentConfig.config;//环境配置数据
    //
    private m_ifSetS3D: boolean;//是否设置过场景

    /** 初始化 */
    public init() {
        this.m_s3d = Global3D.s3d;
        this.m_camera = Global3D.camera;
        this.m_light = Global3D.light;
    }

    /**
     * 设置环境
     * @param _scene 当前场景
     */
    public setEnvironment(_scene: Laya.Sprite3D) {
        this.m_scene = _scene;
        let _lv: number = GameDataProxyShell.instance.gameData.onCustoms;
        this.m_enviromentConfig = EnvironmentConfigProxy.instance.byLevelIdGetData(_lv);
        console.log('关卡环境配置参数->' + _lv + '->', this.m_enviromentConfig);
        //根据配置数据设置相关状态
        this.setS3D(this.m_s3d);
        this.setCamera(this.m_camera, this.m_enviromentConfig.clear_color);
        this.setLight(this.light, this.m_enviromentConfig.light_color, this.m_enviromentConfig.light_intensity);
        this.addAmbient(this.s3d, this.m_enviromentConfig.ambient_color);
        //监听事件
        MesManager.instance.onEvent(EEventScene.GameLevelsDelete, this, this.gameLevelsDelete);
        //
        if (MainGameConfig.ifDebug && MainGameConfig.ifOpenWindowDebug) {
            //发送环境改变事件
            RootDebug.fendDebugWindow(EDebugWindowEvent.SetEnvironment);
        }
    }

    /**
     * 设置其他场景环境
     * @param _name 场景名字
     * @param _scene 场景精灵
     * @param _camera 摄像机
     * @param _light 灯光
     */
    public setOtherEnvironment(_name: EOtherLevelName, _scene: Laya.Sprite3D, _s3d: Laya.Scene3D = this.m_s3d, _camera: Laya.Camera = this.m_camera, _light: Laya.DirectionLight = this.m_light) {
        let _enviromentConfig: OtherEnvironmentConfig.config = OtherEnvironmentConfigProxy.instance.byLevelNameGetData(_name);
        console.log('关卡环境配置参数->' + _name + '->', _enviromentConfig);
        this.setCamera(_camera, _enviromentConfig.clear_color);
        this.setLight(_light, _enviromentConfig.light_color, _enviromentConfig.light_intensity);
        this.addAmbient(_s3d, _enviromentConfig.ambient_color);
    }

    /** 3d根节点 */
    public get s3d(): Laya.Scene3D {
        return this.m_s3d;
    }
    /** 摄像机 */
    public get camera(): Laya.Camera {
        return this.m_camera;
    }
    /** 当前场景 */
    public get scene(): Laya.Sprite3D {
        return this.m_scene;
    }
    /** 灯光 */
    public get light(): Laya.DirectionLight {
        return this.m_light;
    }

    //设置场景
    private setS3D(_s3d: Laya.Scene3D) {
        if (this.m_ifSetS3D) return;
        this.m_ifSetS3D = true;
        //
    }

    //设置摄像机
    private setCamera(_camera: Laya.Camera, _clear_color: string) {
        //设置清除颜色
        _camera.clearColor = ColorUtils.HexToV4(_clear_color);
    }

    //设置灯光
    private setLight(_light: Laya.DirectionLight, _color: string, _instensity: number) {
        //
        _light.color = ColorUtils.HexToV3(_color);
        _light.intensity = _instensity;
        //灯光开启阴影
        _light.shadowMode = Laya.ShadowMode.SoftLow;
        _light.shadowResolution = 2500;
        _light.shadowNormalBias = 0.5;
    }

    //加环境光
    private addAmbient(_s3d: Laya.Scene3D, _color: string) {
        //设置环境光
        _s3d.ambientMode = Laya.AmbientMode.SolidColor;
        _s3d.ambientColor = ColorUtils.HexToV3(_color);
    }

    //加雾化
    private addFog(_scene: Laya.Scene3D, _color: string, _fogRange: number, _fogStart: number) {
        //
        _scene.enableFog = true;
        _scene.fogColor = ColorUtils.HexToV3(_color);
        _scene.fogRange = _fogRange;
        _scene.fogStart = _fogStart;
    }

    //删除场景
    private gameLevelsDelete() {
        //
    }
}