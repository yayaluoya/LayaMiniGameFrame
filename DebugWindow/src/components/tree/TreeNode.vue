<template>
  <div class="tree_node" v-if="ifShow">
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
          :class="show ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
        >
        </i>
        <div class="name1">
          {{ name }}
        </div>
        <div class="name2">{{ TreeTool.getClassName(node) }}</div>
        <div class="fake" v-if="ifFake">
          <el-tag type="danger" size="mini">只读</el-tag>
        </div>
        <!-- <el-button
          icon="el-icon-search"
          class="child_content"
          circle
          size="mini"
          @click="debug"
        ></el-button> -->
      </div>
      <div class="child_content" v-if="typeof node == 'string' && !ifFake">
        <el-input v-model="value" size="mini"></el-input>
      </div>
      <div
        class="child_content numberInput"
        v-if="typeof node == 'number' && !ifFake"
      >
        <el-input-number
          v-model="value"
          size="mini"
          :step="numberStep"
          :precision="numberPrecision"
        ></el-input-number>
        <!-- 其他数值 -->
        <i
          :class="showDebugMore ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
          @click="showDebugMore = !showDebugMore"
        ></i>
        <b v-if="showDebugMore">步长</b>
        <el-input
          class="sonInput"
          v-model="numberStep"
          size="mini"
          v-if="showDebugMore"
        ></el-input>
        <b v-if="showDebugMore">精度</b>
        <el-input
          class="sonInput"
          v-model="numberPrecision"
          size="mini"
          v-if="showDebugMore"
        ></el-input>
      </div>
      <div class="child_content" v-if="typeof node == 'boolean' && !ifFake">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </div>
      <b class="child_content fake" v-if="node != 'object' && ifFake">{{
        value
      }}</b>
      <!-- {{ node }} -->
    </div>
    <div class="child_node" v-if="show && typeof node == 'object'">
      <TreeNode
        v-for="(item, key) in TreeTool.getAllKeys(node)"
        :key="key"
        :depth="depth + 1"
        :parent="node"
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
      TreeTool: TreeTool, //工具
      updateNumber: 1, //唤醒监听
      show: false, //控制子节点是否显示
      value: "", //当前值
      ifFake: false, //是否限制
      numberStep: 1, //数值步长
      numberPrecision: 3, //数值精度
      showDebugMore: false, //是否显示更多数值调试
    };
  },
  computed: {
    ifShow() {
      return (
        typeof this.node != "object" ||
        TreeTool.getAllKeys(this.node).length > 0
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
      //抛出更改事件
      this.$emit("update", this.name, this.value, true, this.ifFake);
      //
      this.updateNumber++;
    },
    show() {
      this.updateNumber++;
    },
  },
  methods: {
    //测试
    debug() {
      console.log("父节点", this.parent);
      console.log("键", this.name);
    },
    updateEmit(key, value, ifSetValue, ifFake) {
      //判断是否限制修改
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
    //判断值的特性
    if (!this.TreeTool.ifShowKey(this.parent, this.name)) {
      //绕过vue监听
      this.$Fakedata = this.node;
      this.ifFake = true;
    }
    if (typeof this.node != "object") {
      this.value = this.node;
    }
    //
    this.updateNumber++;
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
      background-color: #ebebeb;
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
        color: #28df99;
      }
      > .name1 {
        color: #14274e;
        margin-right: 5px;
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
      &.numberInput {
        > b {
          font-size: 12px;
          color: #aaaaaa;
          margin: 0 5px;
        }
        > .sonInput {
          width: 40px;
        }
      }
    }
    > .fake {
      color: #ff4b5c;
      font-size: 12px;
    }
  }
}
</style>
