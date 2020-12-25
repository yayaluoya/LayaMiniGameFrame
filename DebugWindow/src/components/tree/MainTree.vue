<template>
    <div id="MainTree">
        <div>
            <el-button
                type="primary"
                size="small"
                plain
                @click="update"
                icon="el-icon-refresh"
                >刷新</el-button
            >
        </div>
        <Tree :data="data"> </Tree>
    </div>
</template>

<script>
import Tree from "./Tree.vue";
export default {
    name: "MainTree",
    components: {
        Tree,
    },
    data() {
        return {
            data: {},
        };
    },
    methods: {
        update() {
            this.data = {};
            setTimeout(() => {
                this.data = this.getData();
            }, 0);
        },
        getData() {
            return window["$data"];
        },
    },
    mounted() {
        window["$data"] = {
            a: 1,
        };
        this.update();
    },
};
</script>

<style lang="scss" scoped>
#MainTree {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    > div {
        width: 100%;
        text-align: right;
    }
}
</style>
