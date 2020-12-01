/**
 * Oimo物理常量
 */
export default class OimoConst {
    /** 时间步长 */
    public static timestep: number = 1 / 60;

    /** 迭代次数 */
    public static iterations: number = 24;

    /** 1 brute force, 2 sweep and prune, 3 volume tree */
    public static broadphase: number = 2;

    /** scale full world  */
    public static worldscale: number = 1;

    /** randomize sample */
    public static random: boolean = true;

    /** calculate statistic or not */
    public static info: boolean = false;

    /** 重力 */
    public static gravity: number[] = [0, -9.8, 0];
}