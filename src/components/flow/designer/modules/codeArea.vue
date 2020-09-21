<!--
 * @Author: xiejr
 * @Date: 2020-08-04 10:48:02
 * @LastEditTime: 2020-09-16 17:54:15
 * @LastEditors: Please set LastEditors
 * @Description: 节点代码块组件
 * @FilePath: \odf-editor-ui\src\components\flow\designer\modules\codeArea.vue
-->
<template>
  <div class="code">
    <div
      v-if="isNullOrEmpty(contentStr)"
      style="height:100px"
      @click.stop="codeClickHandler"
    >there is no code here</div>
    <pre v-else v-html="contentStr" @click.stop="codeClickHandler"></pre>
    <el-dialog
      destroy-on-close
      width="40%"
      title="节点代码设置"
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose"
      center
    >
      <el-row :gutter="100">
        <el-col :span="18">
          <el-button type="primary" @click="addNewProperty">新增变量</el-button>
        </el-col>
        <el-col :span="6">
          <el-switch
            style="margin-right:0"
            v-model="edited"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="table"
            highlight-current-row
            :data="contentJson"
            style="width: 100%"
            max-height="250"
            border
            empty-text="暂无代码块,点击上方按钮进行添加"
          >
            <el-table-column align="center" fixed prop="prop" label="变量" min-width="150">
              <template slot-scope="scope">
                <div v-show="edited">
                  <el-input
                    @change="checkProperty(scope.row)"
                    v-model="scope.row.prop"
                    placeholder="请输入变量名"
                    size="small"
                  ></el-input>
                </div>
                <span v-show="!edited">{{scope.row.prop}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="value" label="值域" min-width="120">
              <template slot-scope="scope">
                <div class="input-box" v-show="edited">
                  <el-input v-model="scope.row.value" placeholder="请输入变量值" size="small"></el-input>
                </div>
                <span v-show="!edited">{{scope.row.value}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "codeArea",
  props: ["value", "autoField"],
  //model 选项实现了v-model的双向绑定
  model: {
    prop: "value",
    event: "close",
  },
  data() {
    return {
      dialogVisible: false,
      edited: false,
    };
  },
  methods: {
    checkProperty(row) {
      let that = this;
      let flag = false;
      let same = this.contentJson.filter((data) => data.prop == row.prop);
      if (same.length > 1) {
        that.$message({
          message: "不可出现重复变量!",
          type: "error",
          center: true,
          duration: 1000,
          onClose: () => {
            that.$set(row, "prop", "");
          },
        });
      }
    },
    addNewProperty() {
      this.contentJson.push({ prop: "", value: "" });
      this.$refs.table.setCurrentRow(
        this.contentJson[this.contentJson.length - 1]
      );
    },
    /**
     * @description: 对话框关闭
     * @param {type}
     * @author: xiejr
     */

    codeClickHandler() {
      let that = this;
      that.dialogVisible = true;
    },
    /**
     * @description: 在对话框关闭之前向父组件更新prop，实现v-model双向绑定的关键
     * @author: xiejr
     */
    handleDialogClose() {
      this.dialogVisible = false;
      let result = {};
      let that = this;
      if (
        that.isNullOrEmpty(that.contentJson) ||
        that.contentJson.length == 0
      ) {
        return that.$emit("close", "");
      }
      that.contentJson.map((data) => {
        that.$set(result, data.prop, data.value);
      });
      return that.$emit("close", JSON.stringify(result));
    },
    /**
     * @description: 自定义格式化函数
     * @param {str}  待格式化字符串
     * @return 格式化后代码
     * @author: xiejr
     */
    formatContent(str) {
      let g = this;
      let contentExpress = null;
      let contentStr = "";
      if (!g.isNullOrEmpty(str)) {
        try {
          contentExpress = JSON.parse(str);
          let keys = Object.keys(contentExpress);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let v = contentExpress[key];
            v = v.replace(
              /\${each}/g,
              g.autoField.slice(0, g.autoField.length - 1)
            );
            contentStr += `<br>var ${key}=${v};`;
          }
          contentStr = contentStr.replace(/^<br>/, "");
        } catch (e) {
          contentStr = str;
        }
      }
      return contentStr;
    },
    handleDelete(index, row) {
      this.contentJson.splice(index, 1);
    },
  },
  computed: {
    /**
     * @description: 根据prop传进来的json字符串自动转换成pre标签内的代码块
     * @author: xiejr
     */

    contentStr() {
      return this.formatContent(this.value);
    },
    /**
     * @description: 将json格式的字符串转换成表格内编辑的数据
     * @author: xiejr
     */
    contentJson() {
      if (this.isNullOrEmpty(this.value)) {
        return [];
      } else {
        let obj = {};
        let result = [];
        try {
          obj = JSON.parse(this.value);
          let keys = Object.keys(obj);
          for (let i = 0; i < keys.length; i++) {
            result.push({
              prop: keys[i],
              value: obj[keys[i]],
            });
          }
          return result;
        } catch (e) {
          return [];
        }
      }
    },
  },
};
</script>
<style scoped>
.code {
  background: -webkit-gradient(
    linear,
    0% 20%,
    0% 1000%,
    from(#fff),
    to(#fff),
    color-stop(0.1, #f3f3f3)
  );
  border: 1px solid #ccc;
  -webkit-box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.1) inset;
  -webkit-border-bottom-right-radius: 6px 50px;
  cursor: pointer;
}
.code:before {
  content: "";
  width: 50px;
  height: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
  -webkit-box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
  z-index: -1;
  -webkit-transform: translate(-35px, -40px) skew(0deg, 30deg) rotate(-25deg);
}
.code:after {
  content: "";
  width: 100px;
  height: 100px;
  top: 0;
  left: 0;
  position: absolute;
  display: inline-block;
  z-index: -1;
  -webkit-box-shadow: -10px -10px 10px rgba(0, 0, 0, 0.2);
  -webkit-transform: rotate(2deg) translate(20px, 25px) skew(20deg);
}
</style>