import request from '@/utils/request'

// 查询web端服务类别列表
export function listCategory(query) {
  return request({
    url: '/module/production/category/list',
    method: 'get',
    params: query
  })
}

// 查询web端服务类别详细
export function getCategory(pkid) {
  return request({
    url: '/module/production/category/' + pkid,
    method: 'get'
  })
}

// 新增web端服务类别
export function addCategory(data) {
  return request({
    url: '/module/production/category',
    method: 'post',
    data: data
  })
}

// 修改web端服务类别
export function updateCategory(data) {
  return request({
    url: '/module/production/category',
    method: 'put',
    data: data
  })
}

// 删除web端服务类别
export function delCategory(pkid) {
  return request({
    url: '/module/production/category/' + pkid,
    method: 'delete'
  })
}

// 导出web端服务类别
export function exportCategory(query) {
  return request({
    url: '/module/production/category/export',
    method: 'get',
    params: query
  })
}

// 服务分类状态修改
export function changeServerCategoryStatus(pkid, categoryStatus) {
  const data = {
    pkid,
    categoryStatus
  }
  return request({
    url: '/module/production/category/changeCategoryStatus',
    method: 'put',
    data: data
  })
}
