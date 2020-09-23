<!--
 * @Author:xiejr
 * @Date: 2020-07-24 11:52:25
 * @LastEditTime: 2020-09-23 11:11:22
 * @LastEditors: Please set LastEditors
 * @Description: 编辑器主页
 * @FilePath: \odf-editor-ui\src\components\flow\designer\FlowDesigner.vue
--> 
<template>
  <div style="height: 100%;">
    <a-layout class="container">
      <el-scrollbar style=" background: white;">
        <a-layout-sider width="300" theme="light" class="select-area">
          <a-row>
            <a-checkable-tag v-model="tag.checked0" @change="toggleNodeShow0" class="tag">工具</a-checkable-tag>
            <div align="center">
              <a-list :grid="{ gutter: 8, column: 1 }" v-if="tag.toolShow">
                <a-list-item>
                  <a-button-group>
                    <a-button
                      v-for="(tool, index) in field.tools"
                      :key="index"
                      :icon="tool.icon"
                      :type="currentTool.type == tool.type ? 'primary': 'default'"
                      @click="selectTool(tool.type)"
                    ></a-button>
                  </a-button-group>
                </a-list-item>
              </a-list>
            </div>
          </a-row>

          <a-row>
            <a-checkable-tag v-model="tag.checked2" @change="toggleNodeShow2" class="tag">节点</a-checkable-tag>
            <div align="center">
              <a-list :grid="{ gutter: 8, column: 2 }" v-if="tag.highNodeShow">
                <a-list-item v-for="(node, index) in field.highNodes" :key="index">
                  <div
                    class="node-item"
                    :type="node.type"
                    belongto="highNodes"
                    :etNodeName="node.nodeName"
                  >
                    <a-icon :component="node.icon" />
                    {{ node.nodeName }}
                  </div>
                </a-list-item>
              </a-list>
            </div>
          </a-row>
        </a-layout-sider>
      </el-scrollbar>
      <a-layout>
        <a-layout-header class="header-option">
          <a-tooltip title="保存模板" placement="bottom">
            <a-button
              :disabled="edited"
              @click="save"
              class="header-option-button"
              size="small"
              icon="save"
            ></a-button>
          </a-tooltip>
          <a-tooltip title="生成UI图" placement="bottom">
            <a-button
              :disabled="edited"
              @click="exportFlowPicture"
              class="header-option-button"
              size="small"
              icon="picture"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            title="确认要重新绘制吗？"
            placement="bottom"
            okText="确认"
            cancelText="取消"
            @confirm="clear"
          >
            <a-tooltip title="重新绘制" placement="bottom">
              <a-button :disabled="edited" class="header-option-button" size="small" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-tooltip :title="flowData.config.showGridText" placement="bottom">
            <a-button
              @click="toggleShowGrid"
              class="header-option-button"
              size="small"
              :icon="flowData.config.showGridIcon"
            ></a-button>
          </a-tooltip>
          <a-tooltip title="设置" placement="bottom">
            <a-button @click="setting" class="header-option-button" size="small" icon="setting"></a-button>
          </a-tooltip>
          <a-popconfirm
            title="请选择帮助项："
            placement="bottom"
            okType="default"
            okText="快捷键大全"
            cancelText="使用文档"
            @confirm="shortcutHelper"
            @cancel="usingDoc"
          >
            <a-icon slot="icon" type="question-circle-o" style="color: red" />
            <a-tooltip title="帮助" placement="bottom">
              <a-button class="header-option-button" size="small" icon="book"></a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="selectOtherTemplates">选择模板</a-button>
          <a-button type="primary" :disabled="edited" size="small" @click="showXml">xml视图</a-button>
        </a-layout-header>
        <a-layout-content class="content" ref="canvas">
          <flow-area
            ref="flowArea"
            :browserType="browserType"
            :flowData="flowData"
            :select.sync="currentSelect"
            :selectGroup.sync="currentSelectGroup"
            :plumb="plumb"
            :currentTool="currentTool"
            @findNodeConfig="findNodeConfig"
            @selectTool="selectTool"
            @getShortcut="getShortcut"
            @saveFlow="saveFlow"
          ></flow-area>
          <vue-context-menu :contextMenuData="linkContextMenuData" @deleteLink="deleteLink"></vue-context-menu>
        </a-layout-content>
        <a-layout-footer class="foot">
          <span>odf-editor {{ info.version }}, Powered by {{ info.author }}</span>
        </a-layout-footer>
      </a-layout>
      <el-scrollbar style=" background: white;">
        <a-layout-sider width="380" theme="light" class="attr-area" @mousedown.stop="loseShortcut">
          <flow-attr :plumb="plumb" :flowData="flowData" :select.sync="currentSelect"></flow-attr>
        </a-layout-sider>
      </el-scrollbar>
    </a-layout>
    <a-modal
      :title="'模板编辑器' + flowData.attr.id + '.png'"
      centered
      width="90%"
      :closable="flowPicture.closable"
      :maskClosable="flowPicture.maskClosable"
      :visible="flowPicture.modalVisible"
      okText="下载到本地"
      cancelText="取消"
      @ok="downLoadFlowPicture"
      @cancel="cancelDownLoadFlowPicture"
    >
      <div align="center">
        <img :src="flowPicture.url" />
      </div>
    </a-modal>
    <el-dialog
      width="40%"
      title="模板选择"
      :visible="$store.getters.GET_TEMPLATE_DISLOG_VISIBLE"
      center
      :before-close="handleDialogClose"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

      <el-tree
        empty-text="暂无模板"
        class="filter-tree"
        check-on-click-node
        :data="$store.getters.GET_TEMPLATES"
        highlight-current
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
        check-strictly
        show-checkbox
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini">{{data.createAuthor}}</el-button>
          </span>
        </span>
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="go">进 入</el-button>
        <el-button type="primary" @click="newTemplate">创建新模板</el-button>
      </div>
       <el-dialog
       append-to-body
      width="30%"
      title="新建模板"
      :visible="$store.getters.GET_NEW_TEMPLATE_DIALOG_VISIBLE"
      center
      :before-close="newTemplateClose"
    >
    <el-form ref="newTem" :rules="newTemRules" :label-position="'left'" label-width="80px" :model="newTemObj">
  <el-form-item label="模板名" prop="templateName">
   <el-input
   style="width:250px"
  placeholder="请输入模板名"
  v-model="newTemObj.templateName"
  clearable>
</el-input>
  </el-form-item>
  <el-form-item label="所属项目" prop="templateClassCode">
   <el-select style="width:250px" v-model="newTemObj.templateClassCode" filterable placeholder="请选择">
    <el-option
      v-for="item in projects"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="body" prop="bodyId">
   <el-select style="width:250px" v-model="newTemObj.bodyId" filterable placeholder="请选择">
    <el-option
      v-for="item in bodys"
      :key="item.bodyId"
      :label="item.name"
      :value="item.bodyId">
    </el-option>
  </el-select>
  </el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createTemplate">创建</el-button>
        <el-button  @click="newTemplateClose">取消</el-button>
      </div>
    </el-dialog>
    </el-dialog>
    <setting-modal ref="settingModal"></setting-modal>
    <shortcut-modal ref="shortcutModal"></shortcut-modal>
    <test-modal ref="testModal" @loadFlow="loadFlow"></test-modal>
    <xml-viewer
      v-if="xmlDialog"
      :xmlDialog.sync="xmlDialog"
      @genResult="genResult"
      v-model="$store.getters.GET_CURRENT_TEMPLATE.odfXmlStr"
    ></xml-viewer>
  </div>
</template>

<script>
import { formatXml, getPrefix } from "@/util/XmlUtils";
import jsplumb from "jsplumb";
import vkbeautify from "vkbeautify";
import restful from "@/restful";
import { decrypto } from "@/util/encrypto";
import XmlViewer from "@/components/flow/designer/modules/XmlViewer";
import {
  tools,
  commonNodes,
  highNodes,
  laneNodes,
} from "./config/basic-node-config.js";
import { flowConfig } from "./config/args-config.js";
import {
  startSvg,
  endSvg,
  commonSvg,
  freedomSvg,
  gatewaySvg,
  eventSvg,
  childFlowSvg,
  xLaneSvg,
  yLaneSvg,
  lanePoolSvg,
} from "./config/basic-icon-config.js";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
import "jquery-ui/ui/widgets/resizable";
import html2canvas from "html2canvas";
import canvg from "canvg";
import { ZFSN } from "./util/ZFSN.js";
import FlowArea from "./modules/FlowArea";
import FlowAttr from "./modules/FlowAttr";
import SettingModal from "./modules/SettingModal";
import ShortcutModal from "./modules/ShortcutModal";
import UsingDocModal from "./modules/UsingDocModal";
import TestModal from "./modules/TestModal";

export default {
  name: "vfd",
  components: {
    XmlViewer,
    jsplumb,
    flowConfig,
    html2canvas,
    canvg,
    FlowArea,
    FlowAttr,
    SettingModal,
    ShortcutModal,
    UsingDocModal,
    TestModal,
    StartIcon: { template: startSvg },
    EndIcon: { template: endSvg },
    CommonIcon: { template: commonSvg },
    FreedomIcon: { template: freedomSvg },
    GatewayIcon: { template: gatewaySvg },
    EventIcon: { template: eventSvg },
    ChildFlowIcon: { template: childFlowSvg },
    XLaneIcon: { template: xLaneSvg },
    YLaneIcon: { template: yLaneSvg },
    LanePoolIcon: { template: lanePoolSvg },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    flowData: {
      handler(newV, oldV) {
        if (!this.initFlag) {
          this.$set(
            this.$store.getters.GET_CURRENT_TEMPLATE,
            "modified",
            false
          );
        } else {
          this.$set(this.$store.getters.GET_CURRENT_TEMPLATE, "modified", true);
        }
      },
      deep: true,
    },
  },
  mounted() {
    const that = this;
    setTimeout(function () {
      ZFSN.consoleLog([
        "欢迎使用ODF模板编辑器!",
        "当前版本：" + that.info.version,
        "Powered by " + that.info.author,
        "码云：" + that.info.gitee,
      ]);
      that.$notification.open({
        placement: "bottomRight",
        message: "欢迎使用ODF模板编辑器!",
        description: (
          <p>
            当前版本：1.0.0
            <br />
            Powered by xiejr
            <br />
            码云：
            <a target="blank" href="https://gitee.com/sophis/odf-editor-ui.git">
              ODF模板编辑器
            </a>
          </p>
        ),
        icon: <a-icon type="smile" style="color: #108ee9" />,
      });
    }, 1000);
  },
  data() {
    return {
      newTemRules:{
        templateName:[
          {required: true, message:'模板名不得为空', trigger: 'blur'}
        ],
        templateClassCode:[
          {required: true, message:'请选择一个项目组', trigger: 'blur'}
        ],
        bodyId:[
          {required: true, message:'请选择一个body', trigger: 'blur'}
        ]
      },
      newTemObj:{
        templateName:'',
        templateClassCode:'',
        bodyId:''
      },
      linkList: [],
      xmlResultDialog: false,
      initFlag: false,
      content: "var a=111",
      codeOptions: {
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        theme: "cobalt",
        // 显示行号
        lineNumbers: true,
        line: true,
      },
      xmlCode: "var a=0;",
      xmlDialog: false,
      filterText: "",

      defaultProps: {
        children: "list",
        label: "label",
      },
      history: "",
      info: {
        version: "1.0.0",
        author: "xiejr",
        gitee: "https://gitee.com/sophis/odf-editor-ui.git",
      },
      tag: {
        checked0: true,
        checked1: true,
        checked2: true,
        checked3: true,
        toolShow: true,
        commonNodeShow: true,
        highNodeShow: true,
        laneNodeShow: true,
      },
      browserType: 3,
      plumb: {},
      field: {
        tools: tools,
        commonNodes: commonNodes,
        highNodes: highNodes,
        laneNodes: laneNodes,
      },
      flowData: {
        nodeList: [],
        linkList: [],
        attr: {
          id: "",
        },
        config: {
          showGrid: true,
          showGridText: "隐藏网格",
          showGridIcon: "eye",
        },
        status: flowConfig.flowStatus.CREATE,
        remarks: [],
        xmlJsonArray: [],
      },
      currentTool: {
        type: "drag",
        icon: "drag",
        name: "拖拽",
      },
      currentSelect: {},
      currentSelectGroup: [],
      activeShortcut: true,
      linkContextMenuData: flowConfig.contextMenu.link,
      flowPicture: {
        url: "",
        modalVisible: false,
        closable: false,
        maskClosable: false,
      },
      errorModal: {
        title: "错误提示",
        content: "",
      },
    };
  },
  methods: {
    /**
     * @description: 在线获取xml结果
     * @author: xiejr
     */
    genResult() {
      let that = this;
      let template = this.$store.getters.GET_CURRENT_TEMPLATE;
        that.judgeTemplateModified((action,instance)=>{
      if (action == "confirm") {
              that.xmlDialog = false;
              that.$nextTick(() => {
                that.saveFlow(false).then((res) => {
                  that.xmlDialog = false;
                  that.$nextTick(() => {
                    restful
                      .genOdfResult(that, template.templateId)
                      .then((resp) => {
                        that.$set(template, "modified", false);
                        that.$set(
                          that.$store.getters.GET_CURRENT_TEMPLATE,
                          "odfResult",
                          resp
                        );
                        that.$nextTick(() => {
                          that.xmlResultDialog = true;
                        });
                      })
                      .catch((err) => {
                        that.$set(template, "modified", true);
                      });
                  });
                });
              });
            }
        },()=>{})
 
    },
    downLoadResult() {},

    //移除xml节点的name属性
    removeXmlNameAttr(param) {
      let that = this;
      delete param._name;
      delete param._id;
      delete param._pid;
      delete param.attrs;
      let keys = Object.keys(param);
      keys.forEach((v) => {
        if (param[v] instanceof Object) {
          that.removeXmlNameAttr(param[v]);
        }
      });
    },

    showXml() {
      this.genXmlStr();
      let that = this;
      that.$nextTick(() => {
        that.xmlDialog = true;
      });
    },
    handleDialogClose() {
      this.$store.commit("SET_TEMPLATE_DIALOG_VISIBLE", false);
    },
    /**
     * @description: 进入模板编辑
    
     * @return: 
     * @author: xiejr
     */
    go() {
      let that = this;
      that.initFlag = false;
      that.linkList = [];
      let checkedNodes = that.$refs.tree.getCheckedNodes();
      if (
        that.isNullOrEmpty(checkedNodes) ||
        checkedNodes.length == 0 ||
        checkedNodes.length > 1
      ) {
        that.$msgbox({
          title: "提示",
          message: "当前未选中有效模板,请确认后重新进入",
          type: "warning",
          center: true,
          distinguishCancelAndClose: true,
        });
        return;
      }
      that.$store
        .dispatch("SET_CURRENT_TEMPLATE", checkedNodes[0])
        .then((res) => {
          that.$store.commit("SET_TEMPLATE_DIALOG_VISIBLE", false);
        });
      that.$nextTick(() => {
        if (that.isNullOrEmpty(checkedNodes[0].templateContentStr)) {
          that.clear();
        } else {
          that.loadFlow(checkedNodes[0].templateContentStr);
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    toggleNodeShow0(flag) {
      if (!flag) {
        this.tag.toolShow = false;
      } else {
        this.tag.toolShow = true;
      }
    },
    toggleNodeShow1(flag) {
      if (!flag) {
        this.tag.commonNodeShow = false;
      } else {
        this.tag.commonNodeShow = true;
      }
    },

    toggleNodeShow2(flag) {
      if (!flag) {
        this.tag.highNodeShow = false;
      } else {
        this.tag.highNodeShow = true;
      }
    },

    toggleNodeShow3(flag) {
      if (!flag) {
        this.tag.laneNodeShow = false;
      } else {
        this.tag.laneNodeShow = true;
      }
    },
    getBrowserType() {
      let userAgent = navigator.userAgent;
      let isOpera = userAgent.indexOf("Opera") > -1;
      if (isOpera) {
        return 1;
      }
      if (userAgent.indexOf("Firefox") > -1) {
        return 2;
      }
      if (userAgent.indexOf("Chrome") > -1) {
        return 3;
      }
      if (userAgent.indexOf("Safari") > -1) {
        return 4;
      }
      if (
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera
      ) {
        alert("IE浏览器支持性较差，推荐使用Firefox或Chrome");
        return 5;
      }
      if (userAgent.indexOf("Trident") > -1) {
        alert("Edge浏览器支持性较差，推荐使用Firefox或Chrome");
        return 6;
      }
    },
    dealCompatibility() {
      const that = this;

      that.browserType = that.getBrowserType();
      if (that.browserType == 2) {
        flowConfig.shortcut.scaleContainer = {
          code: 16,
          codeName: "SHIFT(chrome下为ALT)",
          shortcutName: "画布缩放",
        };
      }
    },

    initJsPlumb() {
      const that = this;

      that.plumb = jsPlumb.getInstance(flowConfig.jsPlumbInsConfig);

      that.plumb.bind("beforeDrop", function (info) {
        let sourceId = info.sourceId;
        let targetId = info.targetId;
        if (sourceId === targetId) {
          that.$message.error("不可以连接自身!");
          return false;
        }
        return true;
      });

      that.plumb.bind("connection", function (conn, e) {
        let connObj = conn.connection.canvas;
        let o = {},
          id,
          label;
        id = "link-" + ZFSN.getId();
        label = "";
        connObj.id = id;
        o.type = "link";
        o.id = id;
        o.sourceId = conn.sourceId;
        o.targetId = conn.targetId;
        let sourceObj = that.flowData.nodeList.find(
          (data) => data.id == conn.sourceId
        );
        let sourceMap = { id: sourceObj.id, name: sourceObj.nodeName };
        // sourceObj.attrs.forEach((v, i) => {
        //   sourceMap[v.attributeName] = v.valExpress;
        // });
        let targetObj = that.flowData.nodeList.find(
          (data) => data.id == conn.targetId
        );
        let targetMap = {
          id: targetObj.id,
          name: targetObj.nodeName,
          pid: sourceMap.id,
        };
        // targetObj.attrs.forEach((v, i) => {
        //   targetMap[v.attributeName] = v.valExpress;
        // });
        let xmlJsonArray = that.flowData.xmlJsonArray || [];
        if (
          that.isNullOrEmpty(
            xmlJsonArray.find((data) => data.id === conn.sourceId)
          )
        ) {
          xmlJsonArray.push(sourceMap);
        }
        if (
          that.isNullOrEmpty(
            xmlJsonArray.find((data) => data.id === conn.targetId)
          )
        ) {
          xmlJsonArray.push(targetMap);
        } else {
          that.$set(
            xmlJsonArray.find((data) => data.id === conn.targetId),
            "pid",
            conn.sourceId
          );
        }

        that.$set(that.flowData, "xmlJsonArray", xmlJsonArray);
        o.label = label;
        o.cls = {
          linkType: flowConfig.jsPlumbInsConfig.Connector[0],
          linkColor: flowConfig.jsPlumbInsConfig.PaintStyle.stroke,
          linkThickness: flowConfig.jsPlumbInsConfig.PaintStyle.strokeWidth,
        };
        $("#" + id).bind("contextmenu", function (e) {
          that.showLinkContextMenu(e);
          that.currentSelect = that.flowData.linkList.filter(
            (l) => l.id == id
          )[0];
        });
        $("#" + id).bind("click", function (e) {
          let event = window.event || e;
          event.stopPropagation();
          that.currentSelect = that.flowData.linkList.filter(
            (l) => l.id == id
          )[0];
        });
        that.linkList.push({
          id: o.targetId,
          pid: o.sourceId,
          name: that.flowData.nodeList.find((node) => node.id == o.targetId)
            .nodeName,
        });
        that.flowData.linkList.push(o);
      });

      that.plumb.importDefaults({
        ConnectionsDetachable: flowConfig.jsPlumbConfig.conn.isDetachable,
      });

      ZFSN.consoleLog(["实例化线条工具成功..."]);
    },
    initNodeSelectArea() {
      $(".node-item").draggable({
        opacity: flowConfig.defaultStyle.dragOpacity,
        helper: "clone",
        cursorAt: {
          top: 16,
          left: 60,
        },
        containment: "window",
        revert: "invalid",
      });
      ZFSN.consoleLog(["初始化节点选择列表成功..."]);
    },
    listenShortcut() {
      const that = this;
      document.onkeydown = function (e) {
        let event = window.event || e;

        if (!that.activeShortcut) return;
        let key = event.keyCode;

        switch (key) {
          case flowConfig.shortcut.multiple.code:
            that.$refs.flowArea.rectangleMultiple.flag = true;
            break;
          case flowConfig.shortcut.dragContainer.code:
            that.$refs.flowArea.container.dragFlag = true;
            break;
          case flowConfig.shortcut.scaleContainer.code:
            that.$refs.flowArea.container.scaleFlag = true;
            break;
          case flowConfig.shortcut.dragTool.code:
            that.selectTool("drag");
            break;
          case flowConfig.shortcut.connTool.code:
            that.selectTool("connection");
            break;
          case flowConfig.shortcut.zoomInTool.code:
            that.selectTool("zoom-in");
            break;
          case flowConfig.shortcut.zoomOutTool.code:
            that.selectTool("zoom-out");
            break;
          case 37:
            that.moveNode("left");
            break;
          case 38:
            that.moveNode("up");
            break;
          case 39:
            that.moveNode("right");
            break;
          case 40:
            that.moveNode("down");
            break;
        }

        if (event.ctrlKey) {
          if (event.altKey) {
            switch (key) {
              case flowConfig.shortcut.settingModal.code:
                that.setting();
                break;
              case flowConfig.shortcut.testModal.code:
                that.openTest();
                break;
            }
          }
        }
      };
      document.onkeyup = function (e) {
        let event = window.event || e;

        let key = event.keyCode;
        if (key == flowConfig.shortcut.dragContainer.code) {
          that.$refs.flowArea.container.dragFlag = false;
        } else if (key == flowConfig.shortcut.scaleContainer.code) {
          event.preventDefault();
          that.$refs.flowArea.container.scaleFlag = false;
        } else if (key == flowConfig.shortcut.multiple.code) {
          that.$refs.flowArea.rectangleMultiple.flag = false;
        }
      };

      ZFSN.consoleLog(["初始化快捷键成功..."]);
    },
    listenPage() {
      window.onbeforeunload = function (e) {
        e = e || window.event;
        if (e) {
          e.returnValue = "关闭提示";
        }
        return "关闭提示";
      };
    },
    initFlow() {
      const that = this;

      if (that.flowData.status == flowConfig.flowStatus.CREATE) {
        that.flowData.attr.id = ZFSN.getId();
      } else {
        that.loadFlow();
      }
      ZFSN.consoleLog(["初始化模板成功..."]);
    },
    loadFlow(json) {
      const that = this;
      that.clear();
      that.$nextTick(()=>{
let loadData = JSON.parse(json);
      that.flowData.attr = loadData.attr;
      that.flowData.config = loadData.config;
      that.flowData.status = flowConfig.flowStatus.LOADING;
      that.flowData.xmlJsonArray = loadData.xmlJsonArray;
      that.plumb.batch(function () {
        let nodeList = loadData.nodeList;
        nodeList.forEach(function (node, index) {
          that.flowData.nodeList.push(node);
        });
        let linkList = loadData.linkList;
        that.$nextTick(() => {
          linkList.forEach(function (link, index) {
            that.flowData.linkList.push(link);
            let conn = that.plumb.connect({
              source: link.sourceId,
              target: link.targetId,
              anchor: flowConfig.jsPlumbConfig.anchor.default,
              connector: [
                link.cls.linkType,
                {
                  gap: 5,
                  cornerRadius: 8,
                  alwaysRespectStubs: true,
                },
              ],
              paintStyle: {
                stroke: link.cls.linkColor,
                strokeWidth: link.cls.linkThickness,
              },
            });
            if (link.label != "") {
              conn.setLabel({
                label: link.label,
                cssClass: "linkLabel",
              });
            }
          });
          that.currentSelect = {};
          that.currentSelectGroup = [];
          that.flowData.status = flowConfig.flowStatus.MODIFY;
          that.$nextTick(() => {
            that.initFlag = true;
          });
        });
      }, true);
      let canvasSize = that.computeCanvasSize();
      that.$refs.flowArea.container.pos = {
        top: -canvasSize.minY + 100,
        left: -canvasSize.minX + 100,
      };
      })
      
    },
    findNodeConfig(belongto, type, tagName, callback) {
      let node = null;
      switch (belongto) {
        case "commonNodes":
          node = commonNodes.filter((n) => n.type == type);
          break;
        case "highNodes":
          node = this.field.highNodes.filter((n) => n.nodeName == tagName);
          break;
        case "laneNodes":
          node = laneNodes.filter((n) => n.type == type);
          break;
      }
      if (node && node.length >= 0) node = node[0];
      callback(node);
    },
    selectTool(type) {
      let tool = tools.filter((t) => t.type == type);
      if (tool && tool.length >= 0) this.currentTool = tool[0];

      switch (type) {
        case "drag":
          this.changeToDrag();
          break;
        case "connection":
          this.changeToConnection();
          break;
        case "zoom-in":
          this.changeToZoomIn();
          break;
        case "zoom-out":
          this.changeToZoomOut();
          break;
      }
    },
    changeToDrag() {
      const that = this;

      that.flowData.nodeList.forEach(function (node, index) {
        let f = that.plumb.toggleDraggable(node.id);
        if (!f) {
          that.plumb.toggleDraggable(node.id);
        }
        if (node.type != "x-lane" && node.type != "y-lane") {
          that.plumb.unmakeSource(node.id);
          that.plumb.unmakeTarget(node.id);
        }
      });
    },
    changeToConnection() {
      const that = this;

      that.flowData.nodeList.forEach(function (node, index) {
        let f = that.plumb.toggleDraggable(node.id);
        if (f) {
          that.plumb.toggleDraggable(node.id);
        }
        if (node.type != "x-lane" && node.type != "y-lane") {
          that.plumb.makeSource(
            node.id,
            flowConfig.jsPlumbConfig.makeSourceConfig
          );
          that.plumb.makeTarget(
            node.id,
            flowConfig.jsPlumbConfig.makeTargetConfig
          );
        }
      });

      that.currentSelect = {};
      that.currentSelectGroup = [];
    },
    changeToZoomIn() {
      console.log("切换到放大工具");
    },
    changeToZoomOut() {
      console.log("切换到缩小工具");
    },
    checkFlow() {
      const that = this;
      let nodeList = that.flowData.nodeList;

      if (nodeList.length <= 0) {
        this.$message.error("当前模板并未有任何节点元素！");
        return false;
      }
      return true;
    },
    async save() {
      let result = await this.saveFlow();
      if (result) {
        this.$message.success("保存成功");
      }
    },
    async saveFlow() {
      const that = this;
      let flowObj = Object.assign({}, that.flowData);
      if (!that.checkFlow()) return;
      flowObj.status = flowConfig.flowStatus.SAVE;
      let d = JSON.stringify(flowObj);
      let template = this.$store.getters.GET_CURRENT_TEMPLATE;
      let param = {
        templateId: template.templateId,
        templateName: template.templateName,
        templateContentStr: d,
        restfulUrl: template.restfulUrl,
        odfXmlStr: template.odfXmlStr,
        templateClassCode:template.templateClassCode,
        bodyId:template.bodyId
      };
      return restful.saveTemplate(that, param);
    },
    exportFlowPicture() {
      const that = this;

      if (!that.checkFlow()) return;

      let $Container = that.$refs.flowArea.$el.children[0],
        svgElems = $($Container).find('svg[id^="link-"]'),
        removeArr = [];

      svgElems.each(function (index, svgElem) {
        let linkCanvas = document.createElement("canvas");
        let canvasId = "linkCanvas-" + ZFSN.getId();
        linkCanvas.id = canvasId;
        removeArr.push(canvasId);

        let svgContent = svgElem.outerHTML.trim();
        canvg(linkCanvas, svgContent);
        if (svgElem.style.position) {
          linkCanvas.style.position += svgElem.style.position;
          linkCanvas.style.left += svgElem.style.left;
          linkCanvas.style.top += svgElem.style.top;
        }
        $($Container).append(linkCanvas);
      });

      let canvasSize = that.computeCanvasSize();

      let pbd = flowConfig.defaultStyle.photoBlankDistance;
      let offsetPbd = ZFSN.div(pbd, 2);

      html2canvas($Container, {
        width: canvasSize.width + pbd,
        height: canvasSize.height + pbd,
        scrollX: -canvasSize.minX + offsetPbd,
        scrollY: -canvasSize.minY + offsetPbd,
        logging: false,
        onclone: function (args) {
          removeArr.forEach(function (id, index) {
            $("#" + id).remove();
          });
        },
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png");
        that.flowPicture.url = dataURL;
        that.flowPicture.modalVisible = true;
      });
    },
    downLoadFlowPicture() {
      const that = this;
      let alink = document.createElement("a");
      let alinkId = "alink-" + ZFSN.getId();
      alink.id = alinkId;
      alink.href = that.flowPicture.url;
      alink.download = "模板设计图" + that.flowData.attr.id + ".png";
      alink.click();
    },
    cancelDownLoadFlowPicture() {
      this.flowPicture.url = "";
      this.flowPicture.modalVisible = false;
    },
    computeCanvasSize() {
      const that = this;
      let nodeList = Object.assign([], that.flowData.nodeList),
        minX = nodeList[0].x,
        minY = nodeList[0].y,
        maxX = nodeList[0].x + nodeList[0].width,
        maxY = nodeList[0].y + nodeList[0].height;
      nodeList.forEach(function (node, index) {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + node.width);
        maxY = Math.max(maxY, node.y + node.height);
      });
      let canvasWidth = maxX - minX;
      let canvasHeight = maxY - minY;
      return {
        width: canvasWidth,
        height: canvasHeight,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
      };
    },
    /**
     * @description: 清理当前画布
     * @author xiejr
     * @return void
     */
    clear() {
      const that = this;
      that.flowData.nodeList.forEach(function (node, index) {
        that.plumb.remove(node.id);
      });
      that.currentSelect = {};
      that.currentSelectGroup = [];
      that.flowData.nodeList = [];
      that.flowData.linkList = [];
      that.flowData.remarks = [];
      that.flowData.xmlJsonArray=[];
    },
    toggleShowGrid() {
      let flag = this.flowData.config.showGrid;
      if (flag) {
        this.flowData.config.showGrid = false;
        this.flowData.config.showGridText = "显示网格";
        this.flowData.config.showGridIcon = "eye-invisible";
      } else {
        this.flowData.config.showGrid = true;
        this.flowData.config.showGridText = "隐藏网格";
        this.flowData.config.showGridIcon = "eye";
      }
    },
    setting() {
      this.$refs.settingModal.open();
    },
    shortcutHelper() {
      this.$refs.shortcutModal.open();
    },
    usingDoc() {
      window.open(this.info.gitee);
    },
    exit() {
      alert("退出模板编辑器...");
    },
    showLinkContextMenu(e) {
      let event = window.event || e;

      event.preventDefault();
      event.stopPropagation();
      $(".vue-contextmenuName-flow-menu").css("display", "none");
      $(".vue-contextmenuName-node-menu").css("display", "none");
      let x = event.clientX;
      let y = event.clientY;
      this.linkContextMenuData.axis = { x, y };
    },
    deleteLink() {
      const that = this;
      let sourceId = that.currentSelect.sourceId;
      let targetId = that.currentSelect.targetId;
      that.plumb.deleteConnection(
        that.plumb.getConnections({
          source: sourceId,
          target: targetId,
        })[0]
      );
      let linkList = that.flowData.linkList;
      linkList.splice(
        linkList.findIndex(
          (link) => link.sourceId == sourceId || link.targetId == targetId
        ),
        1
      );
      that.currentSelect = {};
    },
    loseShortcut() {
      this.activeShortcut = false;
    },
    getShortcut() {
      this.activeShortcut = true;
    },
    openTest() {
      const that = this;

      let flowObj = Object.assign({}, that.flowData);
      that.$refs.testModal.flowData = flowObj;
      that.$refs.testModal.testVisible = true;
    },
    moveNode(type) {
      const that = this;

      let m = flowConfig.defaultStyle.movePx,
        isX = true;
      switch (type) {
        case "left":
          m = -m;
          break;
        case "up":
          m = -m;
          isX = false;
          break;
        case "right":
          break;
        case "down":
          isX = false;
      }

      if (that.currentSelectGroup.length > 0) {
        that.currentSelectGroup.forEach(function (node, index) {
          if (isX) {
            node.x += m;
          } else {
            node.y += m;
          }
        });
        that.plumb.repaintEverything();
      } else if (that.currentSelect.id) {
        if (isX) {
          that.currentSelect.x += m;
        } else {
          that.currentSelect.y += m;
        }
        that.plumb.repaintEverything();
      }
    },
    selectOtherTemplates() {
      console.log(this.flowData);
      this.$store.commit("SET_TEMPLATE_DIALOG_VISIBLE", true);
    },

    /**
     * @description: 根据当前完成的节点图生成对应的xml字符串
     * @author: xiejr
     */
    genXmlStr() {
      let that = this;
      let xmlJsonArray = JSON.parse(JSON.stringify(that.flowData.xmlJsonArray));
      let resArray = [];
      let foreachArray = [];
      xmlJsonArray.map((data) => {
        let obj = that.flowData.nodeList.find((node) => node.id === data.id);
        let param = { id: data.id, name: data.name };
        let forTag = {};
        if (obj.isMulti) {
          forTag.id = ZFSN.getId();
          forTag.name = "foreach-" + forTag.id;
          foreachArray.push({
            id: forTag.name,
            autoField: obj.autoField,
            valExpression: obj.contentExpress,
          });
          if (data.pid) {
            forTag.pid = data.pid;
          }
          param.pid = forTag.id;
          resArray.push(forTag);
        } else {
          if (data.pid) {
            param.pid = data.pid;
          }
        }

        obj.attrs.forEach((v, i) => {
          param[v.attributeName] = v.valExpress;
        });
        resArray.push(param);
        return param;
      });
      let resultArray = this.transformTozTreeFormat(resArray);
      let body = {};
      resultArray.forEach((v, i) => {
        let resMap = {};
        that.makeResult(v, resMap);
        body[resMap["_name"]] = resMap;
        that.removeXmlNameAttr(resMap);
      });
      let result = this.$x2js.js2xml(body);
      foreachArray.forEach((v, i) => {
        let reg = new RegExp(`<${v.id}>`, "g");
        let item = v.autoField.slice(0, v.autoField.length - 1);
        let forVal = `<% for( ${item} in ${v.autoField} ){`;
        let replaceStr = that.formatContent(v.valExpression, v.autoField);
        result = result.replace(reg, forVal + "\n" + replaceStr + "%>");
        result = result.replace(new RegExp(`</${v.id}>`), "<% } %>");
      });
      this.$set(
        this.$store.getters.GET_CURRENT_TEMPLATE,
        "odfXmlStr",
        formatXml(result)
      );
    },

    formatContent(expression, autofield) {
      let g = this;
      let contentExpress = null;
      let contentStr = "";
      let field = autofield;
      if (!g.isNullOrEmpty(expression)) {
        try {
          contentExpress = JSON.parse(expression);
          let keys = Object.keys(contentExpress);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let v = contentExpress[key];
            v = v.replace(/\${each}/g, field.slice(0, field.length - 1));
            contentStr += `\nvar ${key}=${v};`;
          }
        } catch (e) {
          console.log("转换异常，原因是:" + e);
          contentStr = expression;
        }
      }
      return contentStr;
    },
    /**
     * @description: 点击创建模板
     * @author: xiejr
     */
    newTemplate(){
      let that=this;
      let template = this.$store.getters.GET_CURRENT_TEMPLATE;
      that.judgeTemplateModified((action, instance) => {
            if (action == "confirm") {
                that.saveFlow().then((res) => {
                  that.clear();
                  that.$nextTick(()=>{
                    this.$store.commit("SET_NEW_TEMPLATE_DIALOG_VISIBLE", true);
                  })
                });
              
            }else{
                  that.$nextTick(()=>{
                    this.$store.commit("SET_NEW_TEMPLATE_DIALOG_VISIBLE", true);
                  })
            }
          },()=>{
 that.$nextTick(()=>{
                    this.$store.commit("SET_NEW_TEMPLATE_DIALOG_VISIBLE", true);
                  })
          })
       
                 
      
    },

    /**
     * @description: 判断当前模板是否修改过
     * @author: xiejr
     */
    judgeTemplateModified(callback,not){
      let that=this;
 let template = this.$store.getters.GET_CURRENT_TEMPLATE;
      if (!that.isNullOrEmpty(template) && template.modified) {
                that.$confirm("当前模板存在修改,是否先保存？", "温馨提示", {
          type: "info",
          showClose: true,
          center: true,
          callback: callback
        });
    }else{
      not();
    }
    },

    /**
     * @description: 创建模板对话框关闭事件
     * @author: xiejr
     */
    newTemplateClose(){
      this.$store.commit("SET_NEW_TEMPLATE_DIALOG_VISIBLE", false);
    },
    /**
     * @description: 开始创建模板
     * @author: xiejr
     */
    createTemplate(){
      let that=this;
      that.$refs['newTem'].validate((valid)=>{
        if(valid){
          let template={
            templateId:ZFSN.getUUID(),
            templateName:this.newTemObj.templateName,
            templateClassCode: that.newTemObj.templateClassCode,
            templateContentStr:'',
            restfulUrl:'',
            odfXmlStr:'',
            bodyId:that.newTemObj.bodyId,
            modified:false,
          };
          that.clear();
          that.$nextTick(()=>{
            that.$store.commit('SET_CURRENT_TEMPLATE',template);
            that.handleDialogClose();
            that.newTemplateClose();
          })
        }else{
          return false;
        }
      })
    }
  },
  computed: {
    edited() {
      let template = JSON.parse(
        JSON.stringify(this.$store.getters.GET_CURRENT_TEMPLATE)
      );
      delete template.modified;
      return this.isEmptyObject(template);
    },
    /**
     * @description: 所有项目组
     * @author: xiejr
     */
    projects(){
      let templates=this.$store.getters.GET_TEMPLATES || [];
      return templates.map(data=>{
        return {
          id:data.id,
          name:data.label
        }
      });
    },
    bodys(){
      let bodys=this.$store.getters.GET_BODY || [];
      return bodys.map(data=>{
        return {
          bodyId:data.id,
          name:data.node.elementName
        }
      })
    }
  },
  created() {
    let g = this;
    //初始化获取所有节点和属性
    restful.initAll(this).then((data) => {
      let result = JSON.parse(decrypto(data));
      let nodes = JSON.parse(result.nodes);
      let templates = JSON.parse(result.templates);
      g.$store.commit(
        "SET_TEMPLATES",
        templates.map((t) => {
          let obj = {
            id: t.templateClass.id,
            list: t.list.map((l) => {
              g.$set(l, "className", t.templateClass.className);
              g.$set(l, "label", l.templateName);
              g.$set(l, "modified", false);
              return l;
            }),
            label: t.templateClass.className,
          };

          return obj;
        })
      );
      g.$store.commit("SET_NODES", nodes);
      g.$store.commit(
        "SET_BODY",
        nodes.filter((node) => node.node.isBody == "1")
      );
      g.field.highNodes = nodes
        .filter((data) => data.node.isBody != "1")
        .map((d) => {
          return {
            id: d.node.id,
            type: "event",
            icon: "EventIcon",
            nodeName: d.node.elementName,
            autoField: d.node.autoField,
            isMulti: d.node.isSimple == 1,
            isClosure: d.node.isClosure == "0",
            contentExpress: d.node.contentExpress,
            attrs: d.attrs,
          };
        });

      g.$nextTick(() => {
        g.dealCompatibility();
        g.initNodeSelectArea();
        g.initJsPlumb();
        g.listenShortcut();
        g.initFlow();
        g.listenPage();
      });
    });
  },
};
</script>

<style lang="scss">
@import "./style/flow-designer.scss";
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
