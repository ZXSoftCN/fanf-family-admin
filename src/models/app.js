/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: [],
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' }) //屏蔽了系统刚进入时执行*query动作
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      const localApp = yield select(_ => _.app)
      const {locationPathname} = localApp
      if (locationPathname === '/'){
        yield put(routerRedux.push({
          pathname: '/login',
          // search: queryString.stringify({
          //   from: locationPathname,
          // }),
        }))
      } else{
      try {
        const {user : item} = localApp//特别注意：此处直接用user变量取值，会于第84行中的user冲突发生异常。属于同一代码块下的重复变量命名
        const userName = localStorage.getItem('userName')
        const params = {
          userName: userName,//item.userName,
          ...payload,
        }
      const { success, user } = yield call(query, params)
      if (success && user) {
        localStorage.setItem('userName', user.userName)// 登记当前用户名
        const rlt = yield call(menusService.query)
        const{ list } = rlt
        let { permissions } = user
        let menu = list
        console.log(list)
        permissions = list.map(item => {
          const itemPer = {
            id: item.id,
          }
          return itemPer
        })
        // if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
        //   permissions.visit = list.map(item => item.id)
        // } else {
        //   menu = list.filter((item) => {
        //     const cases = [
        //       permissions.visit.includes(item.id),
        //       item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
        //       item.bpid ? permissions.visit.includes(item.bpid) : true,
        //     ]
        //     return cases.every(_ => _)
        //   })
        // }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/dashboard',
          }))
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    }catch(e) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
    }}},

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        localStorage.removeItem('userName')
        yield put({ type: 'updateState', payload: {
          user: {},
          permissions: [],
          menu: [{
              id: 1,
              iconType: 'laptop',
              name: 'Dashboard',
              pathKey: '/dashboard',
            }],
        }})
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
