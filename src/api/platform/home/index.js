import request from '@/utils/request'
let homeApi = {

  // 工场首页数据
  homeData:(params)=> {
    return request({
      url: '/wkp/proxy/home/info/obtainWkpHomeData',
      method: 'get',
      params: params
    })
  },



}

export default homeApi

