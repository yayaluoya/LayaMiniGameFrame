export namespace LevelPropConfig {
    export class config {
        /** 关卡id[必要] */ readonly id: number;
    }
    export var data : {[key: number]: LevelPropConfig.config};
    export var dataList : LevelPropConfig.config[];
    export var lastData : LevelPropConfig.config;
    export const path = "res/config/LevelPropConfig.json";
}


