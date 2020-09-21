/*
 * @Author: your name
 * @Date: 2020-07-27 11:16:24
 * @LastEditTime: 2020-09-17 11:33:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \odf-editor-ui\src\util\rest.js
 */
import axios from 'axios'
import local from '@/env.json'
let env = process.env.NODE_ENV;
let rest = {
  install: function (Vue) {
    //拦截request, 前后端交互统一使用json
    let request = axios.create({
      transformRequest: (data, Headers) => {
        if (data == null || data == undefined || typeof (data) == 'undefined' || data === '' || data == 'undefined') {
          data = {};
        }
        return JSON.stringify(data);
      },
      baseURL: env === 'development' ?local.url : 'http://www.xiejr.com:8081/et_center/editor-api',
      //5秒超时
      timeout: 500000000

    });
    //请求前置拦截
    request.interceptors.request.use((config) => {
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDA3NTcwMzEsInVzZXJJZCI6InhpYW94aWUifQ.Ii2daStCjHhCbsmUiWwKGAed3D2RIN818PHge90kHMo";
      config.headers['token'] = token;
      config.headers['operator'] = 'admin';
      return config;

    });

    //响应拦截器
    request.interceptors.response.use((response) => {
        const data = response.data;
        if (data.code != '200') {
          //不是200状态码的时候,需要格式化错误内容给用户
          switch (data.code) {
            case '500':
              data.error = '服务器内部异常,具体信息是:' + data.error;
              break;
            case '403':
              data.error = '你无权访问';
              break;
            default:
              data.error = '请求失败,联系后台人员';
              break;

          }
          return Promise.reject(data);
        }
        response = data.data;
        return response;
      },
      (err) => {
        // if (err && err.response) {
        //   switch (err.response.status) {
        //     case '400':
        //       err.error = '请求错误';
        //       break;
        //     case '401':
        //       err.error = '登录信息已过期,请重新登陆';
        //       break;
        //     case '404':
        //       err.error = '请求地址出错';
        //       break;
        //     case '500':
        //       error.error = '服务器内部异常,具体原因是' + err.data.message;
        //     default:
        //       err.error = '请求失败';
        //       break;
        //   }
        //   err.error = '请求超时，请检查接口是否可以正常访问！';
        // }
        throw new Error('请求超时，请检查接口是否可以正常访问')
      })
    Vue.prototype.rest = request;

  }

}
export default rest
