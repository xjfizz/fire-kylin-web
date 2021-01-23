import request from '@/utils/request'

// 查询sys系统角色字符列表
export function listKey(query) {
  return request({
    url: '/system/key/list',
    method: 'get',
    params: query
  })
}

// 查询sys系统角色字符详细
export function getKey(pkid) {
  return request({
    url: '/system/key/' + pkid,
    method: 'get'
  })
}

// 新增sys系统角色字符
export function addKey(data) {
  return request({
    url: '/system/key',
    method: 'post',
    data: data
  })
}

// 修改sys系统角色字符
export function updateKey(data) {
  return request({
    url: '/system/key',
    method: 'put',
    data: data
  })
}

// 删除sys系统角色字符
export function delKey(pkid) {
  return request({
    url: '/system/key/' + pkid,
    method: 'delete'
  })
}

// 导出sys系统角色字符
export function exportKey(query) {
  return request({
    url: '/system/key/export',
    method: 'get',
    params: query
  })
}