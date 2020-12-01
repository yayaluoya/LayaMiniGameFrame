import ResUrl from "../../aTGame/Res/ResUrl";
import ConsoleEx from "../Console/ConsoleEx";

/**
 * 音效工具类
 * 必须要先预加载音效，不然播放会有延迟
 */
export default class AudioUtils {
    //
    private static _instance: AudioUtils;
    /** 单例 */
    public static get instance(): AudioUtils {
        if (this._instance == null) {
            this._instance = new AudioUtils();
        }
        return this._instance;
    }
    //
    private constructor() { }

    //初始化
    public init() { }

    //
    private _bgPast: string[] = [];
    private _urlBGM: string = '';
    private _urlSOUND: string = '';

    /**
     * 播放背景音乐
     * @param name 背景音乐名字
     */
    public playBGM(name: string, loops?: number, complete?: Handler, startTime?: number): void {
        if (name != null && this._bgPast.slice(-1)[0] != name) {
            this._bgPast.push(name);
            this._urlBGM = ResUrl.music_url(name);
            this._playMusic(loops, complete, startTime);
            console.log(...ConsoleEx.packLog("播放背景音乐", name));
        }
        else {
            if (this._urlBGM != "") {
                this._playMusic(loops, complete, startTime);
                console.log(...ConsoleEx.packLog("播放背景音乐", name));
            } else {
            }
        }
    }

    /**
     * 转移背景音乐
     * @param name 
     */
    public shiftBGM(name: string, loops?: number, complete?: Handler, startTime?: number): void {
        if (this._bgPast.slice(-1)[0] == name) {
            this._bgPast.pop();
            let pastBg: string = this._bgPast.slice(-1)[0];
            if (pastBg) {
                this._urlBGM = ResUrl.music_url(name);
                this._playMusic(loops, complete, startTime);
            }
        }
    }

    /**
     * 暂停背景音乐
     */
    public pauseBGM() {
        Laya.SoundManager.stopMusic();
        console.log(...ConsoleEx.packLog("停止播放音乐", this._urlBGM));
    }

    /**
     * 暂停特效音乐
     */
    public pauseSound() {
        Laya.SoundManager.stopAllSound();
    }

    private _sounds: Laya.SoundChannel[] = [];
    /**
     * 播放特效音乐
     * @param type 名字
     * @param loops 是否循环
     * @param complete 完成回调
     * @param soundClass 使用哪个声音类进行播放，null表示自动选择。
     * @param startTime 开始时间
     */
    public playSound(type: string, loops?: number, complete?: Laya.Handler, soundClass?: any, startTime?: number): void {
        this._urlSOUND = ResUrl.sound_url(type);
        for (let i = 0; i < this._sounds.length; i++) {
            if (this._sounds[i]) {
                if (this._sounds[i].url.indexOf(this._urlSOUND) >= 0) {
                    this._sounds[i].stop();
                    this._sounds.splice(i, 1);
                    break;
                }
            }
        }
        let temp = Laya.SoundManager.playSound(this._urlSOUND, loops, complete, soundClass, startTime);
        this._sounds.push(temp);
    }

    /**
     * 停止播放某个特效音乐
     * @param type 
     */
    public stopSound(type: string): void {
        this._urlSOUND = ResUrl.sound_url(type);
        Laya.SoundManager.stopSound(this._urlSOUND);
    }

    // 播放音乐后的回调
    private _playMusic(loops: number = 0, complete?: Handler, startTime?: number) {
        Laya.SoundManager.stopMusic();
        Laya.SoundManager.playMusic(this._urlBGM, loops, complete, startTime);
    }
}