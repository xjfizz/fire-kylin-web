import request from '@/utils/request'

// 查询工场账户余额对账记录列表
export function listRecord(query) {
  return request({
    url: '/wkp/reconciliation/record/list',
    method: 'get',
    params: query
  })
}

// 查询工场账户余额对账记录详细
export function getRecord(pkid) {
  return request({
    url: '/wkp/reconciliation/record/' + pkid,
    method: 'get'
  })
}

// 新增工场账户余额对账记录
export function addRecord(data) {
  return request({
    url: '/wkp/reconciliation/record',
    method: 'post',
    data: data
  })
}

// 修改工场账户余额对账记录
export function updateRecord(data) {
  return request({
    url: '/wkp/reconciliation/record',
    method: 'put',
    data: data
  })
}

// 删除工场账户余额对账记录
export function delRecord(pkid) {
  return request({
    url: '/wkp/reconciliation/record/' + pkid,
    method: 'delete'
  })
}

// 导出工场账户余额对账记录
export function exportRecord(query) {
  return request({
    url: '/wkp/reconciliation/record/export',
    method: 'get',
    params: query
  })
}
