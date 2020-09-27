/*
 * @Author: your name
 * @Date: 2020-08-20 14:48:58
 * @LastEditTime: 2020-09-27 16:24:56
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
    /**
     * @description: 自定义递归算法,实现将有层级结构的array转换成可转成xml的json对象
     * @author: xiejr
     */
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

    },
    /**
     * @description: 代码段由json转换为文本
     * @author: xiejr
     */
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
            contentStr += `var ${key}=${v};`;
          }
        } catch (e) {
          console.log("转换异常，原因是:" + e);
          contentStr = expression;
        }
      }
      return contentStr;
    },
    /**
     * @description: 由JS对象转换为xml 字符串
     * @author: xiejr
     */
    transJsToXml(xmlJsonArray) {
      let that = this;
      let resArray = [];
      let templateArray = [];
      xmlJsonArray.map((data) => {
        let obj = that.flowData.nodeList.find((node) => node.id === data.id);
        let param = {
          id: data.id,
          name: data.name
        };
        let customTag = {};
        let conditionFlag = obj.conditionFlag && !that.isNullOrEmpty(obj.condition);
        //先判断条件表达式
        if (conditionFlag) {
          customTag.id = that.getId();
          customTag.name = "if-" + customTag.id;
          let condition = obj.condition;
          if (!that.isNullOrEmpty(obj.autoField)) {
            condition = condition.replace(/\${each}/g, obj.autoField.slice(0, obj.autoField.length - 1));
          }
          templateArray.push({
            id: customTag.name,
            startVal: `<% if(${condition}) { \n %>`,
            endVal: '<% } %>'
          })
          if (data.pid) {
            customTag.pid = data.pid;
          }
          data.pid = customTag.id;
          resArray.push({
            ...customTag
          });
          customTag = {};
        }
        if (!that.isNullOrEmpty(obj.contentExpress) || obj.isMulti) {
          customTag.id = that.getId();
          customTag.name = "template-" + customTag.id;
          let val = "";
          let startVal = "";
          let endVal = "";
          if (obj.isMulti) {
            let item = obj.autoField.slice(0, obj.autoField.length - 1);
            let forVal = `<% for( ${item} in ${obj.autoField} ){`;
            let replaceStr = that.formatContent(obj.contentExpress, obj.autoField);
            startVal = forVal + "\n" + replaceStr + "%>";
            endVal = "<% } %>";
          } else {
            startVal = "<%" + that.formatContent(obj.contentExpress, obj.autoField) + "%>";
            endVal = "<%  %>"
          }
          templateArray.push({
            id: customTag.name,
            startVal: startVal,
            endVal: endVal
          });
          if (data.pid) {
            customTag.pid = data.pid;
          }
          param.pid = customTag.id;
          resArray.push(customTag);
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
      let body = JSON.parse(JSON.stringify(that.$store.getters.GET_BODY.find(body => body.node.id == that.$store.getters.GET_CURRENT_TEMPLATE.bodyId)));

      let resultArray = this.transformTozTreeFormat(resArray);
      let template = {};
      let start = {};

      //TODO odfbody
      let odfBody = {

      };
      start[body.node.elementName] = odfBody;

      body.attrs.forEach((v, i) => {
        odfBody["_" + v.attributeName] = v.valExpress;
      });
      template.start = start;
      resultArray.forEach((v, i) => {
        let resMap = {};
        that.makeResult(v, resMap);
        odfBody[resMap["_name"]] = resMap;
        that.removeXmlNameAttr(resMap);
      });
      let result = this.$x2js.js2xml(template);
      result = that.resolvePlaceholders(result, templateArray);
      let startStr = "<% DIRECTIVE SAFE_OUTPUT_OPEN;%>" + "\n";
      startStr = startStr + "<% \n" + that.formatContent(body.node.contentExpress, body.node.autoField) + "\n %>";
      result = result.replace(/<start>/, startStr);
      result = result.replace(/<\/start>/, "<% \nDIRECTIVE SAFE_OUTPUT_CLOSE;\n%>")
      result = result.replace(/&#x27;/g, "'")
      result = result.replace(/&quot;/g, "\"")
      result = result.replace(/;/g, ";\n");
      result = result.replace(/>/g, ">\n");
      return result;
    },

    /**
     * @description: 处理for标签和template标签占位符
     * @author: xiejr
     * @param result 初步解析后的xml
     */
    resolvePlaceholders(result, templateArray) {
      templateArray.forEach((v, i) => {
        let reg = new RegExp(`<${v.id}>`, "g");
        result = result.replace(reg, v.startVal);
        result = result.replace(new RegExp(`</${v.id}>`), v.endVal);
      });
      return result;
    }
  }




}
