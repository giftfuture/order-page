import request from '@/utils/request'
// import { encrypt } from '@/utils/rsaEncrypt'

export function listStaff (data) {
  return request({
    url: '/sysback/list',
    method: 'post',
    data
  })
}
export function add (data) {
  return request({
    url: '/sysback/add',
    method: 'post',
    data
  })
}

export function del (ids) {
  return request({
    url: '/sysback',
    method: 'delete',
    data: ids
  })
}

export function edit (data) {
  return request({
    url: '/sysback/edit',
    method: 'put',
    data
  })
}

// 重置密码
export function resetPwd (data) {
  return request({
    url: '/sysback/resetPwd',
    method: 'post',
    data
  })
}
// export function updatePass (user) {
//   const data = {
//     oldPass: encrypt(user.oldPass),
//     newPass: encrypt(user.newPass)
//   }
//   return request({
//     url: '/sysback/updatePass/',
//     method: 'post',
//     data
//   })
// }

// export function updateEmail (form) {
//   const data = {
//     password: encrypt(form.pass),
//     email: form.email
//   }
//   return request({
//     url: '/sysback/updateEmail/' + form.code,
//     method: 'post',
//     data
//   })
// }

export default { add, edit, del, listStaff }
