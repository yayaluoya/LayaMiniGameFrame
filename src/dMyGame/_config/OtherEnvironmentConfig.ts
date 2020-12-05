export namespace OtherEnvironmentConfig {
    export class config {
        /** 关卡id */ readonly id: number;
        /** 关卡名字 */ readonly name: string;
        /** 摄像机清除颜色 */ readonly clear_color: string;
        /** 环境光颜色 */ readonly ambient_color: string;
        /** 灯光颜色 */ readonly light_color: string;
        /** 灯光强度 */ readonly light_intensity: number;
    }
    export var data : {[key: number]: OtherEnvironmentConfig.config};
    export var dataList : OtherEnvironmentConfig.config[];
    export var lastData : OtherEnvironmentConfig.config;
    export const path = "res/config/OtherEnvironmentConfig.json";
}


