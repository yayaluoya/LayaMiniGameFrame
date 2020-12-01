export namespace TestConst {
    export class config {
        /** 是否开启调试面板 */ readonly if_debug: boolean;
        /** 是否显示oimo物理网格 */ readonly if_show_oimo_mesh: boolean;
        /** oimo物理网格透明度 */ readonly oimo_mesh_diaphaneity: number;
    }
    export var data : TestConst.config;
    export const path = "res/config/TestConst.json";
}


