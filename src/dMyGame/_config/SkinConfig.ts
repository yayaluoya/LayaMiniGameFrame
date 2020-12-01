export namespace SkinConfig {
    export class config {
        /** 位移索引 */ readonly id: number;
        /** 名字 */ readonly name: string;
        /** 皮肤图片路径 */ readonly ImageURL: string;
        /** 说明 */ readonly explain: string;
    }
    export var data : {[key: number]: SkinConfig.config};
    export var dataList : SkinConfig.config[];
    export var lastData : SkinConfig.config;
    export const path = "res/config/SkinConfig.json";
}


