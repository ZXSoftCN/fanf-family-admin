import { request, config } from 'utils'

const { api } = config
const { menu } = api

export function query (params) {
  return request({
    url: menu + '/get/:id',
    method: 'get',
    data: params,
  })
}

export function queryParams (params) {
  return request({
    url: menu + '/queryParams',
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: menu+'/addEntity',
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: menu+'/delete',
    method: 'post',
    data: params,
  })
}

export function update (params) {
  return request({
    url: menu+'/modifyEntity',
    method: 'post',
    data: params,
  })
}

export function removeBatch (params) {
  return request({
    url: menu + '/deleteBatch',
    method: 'post',
    data: params,
  })
}
