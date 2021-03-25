import request from '@/utils/request'

// 查询代裁款式列表
export function getStyleList(query) {
  return request({
    url: '/web/proxy/server/listStyle',
    method: 'get',
    params: query
  })
}

// 查询代裁材质列表
export function getMaterialList(query) {
    return request({
      url: '/web/proxy/server/listMaterial',
      method: 'get',
      params: query
    })
  }

  // 查询服务材质列表
export function getServerList(query) {
    return request({
      url: '/web/proxy/server/listParameter',
      method: 'get',
      params: query
    })
  }

    // 保存服务材质列表
export function saveServerList(data) {
    return request({
      url: '/web/proxy/server/updateOrSaveParameter',
      method: 'post',
      data: data
    })
  }

 // 删除服务材质列表
export function delServerList(data) {
    return request({
      url: '/web/proxy/server/remove',
      method: 'delete',
      params: data
    })
  }


  
 // 删除服务材质列表
export function delServerListParameter(data) {
  return request({
    url: '/web/proxy/server/removeParameter',
    method: 'delete',
    params: data
  })
}