/**
 * UI类型,必须满足这个要求的ui才能被使用
 */
export default interface IUIClass {
    [index: string]: any,

    /** 创建一个实例 */
    createInstance(): fgui.GComponent,
}