import request from '@/utils/request'

// 查询客户管理列表
export function customerList(query) {
  return request({
    url: '/wkp/customer/info/list',
    method: 'get',
    params: query
  })
}

// 导出订单
export function exportOrder(query) {
    return request({
      url: '/wkp/customer/info/export',
      method: 'get',
      params: query
    })
  }

  // 获取销售员
export function getSalerListApi(query) {
    return request({
      url: '/system/user/queryListSellerUser',
      method: 'get',
      params: query
    })
  }
  
// 分配销售员
export function orderAssignSaler(data) {
    return request({
      url: '/wkp/customer/info/assignSeller',
      method: 'post',
      data: data
    })
  }

  // 移除关联销售
export function removeSaler(data) {
    return request({
      url: '/wkp/customer/info/removeAssignSeller',
      method: 'delete',
      params:data
    })
  }


