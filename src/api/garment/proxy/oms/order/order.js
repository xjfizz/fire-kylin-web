import request from '@/utils/request'

// 查询代裁订单列表1
export function listOrder(query) {
  return request({
    url: '/oms/web/proxy/order/list',
    method: 'get',
    params: query
  })
}

// 查询代裁订单详细
export function getOrder(pkid) {
  return request({
    url: '/oms/web/proxy/order/' + pkid,
    method: 'get'
  })
}

// 新增代裁订单
export function addOrder(data) {
  return request({
    url: '/oms/web/proxy/order',
    method: 'post',
    data: data
  })
}

// 修改代裁订单
export function updateOrder(data) {
  return request({
    url: '/oms/web/proxy/order',
    method: 'put',
    data: data
  })
}

// 删除代裁订单
export function delOrder(pkid) {
  return request({
    url: '/oms/web/proxy/order/' + pkid,
    method: 'delete'
  })
}

// 导出代裁订单
export function exportOrder(query) {
  return request({
    url: '/oms/web/proxy/order/export',
    method: 'get',
    params: query
  })
}
