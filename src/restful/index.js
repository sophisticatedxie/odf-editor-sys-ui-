/*
 * @Author: your name
 * @Date: 2020-07-27 17:01:29
 * @LastEditTime: 2020-08-19 15:05:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \odf-editor-ui\src\restful\index.js
 */
export default {
  /**
   * 界面初始化获取节点和属性资源
   */
  async initAll(vue) {
    return vue.$restGet("/etTemplate/initAll");
  },

  async saveTemplate(vue, param) {
    return vue.$restPost("/etTemplate/saveOrUpdate", param);
  },

  async genOdfResult(vue, templateId) {
    return vue.$restPost(`/etTemplate/genXmlResult/${templateId}`)
  }




}
