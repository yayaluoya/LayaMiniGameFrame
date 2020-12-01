import IRootManager from "../../aTGame/Manager/IRootManager";
import { EEventAudio } from "../EventEnum/EEventAudio";
import AudioProxy from "../Proxy/AudioProxy";
import MesManager from "./MesManager";
/**
 * 音效管理类
 */
export default class AudioManager implements IRootManager {
    //
    private static _instance: AudioManager;
    /** 单例 */
    public static get instance(): AudioManager {
        if (this._instance == null) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }
    //
    private constructor() { }

    //初始化
    public init() {
        MesManager.instance.onAudio(EEventAudio.BGMSuspend, this, this.BGMsuSpend);
        MesManager.instance.onAudio(EEventAudio.BGMGoOn, this, this.BGMGoOn);
        MesManager.instance.onAudio(EEventAudio.SoundSuspend, this, this.soundSuspend);
        MesManager.instance.onAudio(EEventAudio.SoundGoOn, this, this.soundGoOn);
        MesManager.instance.onAudio(EEventAudio.BGMVolumeChange, this, this.bgmVolumeChange);
        MesManager.instance.onAudio(EEventAudio.SoundVolumeChange, this, this.soundVolumeChange);
    }

    //BGM暂停
    private BGMsuSpend() {
        AudioProxy.instance.stopBGM();
    }

    //BGM继续
    private BGMGoOn() {
        AudioProxy.instance.BGMGoOn();
    }

    //音效暂停
    private soundSuspend() {
        AudioProxy.instance.soundSuspend();
    }

    //音效继续
    private soundGoOn() {
        AudioProxy.instance.soundGoOn();
    }

    //BGM音量改变
    private bgmVolumeChange(_n: number = 1) {
        Laya.SoundManager.setMusicVolume(_n);
    }

    //音效音量改变
    private soundVolumeChange(_n: number = 1) {
        Laya.SoundManager.setSoundVolume(_n);
    }
}