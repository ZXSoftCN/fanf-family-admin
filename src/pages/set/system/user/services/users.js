import { request, config } from 'utils'

const { api } = config
const { users,user } = api

export function query (params) {
  return request({
    url: users,
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

export function remove (params) {
  return request({
    url: users + '/deleteBatch',
    method: 'post',
    data: params,
  })
}
