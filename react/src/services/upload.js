import { request, config } from 'utils'

const { api } = config
const { search, mp3, upload } = api

export function Search (keyword) {
  return request({
    url: search,
    method: 'post',
    data: { 'keyword': keyword }
  })
}

export function Mp3 (id) {
  return request({
    url: mp3,
    method: 'post',
    data: { 'id': id }
  })
}

export function Upload (time, name, origin, id) {
  return request({
    url: upload,
    method: 'post',
    data: { 'time': time, 'name': name, 'origin': origin, 'id': id }
  })
}
