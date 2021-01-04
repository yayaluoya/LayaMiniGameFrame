import ProScriptLink from '../ProScriptLink';
import ProStampScript from './ProStampScript';
import BaseProVo from '../vo/BaseProVo';
import BasePorMediator from '../mediator/BasePorMediator';
import { EProcessor } from '../../c_Enum/EProcessor';
import { IPrefabsGather } from 'src/aTGame/3D/SceneUtils';
/**
 * 加工者基类
 */
export default class BasePrefabPro extends ProScriptLink {
    //是否添加工者印记脚本
    protected ifAddProStampScript: boolean = false;

    //是否添加进父节点
    protected ifAddParentNode: boolean = false;

    //父节点
    protected m_parentNode: Laya.Sprite3D;

    //预制体列表
    protected m_sprList: Laya.Sprite3D[];

    //vo
    protected m_vo: BaseProVo<BasePrefabPro>;

    //调度者
    protected m_mediator: BasePorMediator<BasePrefabPro>;

    /** 获取预制体列表 */
    public get sprList(): Laya.Sprite3D[] {
        return this.m_sprList;
    }

    /** 父节点 */
    public get parentNode(): Laya.Sprite3D {
        return this.m_parentNode;
    }

    /** 设置数据Vo */
    public set _vo(_vo: BaseProVo<BasePrefabPro>) {
        this.m_vo = _vo;
        this.m_vo._initPro(this);
    }

    /** 设置调度者 */
    public set _mediator(_me: BasePorMediator<BasePrefabPro>) {
        this.m_mediator = _me;
        this.m_mediator._initPro(this);
    }

    //预制体Id分类列表，当加工多种预制体时便于区分
    protected m_sprIdClassList: {
        [index: string]: number[];
    }

    public constructor(_plantTypeof: EProcessor) {
        super(_plantTypeof);
        this.onlyInit();
    }

    /**
     * 唯一的一次init
     */
    protected onlyInit() { }

    // 初始化
    private _init() {
        //判断是否把内容添加进一个父节点
        if (this.ifAddParentNode) {
            //创建父节点
            this.m_parentNode = new Laya.Sprite3D();
        }
    }

    /**
     * 开始加工物体
     * @param _content
     */
    public startPor(_content: IPrefabsGather) {
        //
        this._init();
        this.initExtend();
        this.init();
        //保留这个列表
        this.m_sprList = this.proSpr(_content);
        //扩展
        this.sprInitExtend();
        //预制体初始化完毕
        this.sprInit();
    }

    /**
     * 添加物体并加工
     * @param _content 物体列表包括分类 
     */
    public addSprAndPor(_content: IPrefabsGather) {
        let _sprList: Laya.Sprite3D[] = this.proSpr(_content);
        this.m_sprList.push(..._sprList);
        //添加完成
        this.addSprAndProCom(_sprList);
    }

    /**
     * 添加预制体并处理完成
     */
    protected addSprAndProCom(_sprs: Laya.Sprite3D[]) { }

    /**
     * 开始初始化 (使用时重写覆盖)
     */
    protected init() { }
    /**
     * 该生命周期的扩展方法，在原生命周期方法前执行 (使用时重写覆盖)
     */
    protected initExtend() { }

    /**
     * 对每个预制体进行设置 (使用时重写覆盖)
     * @param _spr 每个预制体精灵
     */
    protected setSpr(_spr: Laya.Sprite3D) { }
    /**
     * 该生命周期的扩展方法，在原生命周期方法前执行 (使用时重写覆盖)
     * @param _spr 每个预制体精灵
     */
    protected setSprExtend(_spr: Laya.Sprite3D) { }

    /**
     * 预制体初始化完成 (使用时重写覆盖)
     */
    protected sprInit() { }
    /**
     * 该生命周期的扩展方法，在原生命周期方法前执行 (使用时重写覆盖)
     */
    protected sprInitExtend() { }

    /**
     * 通过某个预制体查找该预制体的分类
     * @param param 该预制体
     */
    public getSprClass({ id }: Laya.Sprite3D): string {
        for (let _class in this.m_sprIdClassList) {
            if (this.m_sprIdClassList[_class].findIndex((item) => { return item == id }) != -1) {
                return _class;
            }
        }
    }

    /**
     * 获取需要添加加工者印记脚本的精灵(默认是根节点精灵有且只有一个)
     */
    protected getAddCommonScrSpr(_spr: Laya.Sprite3D): Laya.Sprite3D {
        return _spr;
    }

    /**
     * 获取某个精灵的加工印记列表
     * @param _spr 该精灵
     */
    protected static getProStamp(_spr: Laya.Sprite3D): EProcessor[] {
        let _scr: ProStampScript = _spr.getComponent(ProStampScript) as ProStampScript;
        if (_scr) {
            return _scr.proStamp;
        } else {
            return [];
        }
    }

    //* ------------------------------私有方法-------------------------------- *//

    //处理预制体
    private proSpr(_content: IPrefabsGather): Laya.Sprite3D[] {
        let _sprList: Laya.Sprite3D[] = [];
        for (let _class in _content) {
            //检查是否有内容
            if (_content[_class]) {
                _sprList.push(..._content[_class]);
                //设置工厂分类id
                this.addSprIdClassList(_class, _content[_class]);
            }
        }
        //遍历处理所有的预制体
        _sprList.forEach((item) => {
            //添加进父节点
            if (this.ifAddParentNode) {
                this.m_parentNode.addChild(item);
            }
            //添加加工者印记脚本
            this.addProStampCommonScr(this.getAddCommonScrSpr(item));
            //执行生命周期函数
            this.setSprExtend(item);
            this.setSpr(item);
        });
        //
        return _sprList;
    }

    //添加预制体ID分类
    private addSprIdClassList(_class: string, _sprs: Laya.Sprite3D[]) {
        if (!_sprs) return;
        if (!this.m_sprIdClassList) {
            this.m_sprIdClassList = {};
        }
        if (!this.m_sprIdClassList[_class]) {
            this.m_sprIdClassList[_class] = [];
        }
        let _ids: number[] = _sprs.map((item: Laya.Sprite3D): number => {
            return item.id;
        });
        this.m_sprIdClassList[_class].push(..._ids);
        //去重
        let _sets: Set<number> = new Set(this.m_sprIdClassList[_class]);
        this.m_sprIdClassList[_class] = Array.from(_sets);
    }

    //对每个精灵添加加工者印记脚本
    private addProStampCommonScr(_spr: Laya.Sprite3D) {
        if (!this.ifAddProStampScript) return;
        let _scr: ProStampScript;
        let __scr: ProStampScript;
        //查看该物体是否已经添加过加工者脚本
        __scr = _spr.getComponent(ProStampScript) as ProStampScript;
        if (__scr) {
            _scr = __scr;
        } else {
            _scr = _spr.addComponent(ProStampScript) as ProStampScript;
        }
        //添加加工印记
        _scr.addProStamp(this.proTypeof);
    }
}