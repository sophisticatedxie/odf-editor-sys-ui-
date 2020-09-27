<!--
 * @Author: your name
 * @Date: 2020-08-18 16:31:20
 * @LastEditTime: 2020-09-27 16:45:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \editor-ui\odf-editor-ui\src\components\flow\designer\modules\XmlViewer.vue
-->
<template>
  <el-dialog
    :before-close="handleDialogClose"
    destroy-on-close
    width="90%"
    :title="title"
    :visible.sync="xmlShow"
    center
  >
    <codemirror
      ref="myCm"
      v-model="xml"
      :options="cmOptions"
      class="code"
    ></codemirror>
    <template slot="footer">
      <el-button @click="lbtFunc">{{ lbtTitle }}</el-button>
      <el-button @click="rbtFunc">{{ rbtTitle }}</el-button>
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
    lbtTitle: {
      type: String,
      required: false,
      default: "左按钮",
    },
    rbtTitle: {
      type: String,
      required: false,
      default: "右按钮",
    },
    title: {
      type: String,
      required: false,
      default: "xml视图",
    },
    code: {
      type: String,
      required: false,
      default: "",
    },
    xmlDialog: {
      type: Boolean,
      required: true,
    },
    lbtFunc: {
      type: Function,
      required: true,
    },
    rbtFunc: {
      type: Function,
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
  methods: {
    handleDialogClose() {
      this.xmlShow = false;
      return this.$emit("update:xmlDialog", this.xmlShow);
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>