<template>
    <div class="tree_node">
        <div
            class="name"
            :class="depth%2==0? 'odd':'plural'"
            :style="{
                paddingLeft: depth * 20 + 'px',
            }"
        >
            <div class="title">
                <i
                    v-if="typeof node == 'object'"
                    :class="
                        show ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                    "
                    @click="show = !show"
                >
                </i>
                <div class="name1">{{ name }}</div>
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    circle
                    @click="update"
                ></el-button>
                <div class="name2">{{ name }}</div>
            </div>
            <div class="child_content" v-if="typeof node == 'string'">
                <el-input v-model="parent[name]" size="mini"></el-input>
            </div>
            <div class="child_content" v-if="typeof node == 'number'">
                <el-input-number
                    v-model="parent[name]"
                    size="mini"
                ></el-input-number>
            </div>
        </div>
        <div class="child_node" v-if="show && typeof node == 'object'">
            <TreeNode
                v-for="index in node"
                :key="index"
                :depth="depth + 1"
                :parent="node"
                :name="index"
                :node="node[index]"
            >
            </TreeNode>
            {{ node.prototype }}
            <TreeNode
                v-for="index in node.prototype"
                :key="index"
                :depth="depth + 1"
                :parent="node"
                :name="index"
                :node="node[index]"
            >
            </TreeNode>
        </div>
    </div>
</template>

<script>
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
        //值
        node: {
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
            show: false, //控制子节点是否显示
        };
    },
    methods: {
        update() {
            //触发更新
            this.parent[this.name] = this.node;
        },
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
            > .el-button {
                margin-left: 5px;
                margin-right: 5px;
                padding: 4px;
            }
            > .name1{
                color: #14274E;
            }
            > .name2{
                color: #7e8a97;
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
    }
}
</style>
