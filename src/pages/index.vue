<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12" sm="8">
        <v-row>
          <v-col cols="12">
            <FilterPost
              v-model:selectedTopics="selectedTopics"
              v-model:sortBy="sortBy"
              v-model:filterBy="filterBy"
            />
          </v-col>
          <v-infinite-scroll
            :key="sortBy + selectedTopics + filterBy"
            height="100%"
            width="100%"
            :items="posts"
            :onLoad="fetchPosts"
          >
            <template v-for="post in posts" :key="post.id">
              <v-col cols="12">
                <PostCard
                  :post="post"
                  :avatarUrl="post.author.avatar ?? ''"
                  :author="post.author.firstname + ' ' + post.author.lastname"
                  :authorId="post.author.id"
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
      sortBy: 'Newest',
      selectedTopics: [],
      filterBy: 'All',
    } as {
      posts: Array<Post & { author: User }>
      offset: number
      limit: number
      sortBy: string
      selectedTopics: Array<string>
      filterBy: string
    }
  },
  methods: {
    async fetchPosts({ done }: { done: (status: any) => void }) {
      try {
        const { data } = await axios.get('/post', {
          params: {
            offset: this.offset,
            limit: this.limit,
            following: this.filterBy === 'Following',
            sort: this.sortBy,
            ...(this.selectedTopics.length
              ? { topics: this.selectedTopics.join(',') }
              : {}),
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
  },
  watch: {
    selectedTopics: {
      handler() {
        this.offset = 0
        this.posts = []
      },
      deep: true,
    },
    sortBy() {
      this.offset = 0
      this.posts = []
    },
    filterBy() {
      this.offset = 0
      this.posts = []
    },
  },
  mounted() {
    const topics = this.$route.query.topics
    if (typeof topics === 'string')
      this.selectedTopics = topics ? topics.split(',') : []
  },
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style>
