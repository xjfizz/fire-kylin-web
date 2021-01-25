import request from '@/utils/request'

// 查询设备排班列表
export function listRoster(query) {
  return request({
    url: '/dms/roster/list',
    method: 'get',
    params: query
  })
}

// 查询设备排班详细
export function getRoster(pkid) {
  return request({
    url: '/dms/roster/' + pkid,
    method: 'get'
  })
}

// 新增设备排班
export function addRoster(data) {
  return request({
    url: '/dms/roster',
    method: 'post',
    data: data
  })
}

// 修改设备排班
export function updateRoster(data) {
  return request({
    url: '/dms/roster',
    method: 'put',
    data: data
  })
}

// 删除设备排班
export function delRoster(pkid) {
  return request({
    url: '/dms/roster/' + pkid,
    method: 'delete'
  })
}

// 导出设备排班
export function exportRoster(query) {
  return request({
    url: '/dms/roster/export',
    method: 'get',
    params: query
  })
}