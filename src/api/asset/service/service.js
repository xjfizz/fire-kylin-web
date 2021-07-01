import request from '@/utils/request'

// 查询工场服务费用记录列表
export function listRecord(query) {
  return request({
    url: '/asset/service/list',
    method: 'get',
    params: query
  })
}

// 查询工场服务费用记录详细
export function getRecord(pkid) {
  return request({
    url: '/asset/service/' + pkid,
    method: 'get'
  })
}

// 新增工场服务费用记录
export function addRecord(data) {
  return request({
    url: '/asset/service',
    method: 'post',
    data: data
  })
}

// 修改工场服务费用记录
export function updateRecord(data) {
  return request({
    url: '/asset/service',
    method: 'put',
    data: data
  })
}

// 删除工场服务费用记录
export function delRecord(pkid) {
  return request({
    url: '/asset/service/' + pkid,
    method: 'delete'
  })
}

// 导出工场服务费用记录
export function exportRecord(query) {
  return request({
    url: '/asset/service/export',
    method: 'get',
    params: query
  })
}
