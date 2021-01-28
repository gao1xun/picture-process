import axios from "axios";

axios.defaults.baseURL = "https://livestream.hitachi.wejoin.chat/api";
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*'

// 添加一个请求拦截器
axios.interceptors.request.use(
  config => {
    // config.headers.token = ''                 // 举例，加上一个公共头部
    // config.data = Qs.stringify(config.data)  // 处理数据，可不写
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

//添加一个响应拦截器
axios.interceptors.response.use(
  res => {
    //在这里对返回的数据进行处理
    console.log(res.data, "Net connection is ok.");
    return res.data;
  },
  err => {
    console.log("Net connection is failed！ Please try again ...");
    return Promise.reject(err);
  }
);

export default axios;
