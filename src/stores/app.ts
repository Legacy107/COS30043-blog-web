import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { User } from '../@types/user'

export const useAppStore = defineStore('app', {
  state: () => {
    const user = JSON.parse(Cookies.get('user') || '{}') ?? null
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
  },
  getters: {
    authenticated(state) {
      return !!state.user
    },
  },
})
