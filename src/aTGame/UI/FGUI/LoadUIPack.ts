/**
 * 加载UI包类
 */
export class LoadUIPack {
    // 包路径
    private packPath: string;
    // 其他资源数量
    private atliasCount: number;
    //额外的UI资源
    private m_extraURL: any[];

    /**
     * 加载包
     * @param packPath 包路径 
     * @param atliasCount 图集数量
     * @param _extraURL 额外的资源
     */
    constructor(packPath: string, atliasCount: number = -1, _extraURL?: any[]) {
        this.packPath = packPath;
        this.atliasCount = atliasCount;
        this.m_extraURL = _extraURL
    }

    /**
     * 获取所有路径
     * @param urls 输出数组
     */
    public PushUrl(urls: any[]) {
        //加入包名
        urls.push({ url: this.packPath + ".bin", type: Laya.Loader.BUFFER });
        //加入其它资源
        if (this.m_extraURL && this.m_extraURL.length > 0) {
            urls.push(...this.m_extraURL);
        }
        //加载纹理集
        if (this.atliasCount >= 0) {
            urls.push({ url: this.packPath + "_atlas0.png", type: Laya.Loader.IMAGE });
            //
            for (let i = 1; i <= this.atliasCount; i++) {
                urls.push({ url: this.packPath + "_atlas0_" + i + ".png", type: Laya.Loader.IMAGE });
            }
        }
    }

    /**
     * 添加包
     */
    public AddPackage() {
        fgui.UIPackage.addPackage(this.packPath);
    }
}