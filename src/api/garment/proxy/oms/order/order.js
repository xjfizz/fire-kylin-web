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

// 取消订单
export function cancelOrder(pkid) {
  return request({
    url: '/oms/web/order/cancel/' + pkid,
    method: 'put'
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

// 确认接单
export function confirmOrder(data) {
  return request({
    url: '/oms/web/proxy/order/confirmOrder',
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


// 获取当天f分配过生产员的设备
export function listRosterDevice(query) {
  return request({
    url: '/oms/web/proxy/order/listRosterDevice',
    method: 'get',
    params: query
  })
}

// 分配生产设备
export function orderAssignDevice(data) {
  return request({
    url: '/oms/web/proxy/order/assignProduce',
    method: 'post',
    data: data
  })
}

// 分配生产设备
export function orderAssignDeviceAgain(data) {
  return request({
    url: '/oms/web/proxy/order/againAssignProduce',
    method: 'put',
    data: data
  })
}

// 合并取料
export function mergeOrder(data) {
  return request({
    url: '/oms/web/proxy/order/combineReclaim',
    method: 'post',
    data: data
  })
}

// 分配检测员
export function orderAssignChecker(data) {
  return request({
    url: '/oms/web/proxy/order/assignOrderInspectors',
    method: 'post',
    data: data
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


// 分配配送员
export function orderAssignSender(data) {
  return request({
    url: '/oms/web/proxy/order/assignOrderDelivery',
    method: 'post',
    data: data
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

// 批量打印
export function orderPrints(data) {
  return request({
    url: '/oms/web/proxy/order/batchPrintOrder',
    method: 'post',
    data: data
  })
}

// 已取货
export function orderPicked(data) {
  return request({
    url: '/oms/web/proxy/order/pickedUp',
    method: 'put',
    data: data
  })
}
