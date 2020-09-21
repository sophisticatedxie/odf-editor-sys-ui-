/*
 * @Author: xiejr
 * @Date: 2020-07-30 10:39:53
 * @LastEditTime: 2020-08-18 15:29:39
 * @LastEditors: Please set LastEditors
 * @Description: 模板缓存
 * @FilePath: \odf-editor-ui\src\store\template\index.js
 */
export default {
  state: {
    nodes: [],
    currentTemplate: {},
    templates: [],
    templatesDialogVisible: false,
    odfBody: [],

  },
  mutations: {
    SET_NODES(state, nodes) {
      state.nodes = nodes;
    },

    SET_CURRENT_TEMPLATE(state, template) {
      state.currentTemplate = template;
    },
    SET_TEMPLATES(state, templates) {
      state.templates = templates;
    },
    SET_TEMPLATE_DIALOG_VISIBLE(state, visible) {
      state.templatesDialogVisible = visible;
    },
    SET_BODY(state, body) {
      state.odfBody = body;
    }

  },
  actions: {
    async SET_CURRENT_TEMPLATE({
      commit
    }, payload) {
      commit('SET_CURRENT_TEMPLATE', payload);
      return;
    }
  },
  getters: {

    GET_CURRENT_TEMPLATE: state => state.currentTemplate,
    GET_TEMPLATES: state => state.templates,
    GET_TEMPLATE_DISLOG_VISIBLE: state => state.templatesDialogVisible,
    GET_BODY: state => state.odfBody,
    GET_NODES: state => state.nodes

  }



}
