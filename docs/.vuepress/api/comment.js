// 用户评论
import request from '../utils/request'

// 获取评论列表
export function getCommentsList(params) {
  return request({
    url: '/comments',
    method: 'GET',
    headers: {"Content-Type": "application/json"},
    params: {
      ...params
    }
  })
}
// 用户发布一条留言
export function publishAComment(data) {
  return request({
    url: '/comments',
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    data
  })
}