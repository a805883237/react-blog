// 用户登录部分 ，存储用户登录状态
import axios from '@/utils/axios'
import jwtDecode from 'jwt-decode'

// initial state
const state = {
  userId: 0,
  username: '',
  auth: 0,
  email: '',
  avatarColor: '#52c41a' // 用户头像颜色
}

// getters
const getters = {}

// actions
const actions = {
  login ( { commit }, params ) {
    axios.post('/login', params).then(res => {
      console.log("baba3456789012312312312",res);
      if (res.code === 200) {
        localStorage.setItem('token', res.token);
        commit("USER_LOGIN" ,{ token: res.token })
        // dispatch({ type: constants.USER_LOGIN, payload: { token: res.token } })
      } else {
        $message.error(res.message)
      }
      return res
    })
  },
  loginout ( { commit } ) {
    commit("USER_LOGINOUT")
  }
};

// mutations
const mutations = {
  USER_LOGIN (state, response) {
    const { userId, username, auth, email } = jwtDecode(response.token)
    state =  { ...state, userId, username, auth, email }
  },

  USER_LOGINOUT (state) {
    state = { userId: 0, username: '', auth: 0, avatarColor: '#52c41a', email: '' }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
