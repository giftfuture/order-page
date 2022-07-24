import request from '@/utils/request'

// 获取所有的Role
export function getAll (data) {
  return request({
    url: '/role/list',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function get (id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

export function del (id) {
  return request({
    url: '/role/del?id=' + id,
    method: 'delete'
  })
}

export function edit (data) {
  return request({
    url: '/role/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del, get, getAll }
