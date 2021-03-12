import request from '@/utils/request'
let produceApi = {

  // 查询工场首页-生产业务-统计Tab数据
  getObtainTabList:(params)=> {
    return request({
      url: '/wkp/home/info/obtainTabData',
      method: 'get',
      params: params
    })
  },

  // 查询工场首页-生产业务-统计Tab数据-订单模块
  getObtainOrderTabList:(params)=> {
      return request({
      url: '/wkp/home/info/obtainOrderTabData',
      method: 'get',
      params: params
    })
  },


   // 查询工场首页-生产业务-统计Tab数据-产能模块
   getObtainProduceTabList:(params)=> {
    return request({
    url: '/wkp/home/info/obtainProductionCapacityTabData',
    method: 'get',
    params: params
  })
},

  // 查询工场首页-生产业务-统计Tab数据-实收模块
  getObtainIncomeTabList:(params)=> {
    return request({
    url: '/wkp/home/info/obtainIncomeTabData',
    method: 'get',
    params: params
  })
},

  // 查询工场首页-生产业务-统计Tab数据-用户模块
  getObtainUserTabList:(params)=> {
    return request({
    url: '/wkp/home/info/obtainUserTabData',
    method: 'get',
    params: params
  })
},

}

export default produceApi

