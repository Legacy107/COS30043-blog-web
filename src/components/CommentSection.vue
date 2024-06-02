<template>
  <div>
    <v-form @submit.prevent="onSubmitComment">
      <div class="text-h6">Comments</div>
      <v-textarea
        v-model="newComment"
        label="Enter your comment"
        class="mt-6"
        variant="outlined"
        rows="4"
        counter="300"
        :rules="commentRules"
        validate-on="submit"
      />
      <v-btn color="primary" class="mb-6" type="submit" :loading="loading">
        Submit
      </v-btn>
    </v-form>
    <v-select
      v-model="selectedSort"
      :items="sortOptions"
      label="Sort by"
      class="mb-3"
      variant="plain"
    />
    <v-card v-for="comment in comments" :key="comment.id" class="mb-4">
      <v-card-text>
        <div class="d-flex align-center">
          <v-avatar size="32" color="primary">
            <v-img
              v-if="comment.user.avatar"
              :src="comment.user.avatar"
              :alt="comment.user.firstname"
            />
            <span v-else class="text-body">
              {{ comment.user.firstname?.[0] }}
            </span>
          </v-avatar>
          <div class="ml-2 d-flex flex-column justify-content-between">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <router-link
                  :to="`/user/${comment.user.id}`"
                  class="text-white text-decoration-none"
                >
                  <span
                    v-bind="props"
                    :class="
                      'font-weight-bold ' +
                      (isHovering
                        ? 'text-decoration-underline'
                        : 'text-decoration-none')
                    "
                  >
                    {{ comment.user.firstname }} {{ comment.user.lastname }}
                  </span>
                </router-link>
              </template>
            </v-hover>
            <span class="text-caption">{{ formatDate(comment.createAt) }}</span>
          </div>
        </div>
        <div class="mt-4 ps-1">{{ comment.content }}</div>
        <div v-if="authenticated" class="d-flex mt-4 comment-action">
          <v-btn
            variant="plain"
            :prepend-icon="comment.liked ? 'mdi-heart' : 'mdi-heart-outline'"
            class="px-0"
            @click="() => handleLikeComment(comment)"
          >
            {{ comment.likes }}
            <v-tooltip activator="parent" location="bottom">
              {{ comment.liked ? 'Unlike' : 'Like' }}
            </v-tooltip>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import { Comment } from '@/@types/comment'
import { User } from '@/@types/user'
import { formatDate } from '@/utils/date'

export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newComment: '',
      sortOptions: ['Newest', 'Oldest', 'Most liked'],
      selectedSort: 'Newest',
      comments: [],
      commentRules: [
        (v: string) => !!v || 'Comment is required',
        (v: string) =>
          v.length <= 300 ||
          'Comment must be less than or equal 300 characters',
      ],
      errorMessage: '',
      loading: false,
    } as {
      newComment: string
      sortOptions: Array<string>
      selectedSort: string
      comments: Array<Comment & { user: User }>
      commentRules: Array<(v: string) => boolean | string>
      errorMessage: string
      loading: boolean
    }
  },
  computed: {
    ...mapState(useAppStore, ['authenticated']),
  },
  methods: {
    async fetchComments() {
      try {
        const { data } = await axios.get(
          `/post/${this.postId}/comments?sort=${this.selectedSort}`,
        )
        this.comments = data
      } catch (error) {
        console.error(error)
      }
    },
    async onSubmitComment(event: any) {
      try {
        this.loading = true
        const validation = await event
        if (!validation.valid) return

        await axios.post(`/post/${this.postId}/comment`, {
          content: this.newComment,
        })
        this.newComment = ''
        await this.fetchComments()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    formatDate,
    async likeComment(commentId: number) {
      try {
        await axios.post(`/comment/${commentId}/like`)
        const comment = this.comments.find((c) => c.id === commentId)
        if (comment) {
          comment.likes++
          comment.liked = true
        }
      } catch (error) {
        console.error(error)
      }
    },
    async unlikeComment(commentId: number) {
      try {
        await axios.delete(`/comment/${commentId}/like`)
        const comment = this.comments.find((c) => c.id === commentId)
        if (comment) {
          comment.likes--
          comment.liked = false
        }
      } catch (error) {
        console.error(error)
      }
    },
    handleLikeComment(comment: Comment) {
      if (comment?.liked) {
        this.unlikeComment(comment.id)
      } else {
        this.likeComment(comment.id)
      }
    },
  },
  mounted() {
    this.fetchComments()
  },
  watch: {
    selectedSort() {
      this.fetchComments()
    },
  },
}
</script>

<style scoped>
.v-select {
  width: 120px;
}
.comment-action {
  margin-left: -10px;
}
.v-input--error {
  margin-bottom: 1rem;
}
</style>
