/*
 * @Author: your name
 * @Date: 2020-08-20 14:48:58
 * @LastEditTime: 2020-09-11 16:01:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \odf-editor-ui\src\mixins\Transform.js
 */
export default {
  methods: {
    transformTozTreeFormat(sNodes) {
      //将普通的数组转换为父子结构
      let resMap = {};
      var i, l;
      var r = [];
      var tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        var p = tmpMap[sNodes[i].pid];
        if (p && sNodes[i].id != sNodes[i].pid) {
          var children = this.nodeChildren(p);
          if (!children) {
            children = this.nodeChildren(p, []);
          }
          children.push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },
    nodeChildren: function (node, newChildren) {
      if (typeof newChildren !== "undefined") {
        node.children = newChildren;
      }
      return node.children;
    },

    makeResult: function (source, map) {
      let that = this;
      let keys = Object.keys(source);
      keys.forEach((value, index) => {
        if (value != "children") {
          map['_' + value] = source[value];
        }

      })
      if (source.children) {
        source.children.forEach((v, i) => {
          if (map.hasOwnProperty(v.name)) {
            let obj = map[v.name];
            let arr = [];
            arr.push(obj);
            let next = {};
            arr.push(next);
            map[v.name] = arr;
            that.makeResult(v, next)

          } else {
            let next = {};
            map[v.name] = next;
            that.makeResult(v, next)
          }

        })
      }

    }
  }




}
