/*
 * @Author: xiejiarong
 * @Date: 2020-08-20 10:55:31
 * @LastEditTime: 2020-09-23 10:18:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \editor-ui\odf-editor-ui\src\elementui\index.js
 */
import {

  Dialog,

  Input,


  Button,

  Table,
  TableColumn,

  Form,
  FormItem,
  Switch,
  Tag,
  Tree,
  Alert,
  Row,
  Col,

  Divider,

  Loading,
  MessageBox,
  Message,
  Notification,
  Option,
  Select,

} from 'element-ui';
// 引用
import ElScrollbar from "element-ui/lib/scrollbar";

const element={

    install:function(Vue){
        Vue.use(Dialog);
Vue.use(Input);

Vue.use(Option)
Vue.use(Select)

Vue.use(Button);

Vue.use(Table);
Vue.use(TableColumn);

Vue.use(Form);
Vue.use(FormItem);

Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch)


Vue.use(Divider);


Vue.use(Loading.directive);


Vue.use(ElScrollbar);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
    }
}
export default element
