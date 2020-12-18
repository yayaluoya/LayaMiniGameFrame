/**
 * fgui工具
 */
export default class FGUIUtils {
    /**
     * 设置一个UI的位置
     * @param _ui 目标UI
     * @param _pot 位置，可以是v3，v2，point等带有x，y属性的对象
     */
    public setXY(_ui: fgui.GObject, _pot: { x: number, y: number }) {
        _ui.setXY(_pot.x, _pot.y);
    }

    /**
     * 设置一个UI的大小
     * @param _ui 目标UI
     * @param _pot 高宽，可以是v3，v2，point等带有x，y属性的对象
     */
    public setSize(_ui: fgui.GObject, _pot: { x: number, y: number }) {
        _ui.width = _pot.x;
        _ui.height = _pot.y;
    }
}