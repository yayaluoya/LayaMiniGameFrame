import FGuiData from "./FGuiData";
import BaseUIMediator from "./BaseUIMediator";
import Dictionary from '../../Utils/Dictionary';
import { EUILayer } from "./EUILayer";
import IUIClass from './UITool';
import ConsoleEx from "../../Console/ConsoleEx";
/**
 * FGUI根管理器
 */
export default class FGuiRootManager {
    /** 顶部距离 */
    public static top: number = 0;
    /** 底部距离 */
    public static bottom: number = 0;

    //缓存
    private static _cacheMap: Dictionary<string, FGuiData> = new Dictionary<string, FGuiData>();
    //UI根节点列表
    public static LayerList: { [index: string]: fgui.GComponent };
    //单UI列表
    public static oneUIs: BaseUIMediator<any>[] = [];

    public static: fgui.GObject;

    // 获取某一层UI根节点
    private static getLayer(layerType: EUILayer): fgui.GComponent {
        //
        return this.LayerList[layerType];
    }

    /**
     * 初始化
     */
    public static Init() {
        // 设置包名后缀
        fgui.UIConfig.packageFileExtension = "bin";
        Laya.stage.addChild(fgui.GRoot.inst.displayObject);
        //添加FGUI根节点按顺序显示
        this.LayerList = {};
        for (let _i in EUILayer) {
            this.LayerList[EUILayer[_i]] = fgui.GRoot.inst.addChild(new fgui.GComponent()) as fgui.GComponent;
        }
        //更新所有UI并添加监听
        this.UpdateAllUI();
        Laya.stage.on(Laya.Event.RESIZE, this, this.UpdateAllUI);
    }

    /**
     * 创建一个UI并添加到对应层级
     * @param uiType UI类型，必须包含一个初始化实例的方法
     * @param param FGUI数据
     * @param layer 层级类型
     */
    public static AddUI(
        uiType: IUIClass,
        param: FGuiData = null,
        layer: EUILayer,
    ): fgui.GObject {
        let ui = uiType.createInstance() as fgui.GObject;
        //判断是否是单ui如果是就隐藏该层级下的所有UI
        if (layer == EUILayer.OneUI) {
            let oneUIs = FGuiRootManager.oneUIs;
            if (oneUIs.length > 0) {
                oneUIs.forEach((panel: BaseUIMediator<any>) => {
                    panel && panel.Hide();
                })
            }
            //清空
            FGuiRootManager.oneUIs = [];
        }
        //添加到目标层级
        this.getLayer(layer).addChild(ui);
        if (param == null) {
            param = new FGuiData();
        }
        if (param == null || !param.needFitScreen) {
            ui.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        } else {
            ui.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height - this.top - this.bottom);
            ui.y = this.top;
        }
        //设置缓存
        this._cacheMap.set(ui.constructor.name, param);
        //
        window[ui.constructor.name] = ui;
        //
        return ui;
    }

    /**
     * 设置ui显示在最上层
     * @param _ui 目标ui
     * @param _layer 该ui所属的层级
     */
    public static setUIToTopShow(_ui: fgui.GObject, _layer: EUILayer) {
        let _layerCom: fgui.GComponent = this.getLayer(_layer);
        //判断该层级是否有该ui
        let _index: number = _layerCom.getChildIndex(_ui);
        if (_index == -1) {
            console.log(...ConsoleEx.packWarn('设置ui到最顶层失败，因为该层级里面没有该UI！'));
            return;
        }
        //先从顶层删除
        _ui.removeFromParent();
        //再次添加
        _layerCom.addChild(_ui);
    }

    /**
     * 更新所有UI
     */
    public static UpdateAllUI() {
        let setWidth = Laya.stage.width;
        let setHeight = Laya.stage.height;
        fgui.GRoot.inst.setSize(setWidth, setHeight);
        let childCount = fgui.GRoot.inst.numChildren;
        for (let i = 0; i < childCount; ++i) {
            let ui = fgui.GRoot.inst.getChildAt(i);
            let getData = this._cacheMap.get(ui.constructor.name);
            if (getData == null || !getData.needFitScreen) {
                ui.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            } else {
                ui.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height - this.top - this.bottom);
                ui.y = this.top;
            }
        }
    }

    /**
     * 判断某个点是否在某个UI内部
     * @param ui 
     * @param x 
     * @param y 
     */
    public static CheckIn(ui: fgui.GObject, x: number, y: number): boolean {
        if (x > ui.x && x < ui.x + ui.width && y > ui.y && y < ui.y + ui.height) {
            return true;
        }
        return false;
    }
}