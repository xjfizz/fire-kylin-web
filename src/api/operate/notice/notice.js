import request from '@/utils/request'

// 查询通知公告列表
export function listNotice(query) {
  return request({
    url: '/wkp/notice/list',
    method: 'get',
    params: query
  })
}

// 查询通知公告详细
export function getNotice(pkid) {
  return request({
    url: '/wkp/notice/' + pkid,
    method: 'get'
  })
}

// 新增通知公告
export function addNotice(data) {
  return request({
    url: '/wkp/notice',
    method: 'post',
    data: data
  })
}

// 修改通知公告
export function updateNotice(data) {
  return request({
    url: '/wkp/notice',
    method: 'put',
    data: data
  })
}

// 删除通知公告
export function delNotice(pkid) {
  return request({
    url: '/wkp/notice/' + pkid,
    method: 'delete'
  })
}

// 导出通知公告
export function exportNotice(query) {
  return request({
    url: '/wkp/notice/export',
    method: 'get',
    params: query
  })
}
