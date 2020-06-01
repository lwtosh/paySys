export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    info: '',
    endTime: '',
    startTime: '',
    endTime2: '',
    startTime2: ''
  },
  mutations: {
    accessPlatformId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateInfo (state, info) {
      state.info = info
    },
    updateendTimeStr (state, endTime) {
      state.endTime = endTime
    },
    updatestartTimeStr (state, startTime) {
      state.startTime = startTime
    },
    updateendTimeStr2 (state, endTime2) {
      state.endTime2 = endTime2
    },
    updatestartTimeStr2 (state, startTime2) {
      state.startTime2 = startTime2
    }
  }
}
