import BaseAnimation from './BaseAnimation';
/**
 * 基类动画状态脚本
 * 每个动画都带有的
 */
export default class BaseAnimatorState extends Laya.AnimatorStateScript {
    //动画控制器
    private m_AnimationCon: BaseAnimation;
    //动画名字
    private m_name: string;
    //额外数据
    private m_param: any;

    public setAnimationCom(_aniCon: BaseAnimation, _name: string = '', _param?: any) {
        this.m_AnimationCon = _aniCon;
        this.m_name = _name;
        this.m_param = _param;
    }

    /**
     * 动画状态开始时执行。
     */
    onStateEnter() {
        this.m_AnimationCon.onStateEnter(this.m_name, this.m_param);
    }

    /**
     * 动画状态更新时执行。
     */
    onStateUpdate() {
        this.m_AnimationCon.onStateUpdate(this.m_name, this.m_param);
    }

    /**
     * 动画状态退出时执行。
     */
    onStateExit() {
        this.m_AnimationCon.onStateExit(this.m_name, this.m_param);
    }
}