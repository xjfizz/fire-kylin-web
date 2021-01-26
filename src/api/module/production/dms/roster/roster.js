import request from '@/utils/request'

// 查询设备排班列表
export function listRoster(query) {
  return request({
    url: '/dms/roster/listDeviceRoster',
    method: 'get',
    params: query
  })
}


// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/dms/device/listDevice',
    method: 'get',
    params: query
  })
}

// 关联人员-设备
export function relationDevice(data) {
  return request({
    url: '/dms/roster/relationRosterUser',
    method: 'put',
    data: data
  })
}

// 移除关联人员-设备
export function removeDevicePeople(data) {
  return request({
    url: '/dms/roster/removeRosterUser',
    method: 'put',
    data: data
  })
}

// 获取生产职工
export function getProducter(data) {
  return request({
    url: `/system/user/queryListPwUser?userKey=${data.userKey}`,
    method: 'get',
    query: data
  })
}

