import request from '@/utils/request'

// 查询web端工场信息列表
export function listInfo(query) {
  return request({
    url: '/system/workshop/info/list',
    method: 'get',
    params: query
  })
}

// 查询web端工场信息详细
export function getInfo(pkid) {
  return request({
    url: '/system/workshop/info/' + pkid,
    method: 'get'
  })
}

// 新增web端工场信息
export function addInfo(data) {
  return request({
    url: '/system/workshop/info',
    method: 'post',
    data: data
  })
}

// 修改web端工场信息
export function updateInfo(data) {
  return request({
    url: '/system/workshop/info',
    method: 'put',
    data: data
  })
}

// 删除web端工场信息
export function delInfo(pkid) {
  return request({
    url: '/system/workshop/info/' + pkid,
    method: 'delete'
  })
}

// 导出web端工场信息
export function exportInfo(query) {
  return request({
    url: '/system/info/export',
    method: 'get',
    params: query
  })
}

// 获取工场详细信息
export function getWorkshopInfoDetail() {
  return request({
    url: '/system/workshop/info',
    method: 'get'
  })
}

// 更新工场信息
export function updateWorkshopInfoDetail(data) {
  return request({
    url: '/system/workshop/info',
    method: 'put',
    data: data
  })
}

// 新增工场信息
export function addWorkshopInfoDetail(data) {
  return request({
    url: '/system/workshop/info/addWorkshopInfo',
    method: 'post',
    data: data
  })
}
// 工场头像上传
export function uploadWkpImage(data) {
  return request({
    url: '/system/workshop/info/uploadWkpImage',
    method: 'post',
    data: data
  })
}
