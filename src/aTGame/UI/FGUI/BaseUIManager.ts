import ConsoleEx from "../../Console/ConsoleEx";
import ArrayUtils from "../../Utils/ArrayUtils";
import BaseUIMediator from "./BaseUIMediator";
import RootUIStateManagerProxy from "./RootUIStateManagerProxy";
/**
 * UI管理器基类
 * 因配合UIStateManagerProxy类一起管理UI
 */
export default class BaseUIManager<UIProxy extends RootUIStateManagerProxy> {
    //UI调度者列表
    protected m_UIMediator: { [index: string]: BaseUIMediator<fgui.GComponent> };

    //UI代理类
    protected m_UIProxy: UIProxy;

    //
    public constructor() {
        //
        this.initUIMediator();
        //
        this._initUIMediator();
    }

    /** 初始化UI调度者列表和代理类 */
    protected initUIMediator() { }

    //初始化UI列表之后
    private _initUIMediator() {
        if (!this.m_UIMediator) {
            console.error(...ConsoleEx.packError('没有注册UI状态列表'));
        }
        let _length: number = 0;
        for (let _i in this.m_UIMediator) {
            _length++;
            if (typeof this.m_UIMediator[_i] == "undefined" || !this.m_UIMediator[_i]) {
                console.warn(...ConsoleEx.packWarn('有一个UIMediator不存在', _i));
            }
        }
        if (_length == 0) {
            console.warn(...ConsoleEx.packWarn('UI状态列表长度为0'));
        }
        //判断是否注册UI代理
        if (!this.m_UIProxy) {
            console.warn(...ConsoleEx.packWarn('没有注册UI代理类。'));
        }
        this.m_UIProxy.setProxyMediatroList(this.m_UIMediator);
        //
        let _serialNumber: number[];
        let _serialNumberLenth: number;
        for (let _i in this.m_UIMediator) {
            this.m_UIMediator[_i].keyId = _i;
            //检测树形结构
            _serialNumber = [];
            this.getUIBelongSerialNumber(this.m_UIMediator[_i], _serialNumber);
            //检测是否有重复使用的附属UI
            _serialNumberLenth = _serialNumber.length;
            _serialNumber = ArrayUtils.Unique<number>(_serialNumber);
            if (_serialNumberLenth != _serialNumber.length) {
                console.error(...ConsoleEx.packError('UI调度者', _i, '的附属UI有重复出现！'));
            }
        }
    }

    //获取一个UI调度者的附属UI序号列表
    private getUIBelongSerialNumber(_UIMed: BaseUIMediator<fgui.GComponent>, _numbers: number[], _ifR: boolean = false) {
        if (_UIMed.belongDownUIMediator.length > 0) {
            _UIMed.belongDownUIMediator.forEach((item) => {
                this.getUIBelongSerialNumber(item, _numbers, true);
            });
        }
        //判断是否为附属UI
        if (!_ifR) {
            if (_UIMed.ifBelongUIMediator) {
                console.warn(...ConsoleEx.packWarn('注意！有一个附属UI调度者被添加进了UI管理器列表中，它将不会被显示。'));
            }
        } else {
            if (!_UIMed.ifBelongUIMediator) {
                console.warn(...ConsoleEx.packWarn('注意！有一个不是附属的UI调度者被添加进了附属列表中'));
            }
        }
        _numbers.push(_UIMed.serialNumber);
        //
        if (_UIMed.belongUpUIMediator.length > 0) {
            _UIMed.belongUpUIMediator.forEach((item) => {
                this.getUIBelongSerialNumber(item, _numbers, true);
            });
        }
    }
}