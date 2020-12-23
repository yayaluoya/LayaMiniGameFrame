import IRootManager from '../../aTGame/Manager/IRootManager';
import { EEventAudio } from '../EventEnum/EEventAudio';
import { EEventGlobal } from '../EventEnum/EEventGlobal';
import { EEventScene } from '../EventEnum/EEventScene';
import { EEventUI } from '../EventEnum/EEventUI';
/**
 * 简易信息处理类
 */
export default class MesManager extends Laya.EventDispatcher implements IRootManager {
    //消息键值
    private static _mesKey: symbol = Symbol('$MesKey');

    //消息唯一标识符
    private static _onlyKey: number = 0;
    private static get onlyKey(): string {
        MesManager._onlyKey++;
        return '$key' + MesManager._onlyKey;
    }

    private static _instance: MesManager;
    /** 单例 */
    public static get instance(): MesManager {
        if (this._instance == null) {
            this._instance = new MesManager();
        }
        return this._instance;
    }
    //
    private constructor() {
        super();
    }

    //初始化
    public init() {
        //注册消息类型，没注册的话就不能用本消息类发送该类型消息
        this.enumerationEegistrationMes(EEventGlobal);//全局事件
        this.enumerationEegistrationMes(EEventUI);//UI事件
        this.enumerationEegistrationMes(EEventScene);//场景事件
        this.enumerationEegistrationMes(EEventAudio);//音效事件
    }

    //注册消息枚举
    private enumerationEegistrationMes(_mes: object) {
        for (let _i in _mes) {
            _mes[_i] = {
                value: _mes[_i],
                [MesManager._mesKey]: MesManager.onlyKey,
            };
        }
        // console.log(_mes);
    }

    /**
     * 发送事件
     * @param event 事件枚举 
     * @param data 数据
     */
    public sendEvent(event: string, data?: any) {
        // console.log('Global ' + event);
        MesManager.instance.event(event[MesManager._mesKey], data);
    }

    /**
     * 监听事件
     * @param type Global事件枚举
     * @param caller 执行域
     * @param listener 事件
     * @param args 携带的数据
     */
    public onEvent(type: string, caller: any, listener: Function, args?: any[]) {
        MesManager.instance.on(type[MesManager._mesKey], caller, listener, args);
    }

    /**
     * 删除事件侦听器
     * @param type 事件枚举 
     * @param caller 执行域
     * @param listener 回调函数
     */
    public offEnent(type: string, caller: any, listener: Function) {
        MesManager.instance.off(type[MesManager._mesKey], caller, listener);
    }
}