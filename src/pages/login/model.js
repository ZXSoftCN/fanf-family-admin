import { routerRedux } from 'dva/router'
import { login } from './service'

export default {
  namespace: 'login',

  state: {
    eyeOpen:false,
  },
  reducers:{
    switchEyeOpen (state){
      return {
        ...state,
        eyeOpen: !state.eyeOpen,
      }
    },
  },
  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      const rep = yield call(login, payload)
      // if (data.data.token) {
      //   sessionStorage.setItem('token', data.data.token)
      // }
      const { locationQuery } = yield select(_ => _.app)
      // const logState = yield select(_ => _.login)
      // let {eyeOpen} = logState
      if (rep.success) {
        const { from } = locationQuery

        // const { data } = rep
        yield put({ type: 'app/query' ,payload: {userName:rep.userName}})
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw rep
      }
    },
  },

}
