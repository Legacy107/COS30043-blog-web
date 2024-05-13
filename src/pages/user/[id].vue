<template>
  <v-container class="my-20 mt-4" :key="`user-${id}`">
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
        class="d-flex justify-center mb-4 pe-md-6"
      >
        <ProfileAbout
          v-if="user && following"
          :userProfile="user"
          :followers="user.followers"
          :following="following"
        />
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-row class="flex-column align-center">
          <div class="post-title text-h4 font-weight-bold mb-2 ps-3 px-md-1">
            Posts
          </div>
          <v-infinite-scroll
            v-if="user"
            height="100%"
            :items="posts"
            :onLoad="fetchPosts"
          >
            <template v-for="post in posts" :key="post.id">
              <v-col cols="12">
                <PostCard
                  :post="post"
                  :avatarUrl="user.avatar ?? ''"
                  :author="user.firstname + ' ' + user.lastname"
                  :authorId="user.id"
                />
              </v-col>
            </template>
          </v-infinite-scroll>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import PostCard from '@/components/PostCard.vue'
import ProfileAbout from '@/components/ProfileAbout.vue'
import axios from '@/utils/axios'
import { User } from '@/@types/user'
import { Post } from '@/@types/post'

export default {
  name: 'Profile',
  components: {
    PostCard,
    ProfileAbout,
  },
  data() {
    return {
      user: null,
      following: [],
      offset: 0,
      limit: 10,
      posts: [],
    } as {
      user: null | User
      following: User[]
      offset: number
      limit: number
      posts: Post[]
    }
  },
  methods: {
    async fetchPosts({ done }: { done: (status: any) => void }) {
      try {
        const { data } = await axios.get('/post', {
          params: {
            offset: this.offset,
            limit: this.limit,
            userId: this.id,
          },
        })
        if (data.length === 0) return done('empty')

        this.posts = [...this.posts, ...data]
        this.offset += data.length
        done('ok')
      } catch (error) {
        done('error')
      }
    },
    async fetchUser(id: number) {
      const { data } = await axios.get(`/user/${id}`)
      this.user = data
    },
    async fetchFollowing(id: number) {
      const { data } = await axios.get(`/user/${id}/following`)
      this.following = data
    },
    async fetchData(id: number) {
      this.fetchUser(id)
      this.fetchFollowing(id)
    },
  },
  computed: {
    id() {
      const { id } = this.$route.params as unknown as { id: string }
      return parseInt(id ?? '0')
    },
  },
  mounted() {
    this.fetchData(this.id)
  },
  watch: {
    id(newId) {
      this.posts = []
      this.offset = 0
      this.fetchData(newId)
    },
  },
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
.post-title {
  width: 100%;
  max-width: 720px;
}
</style>
