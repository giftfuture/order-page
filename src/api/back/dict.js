import request from '@/utils/request'

export function getDicts (data) {
  return request({
    url: '/dict/list',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: '/dict/add',
    method: 'post',
    data
  })
}
export function get (id) {
  return request({
    url: '/dict/' + id,
    method: 'get'
  })
}

export function del (id) {
  return request({
    url: '/dict/del?id=' + id,
    method: 'delete'
  })
}

export function edit (data) {
  return request({
    url: '/dict/edit',
    method: 'put',
    data
  })
}

export default { add, edit, get, del, getDicts }
