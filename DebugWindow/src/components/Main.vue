<template>
  <div id="main">
    <el-tabs v-model="nav" type="card">
      <el-tab-pane label="环境调试" name="environment">
        <EnvironmentDebug></EnvironmentDebug>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EnvironmentDebug from "./EnvironmentDebug";

export default {
  name: "HelloWorld",
  components: {
    EnvironmentDebug,
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
#main {
  //
}
</style>
