<template>
  <div id="MainTree">
    <TreeNode
      :parent="TreeTool.getDebugDataRoot()"
      :depath="0"
      :name="TreeTool.getDebugDataRootKey()"
      @update="update"
    ></TreeNode>
  </div>
</template>

<script>
//树形结构根节点
import TreeNode from "./TreeNode";
import TreeTool from "../com/TreeTool";

export default {
  name: "MainTree",
  components: {
    TreeNode,
  },
  data() {
    return {
      TreeTool: TreeTool,
      data: {},
    };
  },
  methods: {
    /** 刷新源数据 */
    update(key) {
      TreeTool.getDebugDataRoot()[key] = TreeTool.getDebugDataRoot()[key];
      this.data = TreeTool.getDebugDataRoot()[key];
    },
  },
  mounted() {
    this.data = this.TreeTool.getDebugData();
  },
};
</script>

<style lang="scss" scoped>
#MainTree {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
