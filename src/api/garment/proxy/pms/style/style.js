import request from '@/utils/request'

// 查询代裁款式管理列表
export function listStyle(query) {
  return request({
    url: '/proxy/style/list',
    method: 'get',
    params: query
  })
}

// 查询代裁款式管理详细
export function getStyle(pkid) {
  return request({
    url: '/proxy/style/' + pkid,
    method: 'get'
  })
}

// 新增代裁款式管理
export function addStyle(data) {
  return request({
    url: '/proxy/style',
    method: 'post',
    data: data
  })
}

// 修改代裁款式管理
export function updateStyle(data) {
  return request({
    url: '/proxy/style',
    method: 'put',
    data: data
  })
}

// 删除代裁款式管理
export function delStyle(pkid) {
  return request({
    url: '/proxy/style/' + pkid,
    method: 'delete'
  })
}

// 导出代裁款式管理
export function exportStyle(query) {
  return request({
    url: '/proxy/style/export',
    method: 'get',
    params: query
  })
}

// 代裁款式状态修改
export function changeProxyStyleStatus(pkid, proxyStyleStatus) {
  const data = {
    pkid,
    proxyStyleStatus
  }
  return request({
    url: '/proxy/style/changeProxyStyleStatus',
    method: 'put',
    data: data
  })
}
