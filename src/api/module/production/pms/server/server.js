import request from '@/utils/request'

// 查询web端服务分类列表
export function listServerCategory() {
  return request({
    url: '/module/production/category/list',
    method: 'get'
  })
}

// 查询web端服务列表
export function listServer(query) {
  return request({
    url: '/module/production/server/list',
    method: 'get',
    params: query
  })
}

// 查询web端服务详细
export function getServer(pkid) {
  return request({
    url: '/module/production/server/' + pkid,
    method: 'get'
  })
}

// 新增web端服务
export function addServer(data) {
  return request({
    url: '/module/production/server',
    method: 'post',
    data: data
  })
}

// 修改web端服务
export function updateServer(data) {
  return request({
    url: '/module/production/server',
    method: 'put',
    data: data
  })
}

// 删除web端服务
export function delServer(pkid) {
  return request({
    url: '/module/production/server/' + pkid,
    method: 'delete'
  })
}

// 导出web端服务
export function exportServer(query) {
  return request({
    url: '/module/production/server/export',
    method: 'get',
    params: query
  })
}

// 服务状态修改
export function changeServerStatus(pkid, serverStatus) {
  const data = {
    pkid,
    serverStatus
  }
  return request({
    url: '/module/production/server/changeServerStatus',
    method: 'put',
    data: data
  })
}
