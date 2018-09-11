import { request, config } from 'utils'

const { api } = config
const { user } = api

export function login (data) {
  return request({
    url: user+'/login',
    method: 'post',
    data,
  })
}
