/**
 * 基类动画控制器
 */
export default class BaseAnimation {
    /**
     * 动画状态开始时执行
     * @param _name 动画名字
     * @param _param 动画附带额外的参数
     */
    public onStateEnter(_name: string, _param: any) { }

    /**
     * 动画状态更新时执行
     * @param _name 动画名字
     * @param _param 动画附带额外的参数
     */
    public onStateUpdate(_name: string, _param: any) { }

    /**
     * 动画状态退出时执行
     * @param _name 动画名字
     * @param _param 动画附带额外的参数
     */
    public onStateExit(_name: string, _param: any) { }

}