export namespace EnvironmentConfig {
    export class config {
        /** 关卡id */ readonly id: number;
        /** 摄像机清除颜色 */ readonly clear_color: string;
        /** 环境光颜色 */ readonly ambient_color: string;
        /** 灯光颜色 */ readonly light_color: string;
        /** 灯光强度 */ readonly light_intensity: number;
    }
    export var data : {[key: number]: EnvironmentConfig.config};
    export var dataList : EnvironmentConfig.config[];
    export var lastData : EnvironmentConfig.config;
    export const path = "res/config/EnvironmentConfig.json";
}


