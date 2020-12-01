/**
 * fGUI扩展
 */
export module FGUIEx {
    /**
     * 组件扩展
     */
    export class GComponent extends fgui.GComponent {
        /**
         * 通过子物体名字获取子物体
         * @param name 
         */
        public getChildByName(name: string) {
            let cnt: number = this._children.length;
            for (let i: number = 0; i < cnt; ++i) {
                if (this._children[i].name == name)
                    return this._children[i];
            }
            return null;
        }
    }

    /**
     * 动画裁剪类扩展
     */
    export class GMovieClip extends fgui.GMovieClip {
        public stop() {
            this.playing = false;
        }

        public stopAtFrame(value: number) {
            this.stop();
            this.frame = value;
        }

        public dispose() {
            this.stop(); //销毁的动画无完成回调
            super.dispose();
        }

        /**
         * 播放一次
         * @param endHandler 完成时回调
         * @param dispose 播放完成后是否删除
         * @param endFrame 间隔第几帧
         */
        public playOnce(endHandler: Laya.Handler, dispose: boolean = true, endFrame: number = -1) {
            endFrame = dispose ? -1 : endFrame;
            this.setPlaySettings(0, -1, 1, endFrame, Laya.Handler.create(this, (endHandler: Laya.Handler) => {
                endHandler && endHandler.run();
                dispose && this.dispose();
            }, [endHandler]));
        }
    }
}