import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { User } from '@/@types/user'
import axios from '@/utils/axios'

export const useAppStore = defineStore('app', {
  state: () => {
    const userString = Cookies.get('user')
    const user = userString && JSON.parse(userString)
    return {
      user,
      followingUsers: [],
    } as {
      user: User | null
      followingUsers: User[]
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
    async fetchFollowing() {
      if (!this.user) return
      const { data } = await axios.get(`/user/${this.user?.id}/following`)
      this.followingUsers = data
    },
    async followUser(user: User) {
      if (!this.user) return
      await axios.post(`/user/${user.id}/follow`)
      this.followingUsers.push(user)
    },
    async unfollowUser(user: User) {
      if (!this.user) return
      await axios.delete(`/user/${user.id}/follow`)
      this.followingUsers = this.followingUsers.filter((u) => u.id !== user.id)
    },
    isFollowing(user: User) {
      return this.followingUsers.some((u) => u.id === user.id)
    },
  },
  getters: {
    authenticated(state) {
      return !!state.user
    },
  },
})
