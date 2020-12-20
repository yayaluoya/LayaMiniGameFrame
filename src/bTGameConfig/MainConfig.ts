/**
 * 项目最高层不需要配表的配置
 */
export default class MainConfig {
    /** 游戏所属团队 */
    public static readonly GameWhatTeam: string = '小小游戏';

    /** 游戏名字，尽量不要出现中文和特殊字符*/
    public static readonly GameName: string = 'LayaMiniGame';

    /** 中文名字 */
    public static readonly GameName_: string = 'LayaBox小游戏';

    /** 游戏说明 */
    public static readonly GameExplain: string = 'LayaBox小游戏';

    /** 数据版本 可以带字母但是尽量不要出现中文和特殊字符*/
    public static readonly versions: string = '0.0.0';

    /** 是否上线为false则是开发环境 */
    public static readonly OnLine: boolean = false;
}