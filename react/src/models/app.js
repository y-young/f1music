import { routerRedux } from 'dva/router'
import { checkLogin } from 'services/app'

export default {
  namespace: 'app',
  state: {
    siderFolded: false,
    darkTheme: false,
    isDesktop: window.innerWidth > 993,
    navOpenKeys: [],
    loggedIn: checkLogin()
  },

  subscriptions: {
    setup ({ dispatch, history }) {
//alert(checkLogin())
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'mobileCollapse' })
        }, 300)
      }
      history.listen(({ pathname }) => {
        window.scrollTo(0, 0)
        dispatch({ type: 'mobileCollapse' })
      })
    },
  },

  effects: {
    * logout ({
      payload,
    }, { call, put }) {
      /*const data = yield call(logout, parse(payload))
      if (data.error == 0) {*/
        yield put({ type: 'updateState', payload: {
          loggedIn: false,
        }})
      /*} else {
        throw (data)
      }*/
    },

    * mobileCollapse (action, { call, put }) {
      const isDesktop = window.innerWidth > 993
      yield put({ type: 'updateState', payload: {
          siderFolded: !isDesktop
      }})
    },
  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    toggleSider (state) {
      return {
        ...state,
        siderFolded: !state.siderFolded,
      }
    },

    switchTheme (state) {
      return {
        ...state,
        darkTheme: !state.darkTheme,
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

