<template>
  <div class="w-100 mb-8">
    <div>
      <div class="text-h5 mb-2 font-weight-bold">Trending Posts</div>
      <v-list
        lines="two"
        density="comfortable"
        bg-color="transparent"
        aria-label="Trending Posts"
      >
        <v-list-item v-for="post in trendingPosts" :key="post.id" class="ps-0">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <router-link
                :to="`/user/${post.author.id}`"
                v-bind="props"
                class="text-decoration-none"
                :class="
                  'text-white ' +
                  (isHovering
                    ? 'text-decoration-underline'
                    : 'text-decoration-none')
                "
              >
                <div class="d-flex ga-2 align-center">
                  <v-avatar size="20" color="primary">
                    <v-img
                      v-if="post.author.avatar"
                      :src="post.author.avatar"
                      :alt="post.author.firstname"
                    />
                    <span v-else class="text-subtitle-2">
                      {{ post.author.firstname?.[0] }}
                    </span>
                  </v-avatar>

                  <span class="text-subtitle-2">
                    {{ post.author.firstname }} {{ post.author.lastname }}
                  </span>
                </div>
              </router-link>
            </template>
          </v-hover>

          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <router-link
                :to="`/post/${post.id}`"
                v-bind="props"
                class="text-decoration-none"
                :class="
                  'text-white ' +
                  (isHovering
                    ? 'text-decoration-underline'
                    : 'text-decoration-none')
                "
                aria-label="View post"
              >
                <div class="mt-1 text-h7 font-weight-black">
                  {{ post.title }}
                </div>
              </router-link>
            </template>
          </v-hover>
        </v-list-item>
      </v-list>
    </div>
  </div>

  <div class="d-flex w-100 flex-column ga-8 sticky-top">
    <div v-if="authenticated">
      <div class="text-h5 mb-2 font-weight-bold">Recommended Topics</div>
      <v-chip-group column>
        <v-chip
          v-for="topic in recommendedTopics"
          :key="topic.id"
          color="primary"
          size="large"
          :href="`/?topics=${topic.name}`"
        >
          {{ topic.name }}
        </v-chip>
      </v-chip-group>
    </div>

    <div v-if="authenticated">
      <div class="text-h5 mb-2 font-weight-bold">Recommended Authors</div>
      <v-list
        density="compact"
        bg-color="transparent"
        slim
        lines="three"
        aria-label="Recommended Authors"
      >
        <v-list-item
          v-for="recommendedUser in recommendedAuthors"
          :key="recommendedUser.id"
          :prepend-avatar="recommendedUser.avatar"
          :class="
            'text-white ps-0' + (!recommendedUser.bio?.length ? ' no-bio' : '')
          "
          height="48"
        >
          <template v-slot:prepend>
            <router-link
              :to="`/user/${recommendedUser.id}`"
              class="text-decoration-none"
            >
              <v-avatar size="32" color="primary" class="me-3">
                <v-img
                  v-if="recommendedUser.avatar"
                  :src="recommendedUser.avatar"
                  :alt="recommendedUser.firstname"
                />
                <span v-else class="text-h6">
                  {{ recommendedUser.firstname?.[0] }}
                </span>
              </v-avatar>
            </router-link>
          </template>

          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <router-link
                v-bind="props"
                :to="`/user/${recommendedUser.id}`"
                class="text-white text-decoration-none"
              >
                <div
                  :class="
                    'font-weight-bold ' +
                    (isHovering
                      ? 'text-decoration-underline'
                      : 'text-decoration-none')
                  "
                >
                  {{ recommendedUser.firstname }} {{ recommendedUser.lastname }}
                </div>
                <div class="clip-bio text-caption text-grey-lighten-2">
                  {{ recommendedUser.bio }}
                </div>
              </router-link>
            </template>
          </v-hover>

          <template v-slot:append>
            <template v-if="user && recommendedUser.id !== user.id">
              <v-btn
                v-if="isFollowing(recommendedUser)"
                color="primary"
                size="small"
                class="align-self-center"
                @click="() => unfollowUser(recommendedUser)"
                aria-label="Unfollow"
              >
                <span class="d-none d-md-block">Following</span>
                <v-icon class="d-md-none">mdi-account-check</v-icon>
              </v-btn>
              <v-btn
                v-else
                color="primary"
                variant="outlined"
                size="small"
                class="align-self-center"
                @click="() => followUser(recommendedUser)"
                aria-label="Follow"
              >
                <span class="d-none d-md-block">Follow</span>
                <v-icon class="d-md-none">mdi-account-plus</v-icon>
              </v-btn>
            </template>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { useAppStore } from '../stores/app'
import { mapState, mapActions } from 'pinia'
import axios from '@/utils/axios'
import { User } from '@/@types/user'
import { Post } from '@/@types/post'
import { Topic } from '@/@types/topic'

export default {
  data: () =>
    ({
      trendingPosts: [],
      recommendedTopics: [],
      recommendedAuthors: [],
    }) as {
      trendingPosts: Array<Post & { author: User }>
      recommendedTopics: Topic[]
      recommendedAuthors: User[]
    },
  computed: {
    ...mapState(useAppStore, ['user', 'authenticated', 'followingUsers']),
  },
  methods: {
    async fetchTrendingPosts() {
      try {
        const { data } = await axios.get('/recommendation/posts')
        this.trendingPosts = data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchRecommendedTopics() {
      try {
        if (!this.authenticated) return
        const { data } = await axios.get('/recommendation/topics')
        this.recommendedTopics = data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchRecommendedAuthors() {
      try {
        if (!this.authenticated) return
        const { data } = await axios.get('/recommendation/users')
        this.recommendedAuthors = data
      } catch (error) {
        console.error(error)
      }
    },
    ...mapActions(useAppStore, [
      'fetchFollowing',
      'followUser',
      'unfollowUser',
      'isFollowing',
    ]),
  },
  mounted() {
    this.fetchTrendingPosts()
    this.fetchRecommendedTopics()
    this.fetchRecommendedAuthors()
    this.fetchFollowing()
  },
}
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 2rem;
}

.v-list {
  padding-bottom: 0;
}

:deep(.v-slide-group__content) {
  row-gap: 0.2rem !important;
}

.clip-bio {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px !important;
}

.no-bio {
  min-height: 60px !important;
}

:deep(.v-list-item--three-line .v-list-item__append) {
  align-self: center;
  padding-left: 0.75rem;
}
</style>
