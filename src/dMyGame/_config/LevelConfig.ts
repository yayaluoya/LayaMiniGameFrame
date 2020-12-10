export namespace LevelConfig {
    export class config {
        /** 关卡id[必要] */ readonly id: number;
        /** 根场景 */ readonly rootScene: string;
        /** 场景名字列表[必要] */ readonly sceneName: string;
        /** 需要加载的其他资源节点列表 */ readonly sceneOtherRes: string;
    }
    export var data : {[key: number]: LevelConfig.config};
    export var dataList : LevelConfig.config[];
    export var lastData : LevelConfig.config;
    export const path = "res/config/LevelConfig.json";
}


