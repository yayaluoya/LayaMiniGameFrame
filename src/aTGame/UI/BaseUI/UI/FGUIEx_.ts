import CommomMcUtils from '../mc/CommomMcUtils';
/**
 * FGUI扩展
 */
export module FGUIEx_ {
    /**
     * FGUI加载等待类
     */
    export class GLoader extends fgui.GLoader {
        /**
         * 赋值并清理上一次的资源 ''可作为清理
         */
        public set urlAndClearLast(value: string) {
            if (this.url && this.url != value) {
                if (!fgui.ToolSet.startsWith(this.url, "ui://"))
                    Laya.loader.clearTextureRes(this.url);
                let movie = this.displayObject.destroyed ? null : this.content;
                if (movie && movie instanceof fgui.MovieClip) {
                    let packItem = this['_contentItem'] as fgui.PackageItem;
                    CommomMcUtils.clearMcTimesByType(packItem ? packItem.owner.name : '');
                }
            }
            this.url = value;
        }

        //loader 动画   暂不支持组件
        public setUrlByPack(pkgName: string, itemName: string) {
            let pkgItem: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
            if (pkgItem && Laya.loader.getRes(pkgItem.customId + '.fui')) {
                this.urlAndClearLast = fgui.UIPackage.getItemURL(pkgName, itemName);
                if (this.content && this.content instanceof fgui.MovieClip) {
                    CommomMcUtils.addMcNode(pkgName);
                }
            }
            else {
                this.urlAndClearLast = '';
                CommomMcUtils.loadMcRes(pkgName, Laya.Handler.create(this, () => {
                    if (!this._displayObject.destroyed && this.url == '') {
                        this.setUrlByPack(pkgName, itemName);
                    }
                }));
            }
        }

        public set sizeGrid(value: string) {
            if (this.content instanceof Laya.Image) {
                this.content.sizeGrid = value;
            }
        }

        dispose() {
            this.urlAndClearLast = '';
            super.dispose();
        }
    }
}