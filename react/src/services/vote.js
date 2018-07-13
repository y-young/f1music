import { request, config } from 'utils'

const { api } = config
const { list, report, vote } = api

export function Songs (time) {
  return request({
    url: list,
    method: 'post',
    data: { 'time': time }
  })
}

export function Report (id, reason) {
  return request({
    url: report,
    method: 'post',
    data: { 'id': id, 'reason': reason }
   })
}

export function Vote (params) {
  return request({
    url: vote,
    method: 'post',
    data: params
  })
}
