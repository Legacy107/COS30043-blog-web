<template>
  <v-container class="my-10">
    <v-row v-if="post">
      <v-col cols="12">
        <div class="text-h3 font-weight-bold">{{ post.title }}</div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-avatar class="ms-0 ma-3" size="48" color="primary">
            <v-img
              v-if="post.author.avatar"
              :src="post.author.avatar"
              :alt="post.author.firstname"
            />
            <span v-else class="text-body">
              {{ post.author.firstname?.[0] }}
            </span>
          </v-avatar>
          <div class="d-flex flex-column">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <router-link
                  :to="`/user/${post.author.id}`"
                  class="text-white text-decoration-none"
                >
                  <span
                    v-bind="props"
                    :class="
                      'text-body-1 font-weight-medium ' +
                      (isHovering
                        ? 'text-decoration-underline'
                        : 'text-decoration-none')
                    "
                  >
                    {{ post.author.firstname }} {{ post.author.lastname }}
                  </span>
                </router-link>
              </template>
            </v-hover>
            <span class="text-caption">{{ formatDate(post.createAt) }}</span>
          </div>
          <v-btn
            v-if="user && user.id !== post.author.id"
            class="ms-auto"
            color="primary"
            :variant="followButtonVariant"
            @click="handleFollow"
          >
            {{ followText }}
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex flex-column ga-1">
          <v-divider />
          <PostAction
            :id="id"
            :noLikes="post.likes"
            :noComments="post.comments"
            :author="post.author.firstname + ' ' + post.author.lastname"
            :title="post.title"
            :onOpenComments="
              () => {
                handleOpenComments()
                scrollToComments()
              }
            "
            :isLiked="isLiked"
            :onLike="handleLike"
          />
          <v-divider />
        </div>
      </v-col>
      <v-col cols="12">
        <Markdown :breaks="true" :source="post.content" :html="true" />
      </v-col>
      <v-col cols="12" class="mt-6">
        <div class="text-h6 mb-1 font-weight-bold">Topics</div>
        <v-chip-group column>
          <v-chip
            v-for="topic in post.topics"
            :key="'topic' + topic.id"
            class="ma-1"
            color="primary"
            :href="`/?topics=${topic.name}`"
          >
            {{ topic.name }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12">
        <PostAction
          :id="id"
          :noLikes="post.likes"
          :noComments="post.comments"
          :author="post.author.firstname + ' ' + post.author.lastname"
          :title="post.title"
          :onOpenComments="handleOpenComments"
          :isLiked="isLiked"
          :onLike="handleLike"
        />
      </v-col>

      <v-col cols="12" ref="comments">
        <v-expand-transition>
          <CommentSection v-show="openComments" :postId="post.id" />
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Markdown from 'vue3-markdown-it'
import CommentSection from '@/components/CommentSection.vue'
import PostAction from '@/components/PostAction.vue'
import axios from '@/utils/axios'
import { Post } from '@/@types/post'
import { User } from '@/@types/user'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import { Topic } from '@/@types/topic'
import { formatDate } from '@/utils/date'

export default {
  name: 'Post',
  components: {
    Markdown,
    CommentSection,
    PostAction,
  },
  data() {
    return {
      openComments: false,
      isLiked: false,
      isFollowing: false,
      post: null,
    } as {
      openComments: boolean
      isLiked: boolean
      isFollowing: boolean
      post: null | (Post & { author: User } & { topics: Topic[] })
    }
  },
  methods: {
    handleOpenComments() {
      this.openComments = !this.openComments
    },
    scrollToComments() {
      const comments = (this.$refs.comments as any).$el as HTMLElement
      comments.scrollIntoView({ behavior: 'smooth', block: 'end' })
    },
    formatDate(dateString: string) {
      return formatDate(dateString)
    },
    async likePost() {
      try {
        await axios.post(`/post/${this.id}/like`)
        this.isLiked = true
        if (this.post) {
          this.post.likes++
        }
      } catch (error) {
        console.error(error)
      }
    },
    async unlikePost() {
      try {
        await axios.delete(`/post/${this.id}/like`)
        if (this.post) {
          this.post.likes--
        }
        this.isLiked = false
      } catch (error) {
        console.error(error)
      }
    },
    handleLike() {
      if (this.isLiked) {
        this.unlikePost()
      } else {
        this.likePost()
      }
    },
    async fetchLikeStatus() {
      try {
        const { data } = await axios.get(`/post/${this.id}/like`)
        this.isLiked = data.like
      } catch (error) {
        console.error(error)
      }
    },
    async fetchFollowing() {
      if (!this.user) return
      const { data } = await axios.get(`/user/${this.user?.id}/following`)
      if (data.some((u: User) => u.id === this.post?.author.id)) {
        this.isFollowing = true
      }
    },
    async followUser() {
      if (!this.post?.author) return
      await axios.post(`/user/${this.post.author.id}/follow`)
      this.isFollowing = true
    },
    async unfollowUser() {
      if (!this.post?.author) return
      await axios.delete(`/user/${this.post.author.id}/follow`)
      this.isFollowing = false
    },
    handleFollow() {
      if (this.isFollowing) {
        this.unfollowUser()
      } else {
        this.followUser()
      }
    },
  },
  computed: {
    id() {
      const { id } = this.$route.params as unknown as { id: string }
      return parseInt(id ?? '0')
    },
    followText() {
      return this.isFollowing ? 'Following' : 'Follow'
    },
    followButtonVariant() {
      return this.isFollowing ? 'elevated' : 'outlined'
    },
    ...mapState(useAppStore, ['user']),
  },
  async mounted() {
    const { id } = this.$route.params as unknown as { id: string }
    const { data } = await axios.get(`/post/${id}`)
    this.post = data

    this.fetchFollowing()
    this.fetchLikeStatus()
  },
}
</script>

<style scoped>
.v-container {
  max-width: 680px;
}
</style>
