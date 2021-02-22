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

// 取消订单
export function cancelOrder(pkid) {
  return request({
    url: '/oms/web/order/cancel/' + pkid,
    method: 'put'
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

// 获取当天生产员
export function getProducters(query) {
  return request({
    url: '/dms/roster/listPwUser',
    method: 'get',
    params: query
  })
}

// 获取检测员
export function getCheckerListApi(query) {
  return request({
    url: '/system/user/queryListIpUser',
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

// 查询设备排班列表
export function listRoster(query) {
  return request({
    url: '/dms/roster/listDeviceRoster',
    method: 'get',
    params: query
  })
}

// 查询设备排班列表
export function orderRosterProduct(data) {
  return request({
    url: '/oms/web/order/assignOrder',
    method: 'post',
    data: data
  })
}


// 查询设备排班列表
export function orderPrint(data) {
  return request({
    url: '/oms/web/order/orderPrint',
    method: 'get',
    params: data
  })
}


// 分配检测员
export function orderAssignChecker(data) {
  return request({
    url: '/oms/web/order/assignOrderInspectors',
    method: 'post',
    data: data
  })
}


// 分配配送员
export function orderAssignSender(data) {
  return request({
    url: '/oms/web/order/assignOrderDelivery',
    method: 'post',
    data: data
  })
}

// 已取货
export function orderPicked(data) {
  return request({
    url: '/oms/web/order/pickedUp',
    method: 'put',
    data: data
  })
}
