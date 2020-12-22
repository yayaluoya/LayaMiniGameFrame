/**
 * UI分层,按顺序显示
 */
export enum EUILayer {
    /** 背景页面 */
    Bg = 'EUILayer_Bg',
    /** 主界面  永远存在 */
    Main = "EUILayer_Main",
    /** 单UI 只能存在一个 */
    OneUI = 'EUILayer_OneUI',
    /** 面板  可以有很多 */
    Panel = "EUILayer_Panel",
    /** 弹窗 */
    Popup = "EUILayer_Popup",
    /** 道具 */
    Prop = 'EUILayer_Prop',
    /** 小部件 */
    Tip = "EUILayer_Tip",
    /** 暂停 */
    Pause = 'EUILayer_Pause',
    /** 设置 */
    Set = 'EUILayer_Set',
    /** 最高 */
    Top = 'EUILayer_Top',
    /** 加载页面 */
    Loading = 'EUILayer_Loading',
    /** 原生 */
    Native = 'EUILayer_Native',
}