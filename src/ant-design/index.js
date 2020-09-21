/*
 * @Author: your name
 * @Date: 2020-08-20 11:37:56
 * @LastEditTime: 2020-08-20 12:15:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \odf-editor-ui\src\ant-design\index.js
 */
import {
  Layout,
  Row,
  List,
  Form,
  Icon,
  Input,
  Button,
  Tooltip,
  Popconfirm,
  Tabs,
  Tag,
  Switch,
  Drawer,
  Divider,
  Slider,
  Select,
  Modal,
  Table,
  notification

} from 'ant-design-vue'


const ant = {
  install: function (Vue) {
    Vue.use(Layout)
    Vue.use(Row)
    Vue.use(List)
    Vue.use(Form)
    Vue.use(Icon)
    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Tooltip)
    Vue.use(Tabs)
    Vue.use(Popconfirm)
    Vue.use(Tag)
    Vue.use(Switch)
    Vue.use(Drawer)
    Vue.use(Divider)
    Vue.use(Slider)
    Vue.use(Select)
    Vue.use(Modal)
    Vue.use(Layout)
    Vue.use(Table)
    Vue.use(notification)
    Vue.prototype.$notification = notification;
  }

}

export default ant
