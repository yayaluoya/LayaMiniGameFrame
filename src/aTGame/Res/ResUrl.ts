import { EKeyResName } from "./EKeyResName";
import KeyResManager from "./KeyResManager";

/**
 * 资源公共根路径
 */
export default class ResUrl {
    /**
     * 音乐文件路径
     * @param name 文件名称
     */
    public static music_url(name: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.music) + name + '.mp3';
    }

    /**
     * 音效资源路径
     * @param name 音效名字 
     */
    public static sound_url(name: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.sound) + name + '.mp3';
    }

    /**
     * 图标资源路径
     * @param name 图标名称 
     */
    public static icon_url(name: string): string {
        return KeyResManager.instance.getResURL(EKeyResName.icon) + name + '.png';
    }

    /**
     * 图片资源路径
     * @param name 图片资源名字
     * @param _suffix 图片资源后缀
     */
    public static img_url(name: string, _suffix: string = 'png'): string {
        return KeyResManager.instance.getResURL(EKeyResName.img) + name + '.' + _suffix;
    }

    /**
     * 皮肤资源路径
     * @param name 皮肤名称 
     * @param _suffix 皮肤资源后缀
     */
    public static skin_url(name: string, _suffix: string = 'png'): string {
        return KeyResManager.instance.getResURL(EKeyResName.skin) + name + '.' + _suffix;
    }
}