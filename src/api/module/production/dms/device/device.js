import request from '@/utils/request'

// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/dms/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDevice(pkid) {
  return request({
    url: '/dms/device/' + pkid,
    method: 'get'
  })
}

// 新增设备
export function addDevice(data) {
  return request({
    url: '/dms/device',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateDevice(data) {
  return request({
    url: '/dms/device',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delDevice(pkid) {
  return request({
    url: '/dms/device/' + pkid,
    method: 'delete'
  })
}

// 导出设备
export function exportDevice(query) {
  return request({
    url: '/dms/device/export',
    method: 'get',
    params: query
  })
}

// 查询设备列表
export function listWorkshopPwUser() {
  return request({
    url: '/system/user/listPwUser',
    method: 'get'
  })
}

// 服务状态修改
export function changeDeviceStatus(pkid, deviceStatus) {
  const data = {
    pkid,
    deviceStatus
  }
  return request({
    url: '/dms/device/changeDeviceStatus',
    method: 'put',
    data: data
  })
}

// 新增设备
export function downloadImage(data) {
  return request({
    url: '/dms/device/downloadQrCode',
    method: 'post',
    data: data,
    responseType: "blob"
  })
}
