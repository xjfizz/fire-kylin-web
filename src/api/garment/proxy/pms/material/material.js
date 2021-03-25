import request from '@/utils/request'

// 查询代裁材质管理列表
export function listMaterial(query) {
  return request({
    url: '/proxy/material/list',
    method: 'get',
    params: query
  })
}

// 查询代裁材质管理详细
export function getMaterial(pkid) {
  return request({
    url: '/proxy/material/' + pkid,
    method: 'get'
  })
}

// 新增代裁材质管理
export function addMaterial(data) {
  return request({
    url: '/proxy/material/save',
    method: 'post',
    data: data
  })
}

// 修改代裁材质管理
export function updateMaterial(data) {
  return request({
    url: '/proxy/material/update',
    method: 'put',
    data: data
  })
}

// 删除代裁材质管理
export function delMaterial(pkid) {
  return request({
    url: '/proxy/material/' + pkid,
    method: 'delete'
  })
}

// 导出代裁材质管理
export function exportMaterial(query) {
  return request({
    url: '/proxy/material/export',
    method: 'get',
    params: query
  })
}

// 代裁款式状态修改
export function changeProxyMaterialStatus(pkid, proxyMaterialStatus) {
  const data = {
    pkid,
    proxyMaterialStatus
  }
  return request({
    url: '/proxy/material/changeProxyMaterialStatus',
    method: 'put',
    data: data
  })
}

// 获取款式列表-不分页
export function styleList(query) {
  return request({
    url: '/proxy/style/listStyle',
    method: 'get',
    params: query
  })
}
