import request from '@/utils/request'

// 查询订单列表
export function listOrder(query) {
  return request({
    url: '/oms/web/order/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrder(pkid) {
  return request({
    url: '/oms/web/order/' + pkid,
    method: 'get'
  })
}

// 新增订单
export function addOrder(data) {
  return request({
    url: '/oms/web/order',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateOrder(data) {
  return request({
    url: '/oms/web/order',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delOrder(pkid) {
  return request({
    url: '/oms/web/order/' + pkid,
    method: 'delete'
  })
}

// 导出订单
export function exportOrder(query) {
  return request({
    url: '/oms/web/order/export',
    method: 'get',
    params: query
  })
}

// 获取配送员
export function getPickers(query) {
  return request({
    url: '/system/user/queryListDpUser',
    method: 'get',
    params: query
  })
}

// 合并取料
export function mergeOrder(data) {
  return request({
    url: '/oms/web/order/combinedReclaim',
    method: 'post',
    data: data
  })
}

// 确认接单
export function confirmOrder(data) {
  return request({
    url: '/oms/web/order/combinedConfirmOrder',
    method: 'put',
    data: data
  })
}
