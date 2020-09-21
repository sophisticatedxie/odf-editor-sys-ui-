import qs from 'qs'
export default {
  methods: {
    /**
     *
     * @param url  请求的url
     * @param data  json 参数
     * @param config  对象采用解构方法:
     * isErrorTip  错误时弹出错误提示信息，默认为true
     * errContent  错误提示信息，不想直接显示后端的错误，则设置此值
     * disableName  控制元素禁止还没加载完再重复点击的需求，当前的唯一标识，可以把此变量名放到data里
     * isLoading   Boolean,String  是否显示加载中 默认为true true:显示加载中但没有遮罩 mask:显示加载中并且有遮罩
     * noRepeatId  唯一id 禁止重复请求，在模糊查询的时候需要，避免一直向后端请求数据，永远只获取最后一次的数据，从而大大提高性能，一般开发是不需要设置此属性
     * axiosCf axios 配置信息
     * renDisName 在渲染时禁止请求的标识，主要是在ajax错误的时候删掉，否则只要错误就无法再次请求
     * @returns {Promise}
     */
    $restPost(url, data, config) {
      config = config || {}
      if (!config.axiosCf) {
        config.axiosCf = {}
      }
      config.axiosCf.data = data
      config.axiosCf.method = 'post'
      return this.$rest(url, config)
    },
    $restPut(url, data, config) {
      config = config || {}
      if (!config.axiosCf) {
        config.axiosCf = {}
      }
      config.axiosCf.data = data
      config.axiosCf.method = 'put'
      return this.$rest(url, config)
    },
    $restPatch(url, data, config) {
      config = config || {}
      if (!config.axiosCf) {
        config.axiosCf = {}
      }
      config.axiosCf.data = data
      config.axiosCf.method = 'patch'
      return this.$rest(url, config)
    },
    $restGet(url, data, config) {
      config = config || {}
      if (!config.axiosCf) {
        config.axiosCf = {}
      }
      data = data || {}
      data = qs.stringify(data)
      if (data) {
        url = url + '?' + data
      }
      config.axiosCf.method = 'get'
      return this.$rest(url, config)
    },
    $restDelete(url, data, config) {
      config = config || {}
      if (!config.axiosCf) {
        config.axiosCf = {}
      }
      config.axiosCf.data = data
      config.axiosCf.method = 'delete'
      return this.$rest(url, config)
    },

    $rest(url, {
      isErrorTip = true,
      errContent,
      disableName,
      renDisName,
      isLoading = true,
      noRepeatId,
      axiosCf = {}
    } = {}) {
      let g = this;
      return new Promise((resolve, reject) => {
        g.$store.commit('SET_LOADING', true);
        axiosCf.headers = {
          'Content-Type': 'application/json;charset=UTF-8'
        }
        axiosCf.url = url
        g.rest(axiosCf).then(data => {
          g.$store.commit('SET_LOADING', false);
          resolve(data)
        }).catch(result => {
          g.$store.commit('SET_LOADING', false);
          g.$msgbox({
            title: '请求错误',
            message: result.message,
            type: 'error'
          });
          reject(result)
        })
      })
    }
  }

}
