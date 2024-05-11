<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12" sm="8">
        <v-row>
          <v-col cols="12">
            <FilterPost />
          </v-col>
          <v-infinite-scroll
            height="100%"
            width="100%"
            :items="posts"
            :onLoad="fetchPosts"
          >
            <template v-for="post in posts" :key="post.id">
              <v-col cols="12">
                <PostCard
                  :id="post.id"
                  :avatarUrl="post.author.avatar ?? ''"
                  :author="post.author.firstname + ' ' + post.author.lastname"
                  :title="post.title"
                  :description="post.description"
                  :date="formatDate(post.createAt)"
                  :imageUrl="post.image ?? ''"
                />
              </v-col>
            </template>
          </v-infinite-scroll>
        </v-row>
      </v-col>
      <v-col cols="0" sm="4">
        <RecommendationSidebar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from '@/utils/axios'
import PostCard from '@/components/PostCard.vue'
import RecommendationSidebar from '@/components/RecommendationSidebar.vue'
import FilterPost from '@/components/FilterPost.vue'
import { Post } from '@/@types/post'
import { User } from '@/@types/user'
import { useDate } from 'vuetify'

export default {
  name: 'Home',
  components: {
    PostCard,
    RecommendationSidebar,
    FilterPost,
  },
  data() {
    return {
      posts: [],
      offset: 0,
      limit: 10,
    } as {
      posts: Array<Post & { author: User }>
      offset: number
      limit: number
    }
  },
  methods: {
    async fetchPosts({ done }: { done: (status: any) => void }) {
      try {
        const { data } = await axios.get('/post', {
          params: {
            offset: this.offset,
            limit: this.limit,
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
    formatDate(dateString: string) {
      const date = useDate()
      return date.format(dateString, 'fullDate')
    },
  },
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style>
