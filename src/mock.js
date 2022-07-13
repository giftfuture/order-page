import Mock from 'mockjs'

const Random = Mock.Random

// 登录
Mock.mock('/login', 'post', (option) => {
  let { loginName, passwd } = JSON.parse(option.body)
  return (loginName === 'staff' && passwd === 'staff')
})
Mock.mock('/sysback/login', 'post', (option) => {
  let { loginName, passwd } = JSON.parse(option.body)
  return (loginName === 'admin' && passwd === 'admin')
})
// // 用户数据
const userData = () => {
  let users = []
  for (let i = 0; i < 10; i++) {
    let user = {
      'id': i + 1,
      'date': Random.date('yyyy-MM-dd'),
      'name': Random.cname(),
      'address': Mock.mock('@county(true)'),
      'phone': Mock.mock(/^1[0-9]{10}$/),
      'status': Random.integer(0, 1)
    }
    users.push(user)
  }
  return users
}
Mock.mock('/staff', userData)

// 文章数据
const articleData = () => {
  let articles = []
  for (let i = 0; i < 20; i++) {
    let article = {
      'id': i + 1,
      'date': Random.date('yyyy-MM-dd'),
      'title': Random.csentence(),
      'author': Random.cname(),
      'content': Random.csentence(),
      'status': Random.integer(0, 1)
    }
    articles.push(article)
  }
  return articles
}
Mock.mock('/operlog', articleData)
