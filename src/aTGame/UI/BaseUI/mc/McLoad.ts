import { FGUIEx } from "../UI/FGUIEx";

/**
 * Mc加载类
 */
export default class McLoad {
    private _package: string;
    private _swich: boolean;

    constructor(type: string) {
        this._package = type;
        this._swich = true;
    }

    /**
     * 动画资源地址
     * @param name 动画名字
     */
    private _aniUrl(name: string) {
        return "res/ani/" + name;
    }

    /**
     * fgui加载完成
     */
    private onFuiLoaded = () => {
        if (!fgui.UIPackage.getByName(this._package)) {
            fgui.UIPackage.addPackage(this._aniUrl(this._package));
        }
    }

    private _coms: fgui.GObject[] = [];
    /**
     * 加载资源
     * @param callBack 回调
     * @param userClass --
     */
    private onResLoaded<T extends fgui.GComponent | FGUIEx.GMovieClip>(callBack: Laya.Handler, userClass?: new () => T) {
        //动画Com后面请跟 Ani
        if (!this._swich) return;
        if (this._coms == null) {
            this._coms = [];
        }
        let name = this._package + "Ani";
        let mcCom = fgui.UIPackage.createObject(this._package, name, userClass) as T; //现在改成 类和动画都可以传类
        if (!mcCom)
            throw new Error("资源名错误 或 不存在" + name);
        if (mcCom instanceof FGUIEx.GMovieClip)
            mcCom.setPivot(0.5, 0.5, true);
        mcCom.displayObject.hitArea = null;//动画都设置成穿透
        mcCom.displayObject.mouseThrough = true;
        // mcCom.opaque = false;
        this._coms.push(mcCom);
        callBack && callBack.runWith(mcCom);
        callBack = null;
        // utils.UseUtils.handlerRunWith(callBack, mcCom);
    }

    /**
     * 加载资源
     * @param complete 完成回调 
     */
    public loadRes(complete?: Laya.Handler) {
        Laya.loader.load(
            [{ url: this._aniUrl(this._package) + '_atlas0' + '.png', type: Laya.Loader.IMAGE },
            { url: this._aniUrl(this._package) + '.fui', type: Laya.Loader.BUFFER }],
            Laya.Handler.create(this, () => {
                this.onFuiLoaded();
                complete && complete.run();
                complete = null;
            }),
            null,
            Laya.Loader.IMAGE,
        );
    }

    public getMcCom = <T extends fgui.GComponent | FGUIEx.GMovieClip>(callBack: Laya.Handler, userClass?: new () => T) => {
        if (!this._swich) return;
        this.loadRes(Laya.Handler.create(this, this.onResLoaded, [callBack, userClass]));
    }

    /**
     * 清除所有Mc和Com
     */
    public clearMcAndCom() {
        this._swich = false;
        if (this._coms != null) {
            this._coms.forEach((com: any, index: number) => {
                com && com.dispose(false);
            });
            this._coms = null;
        }
        let pngUrl = this._aniUrl(this._package) + '_atlas0' + '.png';
        Laya.loader.cancelLoadByUrl(pngUrl);//不清理 fui
        Laya.loader.clearTextureRes(pngUrl);
    }
}
