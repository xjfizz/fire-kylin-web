import request from '@/utils/request'

// 查询运单列表
export function listWaybill(query) {
  return request({
    url: '/logistics/waybill/list',
    method: 'get',
    params: query
  })
}

// 查询运单详细
export function getWaybill(pkid) {
  return request({
    url: '/logistics/waybill/' + pkid,
    method: 'get'
  })
}

// 新增运单
export function addWaybill(data) {
  return request({
    url: '/logistics/waybill',
    method: 'post',
    data: data
  })
}

// 修改运单
export function updateWaybill(data) {
  return request({
    url: '/logistics/waybill',
    method: 'put',
    data: data
  })
}

// 删除运单
export function delWaybill(pkid) {
  return request({
    url: '/logistics/waybill/' + pkid,
    method: 'delete'
  })
}

// 导出运单
export function exportWaybill(query) {
  return request({
    url: '/logistics/waybill/export',
    method: 'get',
    params: query
  })
}

// 查询运单列表
export function listDeliveryUser() {
  return request({
    url: '/logistics/waybill/listDeliveryUser',
    method: 'get'
  })
}


// 修改运单
export function settingDeliveryUser(data) {

  return request({
    url: '/logistics/waybill/settingDeliveryUser',
    method: 'put',
    data: data
  })
}
