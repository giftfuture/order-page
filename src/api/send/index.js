import request from '@/utils/request'

// 获取员工列表
export function queryAllStaf (data) {
  return request({
    url: '/staf/queryAll',
    method: 'post',
    data
  })
}

// 发货组、开票和资料、打款组搜索分页
export function querySearch (data) {
  return request({
    url: '/order/querySearch',
    method: 'post',
    data
  })
}

// 订货组搜索分页
export function dhSearch (data) {
  return request({
    url: '/order/dhSearch',
    method: 'post',
    data
  })
}

// 进货组、价格组搜索分页
export function jhjgSearch (data) {
  return request({
    url: '/order/jhjgSearch',
    method: 'post',
    data
  })
}

// 综合搜索
export function overallSearch (data) {
  return request({
    url: '/order/overallSearch',
    method: 'post',
    data
  })
}
