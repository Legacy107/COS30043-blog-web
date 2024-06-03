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
      Cookies.set('user', JSON.stringify(user))
    },
    logout() {
      this.user = null
      Cookies.remove('token')
      Cookies.remove('user')
    },
    async fetchFollowing() {
      try {
        if (!this.user) return
        const { data } = await axios.get(`/user/${this.user?.id}/following`)
        this.followingUsers = data
      } catch (error) {
        console.error(error)
      }
    },
    async followUser(user: User) {
      try {
        if (!this.user) return
        await axios.post(`/user/${user.id}/follow`)
        this.followingUsers.push(user)
      } catch (error) {
        console.error(error)
      }
    },
    async unfollowUser(user: User) {
      try {
        if (!this.user) return
        await axios.delete(`/user/${user.id}/follow`)
        this.followingUsers = this.followingUsers.filter(
          (u) => u.id !== user.id,
        )
      } catch (error) {
        console.error(error)
      }
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
