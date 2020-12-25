<template>
    <div class="tree">
        <div class="container">
            <div v-for="(item, index) in data" :key="index">
                <TreeNode
                    :parent="data"
                    :depath="0"
                    :name="index"
                    :node="item"
                ></TreeNode>
            </div>
        </div>
    </div>
</template>

<script>
//树形结构根节点
import TreeNode from "./TreeNode";
export default {
    name: "tree",
    components: { TreeNode },
    props: {
        data: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
};
</script>

<style scoped lang="scss">
.tree {
    width: fit-content;
    > .container {
        width: fit-content;
        min-width: 250px;
        height: fit-content;
        background-color: white;
        padding: 15px;
        box-sizing: border-box;
        border-radius: 2px;
    }
}
</style>
