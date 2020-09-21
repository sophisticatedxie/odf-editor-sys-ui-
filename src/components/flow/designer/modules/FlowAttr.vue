<template>
  <div>
    <a-tabs size="small" defaultActiveKey="flow-attr" :activeKey="activeKey">
      <a-tab-pane key="flow-attr">
        <span slot="tab">
          <a-icon type="cluster" />模板属性
        </span>
        <a-form layout="horizontal">
          <a-form-item
            label="模板id"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input :value="$store.getters.GET_CURRENT_TEMPLATE.templateId" disabled />
          </a-form-item>
          <a-form-item
            label="模板名"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="$store.getters.GET_CURRENT_TEMPLATE.templateName" />
          </a-form-item>
          <a-form-item
            label="接口地址"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="$store.getters.GET_CURRENT_TEMPLATE.restfulUrl" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="node-attr">
        <span slot="tab">
          <a-icon type="profile" />节点属性
        </span>
        <template>
          <a-form layout="horizontal">
            <a-form-item
              label="类型"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-tag color="purple">{{ currentSelect.type }}</a-tag>
            </a-form-item>
            <a-form-item
              label="id"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="currentSelect.id" disabled />
            </a-form-item>
            <a-form-item
              label="名称"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                placeholder="请输入节点名称"
                v-model="currentSelect.nodeName"
                @change="nodeNameChange"
                disabled
              />
            </a-form-item>
            <a-form-item
              label="自动域"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                placeholder="请输入自动域值(仅多节点和body时使用)"
                v-model="currentSelect.autoField"
                @change="checkField"
              />
            </a-form-item>
            <a-form-item
              label="循环节点"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-switch
                checked-children="是"
                un-checked-children="否"
                default-checked
                v-model="currentSelect.isMulti"
              />
            </a-form-item>
            <a-form-item
              label="节点代码块"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <code-area
                v-model="currentSelect.contentExpress"
                :autoField="currentSelect.autoField"
              ></code-area>
            </a-form-item>

            <el-divider content-position="center">属性区域</el-divider>
            <a-form-item
              label
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <el-button @click="addNewAttr" size="small" type="success">添加属性</el-button>
            </a-form-item>
            <template v-for="(attr,index) in currentSelect.attrs">
              <a-form-item
                :key="attr.id"
                :label="attr.attributeName"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <el-input
                  style="width:150px"
                  size="mini"
                  v-model="attr.valExpress"
                  placeholder="请输入属性占位符"
                ></el-input>
                <el-button
                  style="margin-left:15px"
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editAttr(attr,index)"
                  circle
                ></el-button>
                <el-button
                  style="margin-left:15px"
                  type="danger"
                  size="small"
                  @click="removeAttr(attr,index)"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </a-form-item>
            </template>
          </a-form>
        </template>
      </a-tab-pane>
      <a-tab-pane key="link-attr">
        <span slot="tab">
          <a-icon type="branches" />连线属性
        </span>
        <a-form layout="horizontal">
          <a-form-item
            label="id"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input :value="currentSelect.id" disabled />
          </a-form-item>
          <a-form-item
            label="源节点"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input :value="currentSelect.sourceId" disabled />
          </a-form-item>
          <a-form-item
            label="目标节点"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input :value="currentSelect.targetId" disabled />
          </a-form-item>
          <a-form-item
            label="文本"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input :value="currentSelect.label" @change="linkLabelChange" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    <el-dialog
      destroy-on-close
      width="40%"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      center
    >
      <el-form
        :model="newAttr"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="属性名" prop="name">
          <el-input v-model="newAttr.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="占位表达式" prop="expression">
          <el-input v-model="newAttr.expression" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" @click="saveNewAttr">保存</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import jsplumb from "jsplumb";
import { flowConfig } from "../config/args-config.js";
import codeArea from "@/components/flow/designer/modules/codeArea";
export default {
  props: ["plumb", "flowData", "select"],
  components: {
    jsplumb,
    codeArea,
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入属性名"));
      }
      callback();
    };
    var validateExpression = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入属性表达式"));
      } else {
        callback();
      }
    };
    return {
      dialogTitle: "属性新增",
      newAttr: {
        name: "",
        expression: "",
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        expression: [{ validator: validateExpression, trigger: "blur" }],
      },
      dialogVisible: false,
      currentSelect: this.select,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
      activeKey: "flow-attr",
    };
  },
  methods: {
    /**
     * @description: 修改自动域
     * @author: xiejr
     */
    checkField() {
      console.log("自动域修改");
    },

    /**
     * @description: 编辑属性
     * @author: xiejr
     */
    editAttr(row, index) {
      let that = this;
      this.dialogTitle = "属性修改";
      this.$set(this.newAttr, "id", row.id);
      this.$set(this.newAttr, "name", row.attributeName);
      this.$set(this.newAttr, "expression", row.valExpress);
      this.$nextTick(() => {
        that.dialogVisible = true;
        that.$set(this.$store.getters.GET_CURRENT_TEMPLATE, "modified", true);
      });
    },
    removeAttr(row, index) {
      this.currentSelect.attrs.splice(index, 1);
      this.$set(this.$store.getters.GET_CURRENT_TEMPLATE, "modified", true);
    },
    saveNewAttr() {
      let that = this;
      if (that.isNullOrEmpty(that.newAttr.id)) {
        //save
        that.currentSelect.attrs.push({
          id: new Date().getTime(),
          attributeName: that.newAttr.name,
          valExpress: that.newAttr.expression,
        });
      } else {
        let index = that.currentSelect.attrs.findIndex(
          (attr) => attr.id == that.newAttr.id
        );
        that.currentSelect.attrs.splice(index, 1, {
          id: that.newAttr.id,
          attributeName: that.newAttr.name,
          valExpress: that.newAttr.expression,
        });
      }

      that.newAttr = {
        id: "",
        name: "",
        expression: "",
      };
      that.dialogVisible = false;
      that.$nextTick(() => {
        that.$set(this.$store.getters.GET_CURRENT_TEMPLATE, "modified", true);
        that.$message.success("保存成功");
      });
    },
    addNewAttr() {
      let that = this;
      this.dialogTitle = "属性新增";
      that.newAttr = {
        id: "",
        name: "",
        expression: "",
      };
      that.$nextTick(() => {
        that.$set(this.$store.getters.GET_CURRENT_TEMPLATE, "modified", true);
        this.dialogVisible = true;
      });
    },
    nodeNameChange(e) {
      this.currentSelect.nodeName = e.target.value;
    },
    linkLabelChange(e) {
      const that = this;
      let label = e.target.value;

      that.currentSelect.label = label;
      let conn = that.plumb.getConnections({
        source: that.currentSelect.sourceId,
        target: that.currentSelect.targetId,
      })[0];
      if (label != "") {
        conn.setLabel({
          label: label,
          cssClass: "linkLabel",
        });
      } else {
        let labelOverlay = conn.getLabelOverlay();
        if (labelOverlay) conn.removeOverlay(labelOverlay.id);
      }
    },
  },
  watch: {
    select(val) {
      this.currentSelect = val;
      if (this.currentSelect.type == "link") {
        this.activeKey = "link-attr";
      } else if (!this.currentSelect.type) {
        this.activeKey = "flow-attr";
      } else {
        this.activeKey = "node-attr";
      }
    },
    currentSelect: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
@import "../style/flow-attr.scss";
</style>
