/**
 * Created by xiejiarong on 2016/7/12.
 */
import $ from 'jquery'

/**
 * js Map 实现
 * @returns {Map}
 */
function Map() {
  this.keys = [];
  this.data = {};
  /**
   * 放入一个键值对
   * @param {String} key
   * @param {Object} value
   */
  this.put = function (key, value) {
    if (this.data[key] == null) {
      this.keys.push(key);
    }
    this.data[key] = value;
  };
  /**
   * 获取某键对应的值
   * @param {String}  key
   * @return {Object} value
   */
  this.get = function (key) {
    return this.data[key];
  };
  /**
   * 是否包含该键
   */
  this.contain = function (key) {
    var value = this.data[key];
    if (value)
      return true;
    else
      return false;
  };
  /**
   * 删除一个键值对
   * @param {String} key
   */
  this.remove = function (key) {
    for (var index = 0; index < this.keys.length; index++) {
      if (this.keys[index] == key) {
        this.keys.splice(index, 1);
        break;
      }
    }
    //this.keys.remove(key);
    this.data[key] = null;
  };
  /**
   * 遍历Map,执行处理函数
   * @param {Function} 回调函数 function(key,value,index){..}
   */
  this.each = function (fn) {
    if (typeof fn != 'function') {
      return;
    }
    var len = this.keys.length;
    for (var i = 0; i < len; i++) {
      var k = this.keys[i];
      fn(k, this.data[k], i);
    }
  };
  /**
   * 获取键值数组(类似Java的entrySet())
   * @return 键值对象{key,value}的数组
   */
  this.entrys = function () {
    var len = this.keys.length;
    var entrys = new Array(len);
    for (var i = 0; i < len; i++) {
      entrys[i] = {
        key: this.keys[i],
        value: this.data[i]
      };
    }
    return entrys;
  };
  /**
   * 判断Map是否为空
   */
  this.isEmpty = function () {
    return this.keys.length == 0;
  };
  /**
   * 获取键值对数量
   */
  this.size = function () {
    return this.keys.length;
  };
  /**
   * 重写toString
   */
  this.toString = function () {
    var s = "{";
    for (var i = 0; i < this.keys.length; i++, s += ',') {
      var k = this.keys[i];
      s += k + "=" + this.data[k];
    }
    s += "}";
    return s;
  };
}

/**
 * js List 实现 -- 其实就是数组Array
 * @returns {Map}
 */
function List() {
  this.value = [];
  /*添加*/
  this.add = function (obj) {
    return this.value.push(obj);
  };
  /*大小*/
  this.size = function () {
    return this.value.length;
  };
  /*返回指定索引的值*/
  this.get = function (index) {
    return this.value[index];
  };
  /*删除指定索引的值*/
  this.remove = function (index) {
    this.value.splice(index, 1);
    return this.value;
  };

  /*删除全部值*/
  this.removeAll = function () {
    return this.value = [];
  };
  /*是否包含某个对象*/
  this.constains = function (obj) {
    for (var i in this.value) {
      if (obj == this.value[i]) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
}
let result = {
  install: function (Vue) {
    $.extend(Vue.prototype, {
      setScreen: function () {
        const that = this
        window.onresize = () => {
          return (() => {
            window.fullHeight = document.documentElement.clientHeight
            that.fullHeight = window.fullHeight
          })()
        }
      }

    });
    $.extend(Vue.prototype, {
      getsec: function (str) {
        var str1 = str.substring(1, str.length) * 1;
        var str2 = str.substring(0, 1);
        if (str2 == "s") {
          return str1 * 1000;
        } else if (str2 == "h") {
          return str1 * 60 * 60 * 1000;
        } else if (str2 == "d") {
          return str1 * 24 * 60 * 60 * 1000;
        }
      },
      setCookie: function (name, value, time) {
        var strsec = this.getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
      },
      getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);
        else return null;
      },
      delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      }

    });
    $.extend(Vue.prototype, {

      /**
       * 判断参数是否为null或者undefined或者""或者" "；(除去0的情况)
       */
      isNullOrEmpty: function (obj) {
        var flag = false;
        if (obj == null || obj == undefined || typeof (obj) == 'undefined' || obj === '') {
          flag = true;
        } else if (typeof (obj) == 'string') {
          //obj = obj.trim();//IE6和7不支持
          var spaceRe = new RegExp("^[ ]+$");
          if (spaceRe.test(obj)) { //为空
            flag = true;
          } else { //不为空
            obj = obj.toUpperCase();
            if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
              flag = true;
            }
          }
        } else {
          flag = false;
        }
        return flag;
      },

      /**
       * 判断参数是否为null或者undefined
       */
      isNull: function (obj) {
        var flag = false;
        if (obj == null || obj == undefined || typeof (obj) == 'undefined') {
          flag = true;
        }
        return flag;
      },

      /**
       * 判断对象是否为空对象，即{}
       */
      isEmptyObject: function (obj) {
        for (var n in obj) {
          return false
        }
        return true;
      },

      /**
       * 判断数组是否不为空且有值
       */
      havaArray: function (obj) {
        var flag = false;
        if (obj != null && obj.length > 0) {
          flag = true;
        }
        return flag;
      }
    })
    /*********************** 空判断操作 ***********************/




    /*********************** 数字类操作 ***********************/


    /*********************** 字符类操作 ***********************/

    $.extend(Vue.prototype, {

      /**
       * 去除字符串最后一个字符 （第二个参数缺省代表逗号，常用语拼接JSON数组后去除最后个逗号）
       */
      removeLastChar: function (str, LastChar) {
        var LastCharT = LastChar == undefined ? "," : LastChar;
        var resultStrAll = str;
        if (resultStrAll.substring(resultStrAll.length - 1, resultStrAll.length) == LastCharT) {
          resultStrAll = resultStrAll.substring(0, resultStrAll.length - 1);
        }
        return resultStrAll;
      },

      /**
       * 验证字符串长度区间（非字符串则都是返回false）
       */
      betweenLength: function (str, _min, _max) {
        return (str.length >= _min && str.length <= _max);
      },

      /**
       * 判断是否有汉字
       * 或使用/[^x00-xff]/g.test(this)
       */
      checkHavaCn: function (str) {
        if (escape(str).indexOf("%u") != -1) {
          alert("含有汉字");
          return true;
        } else {
          alert("全是字符");
          return false;
        }
      },

      /**
       * 正则判断输入字符串是否是由数字字母下划线和横杠组成
       * 横杠是特殊字符，要用反斜扛将它转义：[\-]
       */
      checkStr: function (str) {
        var reg = /^[0-9a-zA-Z_\-]+$/;
        if (!reg.test(str)) {
          return false;
        } else {
          return true;
        }
      },

      /**
       * checkStr加入中文判断
       */
      checkStrCN: function (str) {
        var reg = "^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$";
        return new RegExp(reg).test(str);
      },

      /**
       * 是否为合法的手机号码，为了兼容国际写法，目前只判断了是否是+数字
       */
      isMobilePhone: function (value) {
        if (value.search(/^(\+\d{2,3})?\d{11}$/) == -1)
          return false;
        else
          return true;
      },

      /**
       * 是否为合法Email地址
       */
      isEmail: function (value) {
        if (value.search(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == -1)
          return false;
        else
          return true;
      },

      /**
       * 是否为合法的QQ号
       */
      isQQ: function (value) {
        if (value.search(/^[1-9][0-9]{4,}$/) == -1)
          return false;
        else
          return true;
      },

      /**
       * 是否为合法的国内电话号码
       */
      isTelphone: function (value) {
        if (value.search(/^(\d{3}-\d{8}|\d{4}-\d{7}|\d{4}-\d{8})$/) == -1)
          return false;
        else
          return true;
      },

      /**
       * 是否为合法的国内邮政编码
       */
      isZipcode: function (value) {
        if (value.search(/^[1-9]\d{5}$/) == -1)
          return false;
        else
          return true;
      },

      /**
       * 是否为合法IP地址
       */
      isAllIP: function (value, innerIP) {
        var reg_ip = new RegExp('^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$');
        if (!reg_ip.exec(value)) {
          return false;
        }

        var strs = value.split(".");
        if (strs.length != 4) {
          return false;
        }
        for (var i = 0; i < strs.length; i++) {
          if (strs[i].indexOf("0") == 0 && strs[i].length > 1) {
            return false;
          } else if (parseInt(strs[i]) > 255 || parseInt(strs[i]) < 0) {
            return false;
          }
        }
        if (innerIP == false) {
          if (value.search(/^192\.168\./) != -1 || value.search(/^172/) != -1 || value.search(/^127\.0/) != -1) {
            return false;
          }
        }
        return true;
      },
      /**
       * 是否为合法身份证
       * 返回true=身份证为合法的，1=身份证号码位数不对，2=身份证号码出生日期超出范围或含有非法字符，3=身份证号码校验错误
       */
      isCardNo: function (idcard) {
        var Errors = [1, 2, 3];
        var area = {
          11: "",
          12: "",
          13: "",
          14: "",
          15: "",
          21: "",
          22: "",
          23: "",
          31: "",
          32: "",
          33: "",
          34: "",
          35: "",
          36: "",
          37: "",
          41: "",
          42: "",
          43: "",
          44: "",
          45: "",
          46: "",
          50: "",
          51: "",
          52: "",
          53: "",
          54: "",
          61: "",
          62: "",
          63: "",
          64: "",
          65: "",
          71: "",
          81: "",
          82: "",
          91: ""
        }

        var idcard, Y, JYM;
        var S, M, ereg;
        var idcard_array = new Array();
        idcard_array = idcard.split("");
        //地区检验
        if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[2];
        //身份号码位数及格式检验
        switch (idcard.length) {
          case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
              ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
            } else {
              ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
            }
            if (ereg.test(idcard)) return true;
            else return Errors[1];
            break;
          case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
              ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
            } else {
              ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) { //测试出生日期的合法性
              //计算校验位
              S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
                (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
                (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
                (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
                (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
                (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
                (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
                parseInt(idcard_array[7]) * 1 +
                parseInt(idcard_array[8]) * 6 +
                parseInt(idcard_array[9]) * 3;
              Y = S % 11;
              M = "F";
              JYM = "10X98765432";
              M = JYM.substr(Y, 1); //判断校验位
              if (M == idcard_array[17]) return true; //检测ID的校验位
              else return Errors[2];
            } else return Errors[1];
            break;
          default:
            return Errors[0];
            break;
        }

      },
      /**
       * 获取URL上的参数
       * keyName: url的key值，为空或者传""表示返回参数组成的对象
       * url: url链接，为空的话用window.location.href代替
       * 比如getUrlParam(),返回{key:"1",id:"2"}。(假设window.location.href=www.baidu.com?key=1&id=2)
       */
      getUrlParam: function (keyName, urlParam) {
        var urlName = urlParam ? urlParam : window.location.search;
        var arr, paramJson = {};
        if (urlName == "") {
          return null;
        } else {
          urlName = decodeURI(urlName);
          var paramStr = urlName.split("?")[1];
          if (paramStr == undefined) return null;
          var items = paramStr.split("&");
          for (var i = 0, l = items.length; i < l; i++) {
            arr = items[i].split("=");
            paramJson[arr[0]] = arr[1];
          }
        }
        if (keyName) {
          if (paramJson[keyName] != undefined) {
            return paramJson[keyName];
          } else { //不存在这个key值
            return null;
          }
        } else {
          return paramJson;
        }
      }
    });

    /*********************** 基础工具，不好归类 ***********************/

    $.extend(Vue.prototype, {

      /**
       * 判断浏览器是否IE浏览器
       */
      checkIE: function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          return true;
        } else {
          return false;
        }
      },

      /**
       * 获取一个Java-Map
       */
      newMap: function () {
        return new Map();
      },

      /**
       * 获取一个Java-List
       */
      newList: function () {
        return new List();
      },

      /**
       * iframe访问父元素的方法
       * iframe访问父方法，直接使用parent.方法名()即可
       *
       * @param elementId 元素ID
       * @param JQ_DOM_FLAG 是否返回JQ包装集
       */
      getParentElement: function (elementId, JQ_DOM_FLAG) {
        if (JQ_DOM_FLAG == true) {
          return $('#' + elementId, parent.document);
        } else {
          return window.parent.document.getElementById(elementId);
        }
      },

      /**
       * 父页面访问子元素的方法
       * 父页面访问子方法，直接iframe的name.window.方法名()即可
       *
       * @param iframeId 子元素ID
       * @param elementId 元素ID
       * @param JQ_DOM_FLAG 是否返回JQ包装集
       */
      getIframeElement: function (iframeId, elementId, JQ_DOM_FLAG) {
        if (JQ_DOM_FLAG == true) {
          return $("#" + iframeId).contents().find("#" + elementId);
        } else {
          return document.getElementById("iframeId").contentWindow.document.getElementById(elementId);
        }
      },
      /**
       * 获取最顶层的window对象
       * @param window 当前window对象
       * @returns {Window} 最顶层window对象
       */
      getTopParentWindow: function (window) {
        var pWindow = window.parent;
        if (pWindow != null) {
          while (pWindow !== pWindow.parent) {
            pWindow = pWindow.parent;
          }
        } else {
          return pWindow;
        }
        return pWindow;
      }
    });

    /**
     * Date对象方法扩展
     */
    $.extend(Date.prototype, {

      // 对Date的扩展，将 Date 转化为指定格式的String
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
      // var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
      // var time2 = new Date().Format("yyyy-MM-dd");
      // var time3 = new Date("2012-12-12").Format("yyyy-MM-dd hh:mm:ss");
      Format: function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      },

      //日期加减
      //<param name="datepart" type="string">
      //日期加减的部分:
      //Year, yy, yyyy--年
      //quarter, qq, q --季
      //Month, mm, m --    月
      //dayofyear, dy, y--    日
      //Day, dd, d --    日
      //Week, wk, ww --    周
      //Hour, hh --    小时
      //minute, mi, n --    分钟
      //second, ss, s --    秒
      //millisecond, ms --    毫秒
      //</param>
      //<param name="number" type="int">
      //要加减的数量
      //</param>
      //<param name="returnNewObjec" type="bool">
      //若参数为true值，则操作结果由一个新的日期对象返回，原日期对象不变；
      //否则返回的是原日期对象,此时原日期对象的值是操作结果.
      //</param>
      //<returns type="Date">返回一个日期对象
      //调用例子：new Date().add('dayofyear',1,true)
      add: function (datepart, number, returnNewObjec) {

        datepart = datepart.toLowerCase();
        var tDate;
        if (typeof (returnNewObjec) == "boolean") {
          if (returnNewObjec == true) {
            tDate = new Date(this);
          } else {
            tDate = this;
          }
        } else {
          tDate = this;
        }

        switch (datepart) {
          case "year":
          case "yy":
          case "yyyy":
            tDate.setFullYear(this.getFullYear() + number);
            break;
          case "quarter":
          case "qq":
          case "q":
            tDate.setMonth(this.getMonth() + (number * 3));
            break;
          case "month":
          case "mm":
          case "m":
            tDate.setMonth(this.getMonth() + number);
            break;
          case "dayofyear":
          case "dy":
          case "y":
          case "day":
          case "dd":
          case "d":
            tDate.setDate(this.getDate() + number);
            break;
          case "week":
          case "wk":
          case "ww":
            tDate.setDate(this.getDate() + (number * 7));
            break;
          case "hour":
          case "hh":
            tDate.setHours(this.getHours() + number);
            break
          case "minute":
          case "mi":
          case "n":
            tDate.setMinutes(this.getMinutes() + number);
            break
          case "second":
          case "ss":
          case "s":
            tDate.setSeconds(this.getSeconds() + number);
            break;
          case "millisecond":
          case "ms":
            tDate.setMilliseconds(this.getMilliseconds() + number);
            break;
        }
        return tDate;
      },

      //计算开始日期与当前日期的差,返回差的绝对值。
      //<param name="datepart" type="string">
      //日期加减的部分:
      //Year, yy, yyyy--年 ;
      //quarter, qq, q --季
      //Month, mm, m --    月
      //dayofyear, dy, y--    日
      //Day, dd, d --    日
      //Week, wk, ww --    周
      //Hour, hh --    小时
      //minute, mi, n --    分钟
      //second, ss, s --    秒
      //millisecond, ms --    毫秒
      //</param>
      //<param name="beginDate" type="DateTime">
      //要用于比较的日期
      //</param>
      //<returns type="int">
      //返回日期差的绝对值。
      //</returns>
      //调用例子：new Date().dateDiff('dayofyear',new Date('2014-9-26'))
      dateDiff: function (datepart, beginDate) {
        datepart = datepart.toLowerCase();
        var yearDiff = Math.abs(this.getFullYear() - beginDate.getFullYear());
        switch (datepart) {
          case "year":
          case "yy":
          case "yyyy":
            return yearDiff;
          case "quarter":
          case "qq":
          case "q":
            var qDiff = 0;
            switch (yearDiff) {
              case 0:
                qDiff = Math.abs(this.getSeason() - beginDate.getSeason());
                break;
              case 1:
                qDiff = (this.getSeason() - new Date(this.getFullYear(), 0, 1).getSeason()) +
                  (new Date(beginDate.getFullYear(), 11, 31).getSeason() -
                    beginDate.getSeason()) + 1;
                break;
              default:
                qDiff = (this.getSeason() - new Date(this.getFullYear(), 0, 1).getSeason()) +
                  (new Date(beginDate.getFullYear(), 11, 31).getSeason() -
                    beginDate.getSeason()) + 1 + (yearDiff - 1) * 4;
                break;
            }
            return qDiff;
          case "month":
          case "mm":
          case "m":
            var monthDiff = 0;
            switch (yearDiff) {
              case 0:
                monthDiff = Math.abs(this.getMonth() - beginDate.getMonth());
                break;
              case 1:
                monthDiff = (this.getMonth() - new Date(this.getFullYear(), 0, 1).getMonth()) +
                  (new Date(beginDate.getFullYear(), 11, 31).getMonth() -
                    beginDate.getMonth()) + 1;
                break;
              default:
                monthDiff = (this.getMonth() - new Date(this.getFullYear(), 0, 1).getMonth()) +
                  (new Date(beginDate.getFullYear(), 11, 31).getMonth() -
                    beginDate.getMonth()) + 1 + (yearDiff - 1) * 12;
                break;
            }
            return monthDiff;
          case "dayofyear":
          case "dy":
          case "y":
          case "day":
          case "dd":
          case "d":
            return Math.abs((this.setHours(0, 0, 0, 0) - beginDate.setHours(0, 0, 0, 0)) / 1000 / 60 / 60 / 24);
          case "week":
          case "wk":
          case "ww":
            var weekDiff = 0;
            switch (yearDiff) {
              case 0:
                weekDiff = Math.abs(this.getWeek() - beginDate.getWeek());
                break;
              case 1:
                weekDiff = (this.getWeek() - new Date(this.getFullYear(), 0, 1).getWeek()) +
                  (new Date(beginDate.getFullYear(), 11, 31).getWeek() -
                    beginDate.getWeek()) + 1;
                break;
              default:

                weekDiff = (this.getWeek() - new Date(this.getFullYear(), 0, 1).getWeek()) +
                  (new Date(beginDate.getFullYear(), 11, 31).getWeek() -
                    beginDate.getWeek()) + 1;
                var thisYear = this.getFullYear();
                for (var i = 1; i < yearDiff; i++) {
                  weekDiff += new Date(thisYear - i, 0, 1).getWeeksOfYear();
                }
                break;
            }
            return weekDiff;
          case "hour":
          case "hh":
            return Math.abs((this - beginDate) / 1000 / 60 / 60);
          case "minute":
          case "mi":
          case "n":
            return Math.abs((this - beginDate) / 1000 / 60);
          case "second":
          case "ss":
          case "s":
            return Math.abs((this - beginDate) / 1000);
          case "millisecond":
          case "ms":
            return Math.abs(this - beginDate);
        }
      }
    });

    /**
     * Date静态方法扩展
     */
    $.extend(Date, {
      /**
       * 获取格式化时间（根据时间戳）
       */
      formatTime: function (time, fmt) {
        if (nullUtil.isNullOrEmpty(time)) {
          return "";
        }
        if (nullUtil.isNullOrEmpty(fmt)) {
          fmt = "yyyy-MM-dd";
        }
        return new Date(time).Format(fmt);
      },
      /**
       * 获取当前时间（YYYY-MM-DD）
       */
      getNowDate: function () {
        var nowDate = new Date();
        var temp = nowDate.getFullYear() + '-' + (nowDate.getMonth() >= 9 ? (nowDate.getMonth() + 1) : '0' + (nowDate.getMonth() + 1)) + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : '0' + nowDate.getDate());
        return temp;
      },

      /**
       * 字符串日期转换为日期格式，或者直接new Date('2012-12-12')
       */
      str2Date: function (dateN) {
        var dateTemp = new Date(Date.parse(dateN.replace(/-/g, "/")));
        return dateTemp;
      },

      /**
       * 字符串日期转换为日期格式（兼容时间戳、时分秒以及IE浏览器等形式）
       */
      strToDate: function (strDate) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          if (!isNaN(strDate)) {
            return new Date(strDate);
          } else {
            if (strDate.indexOf(" ") != -1) {
              return newDateAndTime(strDate);
            } else {
              return newDate(strDate);
            }
          }
        } else {
          return new Date(strDate);
        }
      },

      /**
       * 获取当月最后一天是几号，例：getLastDay(2013,11)
       */
      getLastDay: function (year, month) {
        var new_year = year; //取当前的年份
        var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
        if (month > 12) //如果当前大于12月，则年份转到下一年
        {
          new_month -= 12; //月份减
          new_year++; //年份增
        }
        var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
        var date_count = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月的天数
        var last_date = new Date(new_date.getTime() - 1000 * 60 * 60 * 24); //获得当月最后一天的日期
        return date_count;
      }
    });

  }
}
export default result
