const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const APIFanf = '/api/fanf'

module.exports = {
  name: '泛泛家园',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin  © 2018 zuiidea',
  logo: '/public/logo.svg',
  iconFontCSS: '/public/iconfont.css',
  iconFontJS: '/public/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIFanf}/user/login`,
    // userLogin: 'http://localhost:8081/login',
    userLogout: `${APIFanf}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIFanf}/user/userPermission`,
    // user: `${APIV1}/user/:id`,
    dashboard: `${APIFanf}/dashboard`,
    menus: `${APIFanf}/menu/queryTopMenuAllTree`,
    // menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIFanf}/test`,
    v2test: `${APIV2}/test`,
  },
}
