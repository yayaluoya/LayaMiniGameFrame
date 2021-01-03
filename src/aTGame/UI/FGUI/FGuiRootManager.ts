import BaseUIMediator from "./BaseUIMediator";
import { EUILayer } from "./EUILayer";
import IUIClass from './UITool';
import ConsoleEx from "../../Console/ConsoleEx";
import FGuiData from "./FGuiData";
/**
 * FGUI根管理器
 */
export default class FGuiRootManager {
    //
    private static m_uiDataKey: symbol = Symbol('$UIData');

    //缓存fgui数据，通过它找fgui数据
    private static _cacheFguiData: object = {};

    //UI根节点列表
    public static LayerList: { [index: string]: fgui.GComponent };
    //单UI列表
    public static oneUIs: BaseUIMediator<any>[] = [];

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
     * @param fguiData fgui数据
     * @param layer 层级类型
     */
    public static AddUI(
        uiType: IUIClass,
        fguiData: FGuiData,
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
        //设置数据
        let _key: symbol = Symbol('fguiData');
        this._cacheFguiData[_key] = fguiData;
        //注入数据
        ui[this.m_uiDataKey] = _key;
        this.setUIData(ui, fguiData);
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
            console.warn(...ConsoleEx.packWarn('设置ui到最顶层失败，因为该层级里面没有该UI！'));
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
        let ui: fgui.GComponent;
        let _ui: fgui.GComponent;
        for (let i = 0, length = fgui.GRoot.inst.numChildren; i < length; ++i) {
            ui = fgui.GRoot.inst.getChildAt(i) as fgui.GComponent;
            ui.setSize(setWidth, setHeight);
            ui.y = 0;
            for (let _i = 0, _length = ui.numChildren; _i < _length; _i++) {
                _ui = ui.getChildAt(_i) as fgui.GComponent;
                //获取键入的数据
                let getData = this._cacheFguiData[_ui[this.m_uiDataKey]] as FGuiData;
                //判断是否更新数据
                if (getData.ifUpdate) {
                    //设置数据
                    this.setUIData(_ui, getData);
                }
            }
        }
    }

    /**
     * 设置UI数据
     * @param _ui UI
     * @param _uiData UI数据
     */
    private static setUIData(_ui: fgui.GObject, _uiData: FGuiData = new FGuiData()) {
        _ui.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height - _uiData.top - _uiData.bottom);
        _ui.y = _uiData.top;
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