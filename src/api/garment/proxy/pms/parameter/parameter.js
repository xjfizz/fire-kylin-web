import request from '@/utils/request'

// 查询代裁参数管理列表
export function listParameter(query) {
  return request({
    url: '/proxy/parameter/list',
    method: 'get',
    params: query
  })
}

// 查询代裁参数管理详细
export function getParameter(pkid) {
  return request({
    url: '/proxy/parameter/' + pkid,
    method: 'get'
  })
}

// 新增代裁参数管理
export function addParameter(data) {
  return request({
    url: '/proxy/parameter',
    method: 'post',
    data: data
  })
}

// 修改代裁参数管理
export function updateParameter(data) {
  return request({
    url: '/proxy/parameter',
    method: 'put',
    data: data
  })
}

// 删除代裁参数管理
export function delParameter(pkid) {
  return request({
    url: '/proxy/parameter/' + pkid,
    method: 'delete'
  })
}

// 导出代裁参数管理
export function exportParameter(query) {
  return request({
    url: '/proxy/parameter/export',
    method: 'get',
    params: query
  })
}

// 代裁款式状态修改
export function changeProxyParameterStatus(pkid, proxyParameterStatus) {
  const data = {
    pkid,
    proxyParameterStatus
  }
  return request({
    url: '/proxy/parameter/changeProxyParameterStatus',
    method: 'put',
    data: data
  })
}
