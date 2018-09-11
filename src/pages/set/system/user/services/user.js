import { request, config } from 'utils'

const { api } = config
const { user } = api

export function query (params) {
  return request({
    url: user + '/get/:id',
    method: 'get',
    data: params,
  })
}

export function queryParams (params) {
  return request({
    url: user + '/queryParams',
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: user+'/addEntity',
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: user+'/delete',
    method: 'post',
    data: params,
  })
}

export function update (params) {
  return request({
    url: user+'/modifyEntity',
    method: 'post',
    data: params,
  })
}

export function removeBatch (params) {
  return request({
    url: user + '/deleteBatch',
    method: 'post',
    data: params,
  })
}
