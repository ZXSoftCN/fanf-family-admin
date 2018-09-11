import { request, config } from 'utils'

const { api } = config
const { user } = api

export function login (params) {
  return request({
    url: user+'/login',
    method: 'post',
    data: params,
  })
}

export function logout (params) {
  return request({
    url: user+'/logout',
    method: 'get',
    data: params,
  })
}

export function query (params) {
  return request({
    // url: user.replace('/:id', ''),
    url: user+'/userPermission',
    method: 'get',
    data: params,
  })
}
