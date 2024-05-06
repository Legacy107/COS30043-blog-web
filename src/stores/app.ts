import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { User } from '../@types/user'

export const useAppStore = defineStore('app', {
  state: () => {
    const userString = Cookies.get('user')
    const user = userString && JSON.parse(userString)
    return {
      user,
    } as {
      user: User | null
    }
  },
  actions: {
    setUser(user: User) {
      this.user = user
    },
    logout() {
      this.user = null
      Cookies.remove('token')
      Cookies.remove('user')
    },
  },
  getters: {
    authenticated(state) {
      return !!state.user
    },
  },
})
