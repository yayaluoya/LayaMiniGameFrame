/**
 * UI类型,必须满足这个要求的ui才能被使用
 */
export default interface IUIClass {
    [index: string]: any,
    createInstance(): fgui.GComponent,
}