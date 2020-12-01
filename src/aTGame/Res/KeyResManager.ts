import ConsoleEx from "../Console/ConsoleEx";
import { EKeyResName } from "./EKeyResName";

/**
 * 关键资源点列表管理器
 */
export default class KeyResManager {
    //
    private static _instance: KeyResManager;
    /** 单例 */
    public static get instance(): KeyResManager {
        if (this._instance == null) {
            this._instance = new KeyResManager();
        }
        //
        return this._instance;
    }

    //关键资源列表
    private m_KeyResList: { [index: string]: string } = {};

    //副本
    private m_KeyResList_: { [index: string]: string } = {};

    private constructor() {
        //注册关键资源目录
        this.m_KeyResList = {
            [EKeyResName.RootRes]: EKeyResName.RootRes + '/',
            [EKeyResName.Config]: EKeyResName.RootRes + '/' + EKeyResName.Config + '/',
            [EKeyResName.FGUI]: EKeyResName.RootRes + '/' + EKeyResName.FGUI + '/',
            [EKeyResName.LvConfig]: EKeyResName.RootRes + '/' + EKeyResName.LvConfig + '/',
            [EKeyResName.Prefab]: EKeyResName.RootRes + '/' + EKeyResName.Prefab + '/',
            [EKeyResName.Other]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/',
            [EKeyResName.icon]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.icon + '/',
            [EKeyResName.img]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.img + '/',
            [EKeyResName.music]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.music + '/',
            [EKeyResName.sound]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.sound + '/',
            [EKeyResName.skin]: EKeyResName.RootRes + '/' + EKeyResName.Other + '/' + EKeyResName.skin + '/',
        };
        //复制一个副本
        for (let _i in this.m_KeyResList) {
            this.m_KeyResList_[_i] = this.m_KeyResList[_i];
        }
    };

    /**
     * 判断是否存在某个关键点key
     * @param _key 关键点key
     */
    public ifKeyRes(_key: string): boolean {
        let _if: boolean = false;
        for (let _i in EKeyResName) {
            if (_key == EKeyResName[_i]) {
                _if = true;
                break;
            }
        }
        return _if;
    }

    /**
     * 获取一个关键点资源的路径
     * @param _key 关键点key
     */
    public getResURL(_key: EKeyResName): string {
        return this.m_KeyResList[_key];
    }

    /**
     * 修改关键点资源路径
     * @param _key 关键点key
     * @param _str 路径
     */
    public editKeyResList(_key: string, _str: string) {
        let _replace: string = this.m_KeyResList_[_key];
        if (!_replace) {
            console.log(...ConsoleEx.packWarn('修改资源路径失败，没有' + _key + '这个关键路径！'));
            return;
        } else {
            console.log(...ConsoleEx.packLog('修改关键点资源路径', _replace, '替换成', _str));
        }
        //替换所有资源路径中的关键点路径
        for (let _i in this.m_KeyResList) {
            this.m_KeyResList[_i] = this.m_KeyResList[_i].replace(_replace, _str);
        }
        //
        this.m_KeyResList_[_key] = _str;
    }
}