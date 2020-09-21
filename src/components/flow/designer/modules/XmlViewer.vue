<!--
 * @Author: your name
 * @Date: 2020-08-18 16:31:20
 * @LastEditTime: 2020-09-14 18:01:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \editor-ui\odf-editor-ui\src\components\flow\designer\modules\XmlViewer.vue
-->
<template>
  <el-dialog
    :before-close="handleDialogClose"
    destroy-on-close
    width="90%"
    title="xml视图"
    :visible.sync="xmlShow"
    center
  >
    <codemirror ref="myCm" v-model="xml" :options="cmOptions" class="code"></codemirror>
    <template slot="footer">
      <el-button @click="genResult">生成报文</el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { codemirror } from "vue-codemirror";
require("codemirror/mode/python/python.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/fold/indent-fold.js");
require("codemirror/addon/fold/markdown-fold.js");
require("codemirror/addon/fold/comment-fold.js");
export default {
  components: {
    codemirror,
  },
  props: {
    code: {
      type: String,
      required: false,
      default: "",
    },
    xmlDialog: {
      type: Boolean,
      required: true,
    },
  },
  model: {
    prop: "code",
    event: "change",
  },
  computed: {
    xml: {
      set: function (newV) {
        return this.$emit("change", newV);
      },
      get: function () {
        return this.code;
      },
    },
  },
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "python",
        theme: "darcula",
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: { Ctrl: "autocomplete" },
        lineWiseCopyCut: true,
        showCursorWhenSelecting: true,
        matchBracks: true,
        line: true,
      },
      xmlShow: this.xmlDialog,
    };
  },
  mounted() {},
  methods: {
    genResult() {
      return this.$emit("genResult");
    },
    cancel() {
      this.xmlShow = false;
      return this.$emit("update:xmlDialog", this.xmlShow);
    },
    handleDialogClose() {
      this.cancel();
    },
  },
};
</script>
<style scoped>
</style>