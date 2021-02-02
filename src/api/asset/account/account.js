import request from '@/utils/request'

// 查询工场账户列表
export function listAccount(query) {
  return request({
    url: '/wkp/account/list',
    method: 'get',
    params: query
  })
}

// 查询工场账户详细
export function getAccount(pkid) {
  return request({
    url: '/wkp/account/' + pkid,
    method: 'get'
  })
}

// 新增工场账户
export function addAccount(data) {
  return request({
    url: '/wkp/account',
    method: 'post',
    data: data
  })
}

// 修改工场账户
export function updateAccount(data) {
  return request({
    url: '/wkp/account',
    method: 'put',
    data: data
  })
}

// 删除工场账户
export function delAccount(pkid) {
  return request({
    url: '/wkp/account/' + pkid,
    method: 'delete'
  })
}

// 导出工场账户
export function exportAccount(query) {
  return request({
    url: '/wkp/account/export',
    method: 'get',
    params: query
  })
}
