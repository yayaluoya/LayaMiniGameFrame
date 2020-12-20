import BaseAnimation from './BaseAnimation';
import BaseAnimatorState from './BaseAnimatorState';
/**
 * 动画播放控制器
 */
export default abstract class BaseAnimationCon<Name> extends BaseAnimation {
    //
    protected m_aniCon: Laya.Animator;
    //
    protected m_canPlayNames: string[];

    /**
     * 根据动画控制器初始化
     * @param _aniCon 动画控制器
     */
    public constructor(_aniCon: Laya.Animator) {
        super();
        this.m_canPlayNames = [];
        this.m_aniCon = _aniCon;
        //获取全部动画的名字并添加状态
        let _aniNames: string[] = this.getAllAnimatorName();
        for (let _o of _aniNames) {
            //
            let state = _aniCon.getControllerLayer().getAnimatorState(_o);
            //给该动画状态添加脚本
            if (state) {
                this.m_canPlayNames.push(_o);
                let asst: BaseAnimatorState = state.addScript(BaseAnimatorState) as BaseAnimatorState;
                asst.setAnimationCom(this, _o, this.getAniStateParam(_o));
            }
            // console.log('可播放动画状态', this.m_canPlayNames);
        }
    }

    /** 
     * 获取动画控制器
     */
    public get aniCon(): Laya.Animator {
        return this.m_aniCon;
    }

    /**
     * 播放动画
     * @param _T 动画类型
     * @param _speed 播放速度
     * @param _transitionDuration 动画切换到目标状态的过渡时间
     * @param _normalizedTime 动画播放时的归一化时间
     * @param _handle 动画播放完成时的回调
     */
    public play(_name: Name, _speed: number = 1, _transitionDuration: number = 0, _normalizedTime: number = 0) {
        this.m_aniCon.speed = _speed;
        //
        this._playAnimation(_name);
        //播放指定动画
        this.playAnimation(_name, _transitionDuration, _normalizedTime);
        //
        this.onPlayAnimation(_name);
    }

    //获取动画状态参数
    protected getAniStateParam(_name: string): any {
        return undefined;
    }

    //动画播放前
    protected _playAnimation(_name: Name) { }

    /**
     * 播放某个动画(父类回调)
     * @param _name 名字 
     * @param _transitionDuration 过渡时间
     * @param _normalizedTime 起始归一化时间
     */
    protected abstract playAnimation(_name: Name, _transitionDuration?: number, _normalizedTime?: number);

    //动画播放后执行
    protected onPlayAnimation(_name: Name) { }

    /**
     * 获取全部动画的名字(父类回调)
     */
    protected abstract getAllAnimatorName(): string[];

    //获取动画播放状态归一化时间
    public get aniPlayStateNormalizedTime(): number {
        return this.m_aniCon.getControllerLayer().getCurrentPlayState().normalizedTime;
    }

    //设置动画播放速度
    public setAniPlaySpeed(_speed: number) {
        this.m_aniCon.speed = _speed;
    }
}