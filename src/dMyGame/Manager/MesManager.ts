import IRootManager from '../../aTGame/Manager/IRootManager';
import { EEventAudio } from '../EventEnum/EEventAudio';
import { EEventGlobal } from '../EventEnum/EEventGlobal';
import { EEventScene } from '../EventEnum/EEventScene';
import { EEventUI } from '../EventEnum/EEventUI';
/**
 * 简易信息处理类
 */
export default class MesManager extends Laya.EventDispatcher implements IRootManager {
    private static _instance: MesManager;
    /** 单例 */
    public static get instance(): MesManager {
        if (this._instance == null) {
            this._instance = new MesManager();
        }
        return this._instance;
    }
    //
    private constructor() { super(); }

    //初始化
    public init() { }

    /**
     * 发送全局事件
     * @param event 全局事件枚举 
     * @param data 数据
     */
    public eventGlobal(event: EEventGlobal, data?: any) {
        // console.log('Global ' + event);
        MesManager.instance.event(event, data);
    }

    /**
     * 发送音效事件
     * @param event 全局事件枚举 
     * @param data 数据
     */
    public eventAudio(event: EEventAudio, data?: any) {
        // console.log('Global ' + event);
        MesManager.instance.event(event, data);
    }

    /**
     * 发送UI事件
     * @param event UI事件枚举 
     * @param data 数据
     */
    public eventUI(event: EEventUI, data?: any) {
        // console.log("UI " + event);
        MesManager.instance.event(event, data);
    }

    /**
     * 发送3D事件
     * @param event 3D事件枚举
     * @param data 数据
     */
    public event3D(event: EEventScene, data?: any) {
        // console.log("Scene " + event);
        MesManager.instance.event(event, data);
    }

    /**
     * 监听Global事件
     * @param type Global事件枚举
     * @param caller 执行域
     * @param listener 事件
     * @param args 携带的数据
     */
    public onGlobal(type: EEventGlobal, caller: any, listener: Function, args?: any[]) {
        MesManager.instance.on(type, caller, listener, args);
    }

    /**
     * 监听音效事件
     * @param type UI事件枚举
     * @param caller 执行域
     * @param listener 事件
     * @param args 携带的数据
     */
    public onAudio(type: EEventAudio, caller: any, listener: Function, args?: any[]) {
        MesManager.instance.on(type, caller, listener, args);
    }

    /**
     * 监听UI事件
     * @param type UI事件枚举
     * @param caller 执行域
     * @param listener 事件
     * @param args 携带的数据
     */
    public onUI(type: EEventUI, caller: any, listener: Function, args?: any[]) {
        MesManager.instance.on(type, caller, listener, args);
    }

    /**
     * 监听3D事件
     * @param type 3D事件枚举 
     * @param caller 执行域
     * @param listener 事件
     * @param args 数据
     */
    public on3D(type: EEventScene, caller: any, listener: Function, args?: any[]) {
        MesManager.instance.on(type, caller, listener, args);
    }

    /**
     * 删除Global侦听器
     * @param type Global侦听器枚举 
     * @param caller 执行域
     * @param listener 回调函数
     */
    public offGlobal(type: EEventGlobal, caller: any, listener: Function) {
        MesManager.instance.off(type, caller, listener);
    }

    /**
     * 删除音效侦听器
     * @param type UI侦听器枚举 
     * @param caller 执行域
     * @param listener 回调函数
     */
    public offAudio(type: EEventAudio, caller: any, listener: Function) {
        MesManager.instance.off(type, caller, listener);
    }

    /**
     * 删除UI侦听器
     * @param type UI侦听器枚举 
     * @param caller 执行域
     * @param listener 回调函数
     */
    public offUI(type: EEventUI, caller: any, listener: Function) {
        MesManager.instance.off(type, caller, listener);
    }

    /**
     * 删除3D侦听器
     * @param type 3D侦听器枚举
     * @param caller 执行域
     * @param listener 回调函数
     */
    public off3D(type: EEventScene, caller: any, listener: Function) {
        MesManager.instance.off(type, caller, listener);
    }
}