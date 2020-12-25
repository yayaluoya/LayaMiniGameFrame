<template>
    <div id="main">
        <el-tabs v-model="nav" type="card">
            <el-tab-pane label="调试" name="environment">
                <MainTree></MainTree>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import MainTree from "./tree/MainTree";

export default {
    name: "HelloWorld",
    components: {
        MainTree,
    },
    data() {
        return {
            nav: "environment",
        };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
body {
    margin: 0;
    padding: 0;
}
#main {
    //
}
</style>
