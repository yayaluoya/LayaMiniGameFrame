<template>
    <div class="tree_node" v-if="ifShow && ifCom">
        <div
            class="name"
            :class="depth % 2 == 0 ? 'odd' : 'plural'"
            :style="{
                paddingLeft: depth * 20 + 'px',
            }"
            @click="show = !show"
        >
            <div class="title">
                <i
                    v-if="typeof node == 'object'"
                    :class="
                        show ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                    "
                >
                </i>
                <div class="name1" :class="{ protoName: name == '__proto__' }">
                    {{ name }}
                </div>
                <div class="name2">{{ TreeTool.getClassName(node) }}</div>
            </div>
            <div
                class="child_content"
                v-if="typeof node == 'string' && !ifFake"
            >
                <el-input v-model="value" size="mini"></el-input>
            </div>
            <div
                class="child_content"
                v-if="typeof node == 'number' && !ifFake"
            >
                <el-input-number v-model="value" size="mini"></el-input-number>
            </div>
            <div
                class="child_content"
                v-if="typeof node == 'boolean' && !ifFake"
            >
                <el-switch
                    v-model="value"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                >
                </el-switch>
            </div>
            <el-button
                icon="el-icon-search"
                class="child_content"
                circle
                size="mini"
                @click="cheshi"
            ></el-button>
            <div class="fake" v-if="ifFake">
                只读: {{ typeof node != "object" ? value : "" }}
            </div>
        </div>
        <div class="child_node" v-if="show && typeof node == 'object'">
            <TreeNode
                v-for="(item, key) in TreeTool.getKeys(node)"
                :key="key"
                :depth="depth + 1"
                :parent="name == '__proto__' ? parent : node"
                :name="item"
                @update="updateEmit"
            >
            </TreeNode>
        </div>
    </div>
</template>

<script>
import TreeTool from "../com/TreeTool";

//树形结构节点
export default {
    name: "TreeNode",
    props: {
        //父
        parent: {
            type: [Object, Array],
            default: () => {
                return {};
            },
        },
        //键名
        name: {
            type: [String, Number],
            default: "",
        },
        //深度|层级
        depth: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            updateNumber: 1,
            TreeTool: TreeTool,
            show: false, //控制子节点是否显示
            value: "",
            ifFake: false, //是否限制
            ifCom: false,
        };
    },
    computed: {
        ifShow() {
            return (
                typeof this.node != "object" ||
                TreeTool.getKeys(this.node).length > 0
            );
        },
        node() {
            //强行注入依赖
            if (this.updateNumber > 0) {
                //判断是否限制，是的话就返回不受监听的限制数据
                if (this.ifFake) {
                    return this.$Fakedata;
                }
                return this.parent[this.name];
            } else {
                return null;
            }
        },
    },
    watch: {
        value() {
            this.$emit("update", this.name, this.value, true, this.ifFake);
            //
            this.updateNumber++;
        },
        show() {
            this.updateNumber++;
        },
    },
    methods: {
        cheshi() {
            console.log(this);
            console.log(this.node);
            console.log(this.$Fakedata);
            console.log(this.parent, this.name, this.parent[this.name]);
        },
        updateEmit(key, value, ifSetValue, ifFake) {
            if (!this.ifCom) {
                return;
            }
            if (!ifFake) {
                //判断是否修改数据
                if (ifSetValue) {
                    this.parent[this.name][key] = value;
                } else {
                    this.parent[this.name][key] = this.parent[this.name][key];
                }
            } else {
                this.$Fakedata = this.node;
            }
            this.$emit(
                "update",
                this.name,
                this.parent[this.name],
                false,
                this.ifFake
            );
            //
            this.updateNumber++;
        },
    },
    mounted() {
        if (!this.TreeTool.ifShowKey(this.parent, this.name)) {
            this.$Fakedata = this.node;
            this.ifFake = true;
        }
        if (typeof this.node != "object") {
            this.value = this.node;
        }
        //
        this.updateNumber++;
        //
        setTimeout(() => {
            this.ifCom = true;
        }, 10);
    },
};
</script>

<style scoped lang="scss">
.tree_node {
    border-radius: 2px;
    text-align: left;
    box-sizing: border-box;
    > .name {
        font-size: 12px;
        font-weight: bold;
        line-height: 1.7;
        border-radius: 2px;
        &:hover {
            background-color: #f5f7fa;
        }
        > .title {
            display: flex;
            align-items: center;
            line-height: 1;
            padding: 5px 0;
            cursor: pointer;
            > i {
                font-size: 20px;
                margin-left: -5px;
            }
            > .name1 {
                color: #14274e;
                margin-right: 5px;

                &.protoName {
                    color: #cd0a0a;
                }
            }
            > .name2 {
                color: #7e8a97;
                margin-right: 5px;
                font-weight: 500;
            }
        }
        /deep/.el-input__inner {
            padding: 5px;
        }
        > .child_content {
            font-size: 15px;
            font-weight: 400;
            line-height: 1.5;
            width: fit-content;
            border-radius: 2px;
            padding-bottom: 5px;
        }
        > .fake {
            color: #ff4b5c;
        }
    }
}
</style>
