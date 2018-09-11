import { request, config } from 'utils'

const { api } = config
const { entityIncrease } = api

export function query (params) {
  return request({
    url: entityIncrease + '/get/:id',
    method: 'get',
    data: params,
  })
}

export function queryParams (params) {
  return request({
    url: entityIncrease + '/queryParams',
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: entityIncrease+'/addEntity',
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: entityIncrease+'/delete',
    method: 'post',
    data: params,
  })
}

export function update (params) {
  return request({
    url: entityIncrease+'/modifyEntity',
    method: 'post',
    data: params,
  })
}

export function removeBatch (params) {
  return request({
    url: entityIncrease + '/deleteBatch',
    method: 'post',
    data: params,
  })
}
