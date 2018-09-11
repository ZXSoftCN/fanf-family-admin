/* global window */
import modelExtend from 'dva-model-extend'
import { config } from '../../../../utils/index'
import * as userService from './services/user'
import { pageModel } from '../../../../utils/model'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    eyeOpen:true,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/set/system/user') {
          const payload = {page:0,size:10,...location.query}
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(userService.queryParams, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
            pagination: {
              current: Number(data.currentPage) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.totalCount,
            },
          },
        })
      }
    },

    * queryCurrent ({payload = {}}, {call, put}) {
      const data = yield call(userService.query,payload)
      if (data) {
        // const item = {currtenItem: data}
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data,
          },
        })

        // yield put({
        //   type: 'showModal',
        //   payload: {
        //     currentItem: data,
        //     modalType: 'update',
        //   },
        // })
      }
    },


    * delete ({ payload }, { call, put, select }) {
      const data = yield call(userService.remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(userService.removeBatch, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(userService.create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(userService.update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

    switchEyeOpen (state){
      return{
        ...state,
        eyeOpen: !state.eyeOpen,
      }
    },

    initialEyeOpen (state){
      return{
        ...state,
        eyeOpen: true,
      }
    },

  },
})
