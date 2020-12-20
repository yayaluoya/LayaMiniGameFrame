<template>
  <div id="EnvironmentDebug">
    <el-form ref="form" label-width="40%">
      <el-form-item label="摄像机清除颜色">
        <el-color-picker
          v-model="clear_color"
          @active-change="clear_color_change"
          show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="灯光颜色">
        <el-color-picker
          v-model="light_color"
          @active-change="light_color_change"
          show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="灯光强度" label-width="25%">
        <div class="block">
          <el-slider
            v-model="light_intensity"
            :min="0"
            :max="1"
            :step="0.01"
            @input="light_intensity_change"
          ></el-slider>
        </div>
      </el-form-item>
      <el-form-item label="环境光颜色">
        <el-color-picker
          v-model="ambient_color"
          @active-change="ambient_color_change"
          show-alpha
        ></el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DebugWindow from "../mes/DebugWindow";
import DebugWindowEvent from "../mes/DebugWindowEvent";

//
export default {
  data() {
    return {
      Laya: undefined,
      environment: undefined,
      //摄像机清除颜色
      clear_color: "",
      //灯光颜色
      light_color: "",
      //灯光强度
      light_intensity: 0,
      //环境光颜色
      ambient_color: "",
    };
  },
  methods: {
    clear_color_change(_color) {
      this.clear_color = _color;
      if (!this.environment) {
        return;
      }
      //   console.log(_color);
      let _colorData = this.colorRGBtoHex(_color);
      this.environment.camera.clearColor = new this.Laya.Vector4(..._colorData);
    },
    light_color_change(_color) {
      this.light_color = _color;
      if (!this.environment) {
        return;
      }
      //   console.log(_color);
      let _colorData = this.colorRGBtoHex(_color);
      this.environment.light.color = new this.Laya.Vector3(
        _colorData[0],
        _colorData[1],
        _colorData[2]
      );
    },
    light_intensity_change(_i) {
      this.light_intensity = _i;
      if (!this.environment) {
        return;
      }
      //   console.log(_i);
      this.environment.light.intensity = _i;
    },
    ambient_color_change(_color) {
      this.ambient_color = _color;
      if (!this.environment) {
        return;
      }
      //   console.log(_color);
      let _colorData = this.colorRGBtoHex(_color);
      this.environment.s3d.ambientColor = new this.Laya.Vector3(
        _colorData[0],
        _colorData[1],
        _colorData[2]
      );
    },
    //
    colorRGBtoHex(color) {
      var rgb = color.split(",");
      var r = parseInt(rgb[0].split("(")[1]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2]);
      var a = parseInt(rgb[3].split(")")[0]);
      return [r / 225, g / 225, b / 225, a / 225];
    },
    colorHexToRGB(_rbg) {
      return `rgba(${_rbg.x * 225}, ${_rbg.y * 225}, ${_rbg.z * 225}, ${
        _rbg.w ? _rbg.w : 1
      })`;
    },
  },
  mounted() {
    if (!window.opener) {
      return;
    }
    //监听环境改变消息
    window[DebugWindow.Mes].onMes(
      undefined,
      DebugWindowEvent.SetEnvironment,
      () => {
        console.log("环境改变事件");
        this.Laya = window.opener.Laya;
        this.environment = window.opener.$Debug.Environment;
        this.clear_color = this.colorHexToRGB(
          this.environment.camera.clearColor
        );
        this.light_color = this.colorHexToRGB(this.environment.light.color);
        this.light_intensity = this.environment.light.intensity;
        this.ambient_color = this.colorHexToRGB(
          this.environment.s3d.ambientColor
        );
      }
    );
  },
};
</script>

<style scoped lang="scss">
#EnvironmentDebug {
  padding: 0 20px;
}
</style>