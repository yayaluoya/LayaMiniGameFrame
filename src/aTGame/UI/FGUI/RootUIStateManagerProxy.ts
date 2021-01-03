import RootClassProxy from "../../Root/RootClassProxy";
import ArrayUtils from "../../Utils/ArrayUtils";
import BaseUIMediator from './BaseUIMediator';
import { EUILayer } from "./EUILayer";
import { EUI } from '../../../dMyGame/Enum/EUI';
import ConsoleEx from "../../Console/ConsoleEx";
/**
 * UI状态代理管理器基类
 * 直接Show显示的ui不受管理
 * 只能管理单页面UI
 * 注意！每次修改UI状态时都会改节点
 */
export default class RootUIStateManagerProxy extends RootClassProxy {
    //UI调度者列表
    private m_UIMediator: { [index: string]: BaseUIMediator<fgui.GComponent> } = {};

    //当前显示的UI类型索引列表
    private m_onShowUI: IUIState[] = [];

    //是否设置过ui管理列表
    private m_ifSetMediatroList: boolean = false;

    /**
     * 设置代理调度者列表
     * @param _UIMediator 代理调度者列表
     */
    public setProxyMediatroList(_UIMediator: { [index: string]: BaseUIMediator<fgui.GComponent> }) {
        this.m_UIMediator = _UIMediator;
        this.m_onShowUI = [];
        this.m_ifSetMediatroList = true;
        //
        this.Init();
    }

    /**
     * 设置代理完成，初始化
     */
    protected Init() { }

    /** 是否初始化过代理 */
    public get ifSetMediatroList(): boolean {
        return this.m_ifSetMediatroList;
    }
    /** 获取当前显示的UI列表 */
    public get onShowUIs(): IUIState[] {
        return this.m_onShowUI;
    }

    /**
     * 通过索引获取某个UI调度者
     * @param _eui UI调度者索引枚举
     */
    public getUIMeiatro<T extends BaseUIMediator<fgui.GComponent>>(_eui: EUI): T {
        return this.m_UIMediator[_eui] as T;
    }

    /**
     * 关闭一个UI,不影响其他UI
     * @param _uiMeiatro 该UI的调度者
     */
    public closeUI(_uiMeiatro: BaseUIMediator<fgui.GComponent>) {
        this.setUIState([
            { typeIndex: _uiMeiatro.keyId, state: false },
        ], false);
    }

    /**
     * 设置UI状态
     * UI会在当前本来的UI层级根据状态列表显示
     * @param _uiStates 状态列表
     * @param _ifUnify 是否统一处理其他UI状态 默认为 true
     * @param _unifyState 统一处理其他UI的状态 默认为 {state: false, dispose: true}
     * 
     */
    public setUIState(
        _uiStates: IUIState[],
        _ifUnify: boolean = true,
        _unifyState: {
            /** 显示状态 */
            state: boolean,
            /** 隐藏时是否删除默认为true */
            dispose?: boolean
        } = { state: false, dispose: true },
        _showAffectLayer?: EUILayer[],
        _hideAffectLayer?: EUILayer[],
    ) {
        //判断是否设置过ui代理列表
        if (!this.m_ifSetMediatroList) {
            console.error(...ConsoleEx.packError('还没有为UI代理类设置代理UI调度者列表！'));
            return;
        }
        //自动设置ui状态列表
        for (let _o of _uiStates) {
            //设置显示状态默认为true
            if (typeof _o.state == 'undefined') {
                _o.state = true;
            }
            //设置默认删除
            if (typeof _o.dispose == 'undefined') {
                _o.dispose = true;
            }
        }
        //自动设置统一处理ui状态
        if (typeof _unifyState.dispose == 'undefined') {
            _unifyState.dispose = true;
        }
        //
        let _showUI: IUIState[] = [];//需要显示的UI
        let _hideUI: IUIState[] = [];//需要隐藏的UI
        //数组去重
        _uiStates = ArrayUtils.ObjUnique<IUIState>(_uiStates, (item) => {
            return item.typeIndex;
        });
        //过滤不存在的状态
        _uiStates = this.statesFilter(_uiStates);
        //取出需要显示和需要隐藏的UI
        let _i: number;
        for (let _o of _uiStates) {
            if (_o.state) {
                _i = this.m_onShowUI.findIndex((item) => { return item.typeIndex == _o.typeIndex });
                if (_i != -1) {
                    this.m_onShowUI.splice(_i, 1);
                }
                _showUI.push(_o);
            } else {
                _i = this.m_onShowUI.findIndex((item) => { return item.typeIndex == _o.typeIndex });
                if (_i != -1) {
                    this.m_onShowUI.splice(_i, 1);
                    _hideUI.push(_o);
                }
            }
        }
        //判断是否统一处理其他ui
        if (_ifUnify) {
            //找到没有出现在显示和隐藏列表中的ui
            let _differS: IUIState[] = [];
            for (let _index in this.m_UIMediator) {
                if (
                    _showUI.findIndex((item) => { return item.typeIndex == _index }) == -1 &&
                    _hideUI.findIndex((item) => { return item.typeIndex == _index }) == -1
                ) {
                    _differS.push({
                        typeIndex: _index,
                        state: _unifyState.state,
                        dispose: _unifyState.dispose,
                    });
                }
            }
            //全部显示
            if (_unifyState.state) {
                //添加到需要显示的ui下面
                _showUI.unshift(..._differS);
            }
            //全部隐藏
            else {
                //添加到需要隐藏的ui下面
                _hideUI.push(..._differS);
            }
        } else {
            //融合本来就显示的ui列表到显示列表中
            _showUI.unshift(...this.m_onShowUI);
        }
        // console.log('设置层级前', _showUI, _hideUI);
        //检测是否在受影响列表中
        if (typeof _showAffectLayer != 'undefined') {
            //先去重
            _showAffectLayer = ArrayUtils.Unique(_showAffectLayer);
            // console.log('层级', _affectLayer);
            //过滤需要显示的列表，去掉受影响层级之外的元素
            _showUI = _showUI.filter((item) => {
                return _showAffectLayer.findIndex((layer) => { return layer == this.m_UIMediator[item.typeIndex].layer }) != -1;
            });
        }
        if (typeof _hideAffectLayer != 'undefined') {
            //先去重
            _hideAffectLayer = ArrayUtils.Unique(_hideAffectLayer);
            //过滤需要显示的列表，去掉受影响层级之外的元素
            _hideUI = _hideUI.filter((item) => {
                return _hideAffectLayer.findIndex((layer) => { return layer == this.m_UIMediator[item.typeIndex].layer }) != -1;
            });
        }
        // console.log('设置层级后', _showUI, _hideUI);
        //隐藏上一批需要隐藏的列表
        for (let _o of _hideUI) {
            if (this.m_UIMediator[_o.typeIndex].ifBelongUIMediator) {
                console.warn(...ConsoleEx.packWarn('有一个附属UI的UI调度者试图被隐藏，KEY为', this.m_UIMediator[_o.typeIndex].keyId));
                continue;
            }
            //递归隐藏该UI和它的所有附属
            this.hideUIMediator(this.m_UIMediator[_o.typeIndex], _o.dispose);
        }
        //显示在显示列表里面的全部UI
        for (let _o of _showUI) {
            if (this.m_UIMediator[_o.typeIndex].ifBelongUIMediator) {
                console.warn(...ConsoleEx.packWarn('有一个附属UI的UI调度者试图被显示，KEY为', this.m_UIMediator[_o.typeIndex].keyId));
                continue;
            }
            //递归显示该UI和它的所有附属
            this.showUIMediator(this.m_UIMediator[_o.typeIndex]);
        }
        //保存当前显示的ui列表
        this.m_onShowUI = _showUI;
    }

    /**
     * 是否存在的调度者ui过滤器
     * @param _o 
     */
    private statesFilter(_states: IUIState[]): IUIState[] {
        return _states.filter((_o) => {
            return typeof this.m_UIMediator[_o.typeIndex] != 'undefined';
        });
    }

    //隐藏一个UI
    private hideUIMediator(_UIMed: BaseUIMediator<fgui.GComponent>, _dispose: boolean, _ifR: boolean = false) {
        if (_UIMed.belongUpUIMediator.length > 0) {
            _UIMed.belongUpUIMediator.forEach((item) => {
                this.hideUIMediator(item, _dispose, true);
            });
        }
        //
        if (!_ifR || _UIMed.ifBelongUIMediator) {
            _UIMed.Hide(_dispose);
        } else {
            console.warn(...ConsoleEx.packWarn('有一个不是附属UI的UI调度者试图被隐藏，KEY为', _UIMed.keyId));
        }
        //
        if (_UIMed.belongDownUIMediator.length > 0) {
            _UIMed.belongDownUIMediator.forEach((item) => {
                this.hideUIMediator(item, _dispose, true);
            });
        }
    }

    //显示一个UI
    private showUIMediator(_UIMed: BaseUIMediator<fgui.GComponent>, _ifR: boolean = false) {
        if (_UIMed.belongDownUIMediator.length > 0) {
            _UIMed.belongDownUIMediator.forEach((item) => {
                this.showUIMediator(item, true);
            });
        }
        //
        if (!_ifR || _UIMed.ifBelongUIMediator) {
            _UIMed.Show();
        } else {
            console.warn(...ConsoleEx.packWarn('有一个不是附属UI的UI调度者试图被显示，KEY为', _UIMed.keyId));
        }
        //
        if (_UIMed.belongUpUIMediator.length > 0) {
            _UIMed.belongUpUIMediator.forEach((item) => {
                this.showUIMediator(item, true);
            });
        }
    }
}

/**
 * UI状态
 */
export interface IUIState {
    /** Ui类型索引 */
    typeIndex: string;

    /** 显示状态 */
    state?: boolean;

    /** 隐藏是否删除 */
    dispose?: boolean;
}