import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

// const { sideTheme, showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings
const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo } = defaultSettings
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
  theme: storageSetting.theme || variables.theme,
  sideTheme: storageSetting.sideTheme || sideTheme,
  showSettings: showSettings,
  topNav:  storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  isRouterAlive:true

}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_ISROUTERALIVE_TRUE: (state) => {
    state.isRouterAlive = false
    setTimeout(()=> {
      state.isRouterAlive = true
    },10)
},
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  SET_ISROUTERALIVE_TRUE({ commit }) {
    commit('SET_ISROUTERALIVE_TRUE')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

