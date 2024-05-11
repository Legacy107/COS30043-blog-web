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
            <span class="text-body-1 font-weight-medium">
              {{ post.author.firstname }} {{ post.author.lastname }}
            </span>
            <span class="text-caption">{{ formatDate(post.createAt) }}</span>
          </div>
          <v-btn class="ms-auto" variant="tonal">Follow</v-btn>
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
          />
          <v-divider />
        </div>
      </v-col>
      <v-col cols="12">
        <Markdown :breaks="true" :source="post.content" />
      </v-col>
      <v-col cols="12" class="mt-6">
        <div class="text-h6 mb-1 font-weight-bold">Topics</div>
        <v-chip-group column>
          <v-chip
            v-for="(topic, i) in post.topics"
            :key="i"
            class="ma-1"
            color="primary"
          >
            {{ topic }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12">
        <PostAction
          :id="id"
          :noLikes="post.likes"
          :noComments="post.comments"
          :author="post.author.firstname + ' ' + post.author.lastname"
          :onOpenComments="handleOpenComments"
        />
      </v-col>

      <v-col cols="12">
        <v-expand-transition>
          <CommentSection v-show="openComments" />
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
import { useDate } from 'vuetify'

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
      post: null,
    } as {
      openComments: boolean
      post: null | (Post & { author: User } & { topics: string[] })
    }
  },
  methods: {
    handleOpenComments() {
      this.openComments = !this.openComments
    },
    formatDate(dateString: string) {
      const date = useDate()
      return date.format(dateString, 'fullDate')
    },
  },
  computed: {
    id() {
      const { id } = this.$route.params as unknown as { id: string }
      return parseInt(id ?? '0')
    },
  },
  async mounted() {
    const { id } = this.$route.params as unknown as { id: string }
    const { data } = await axios.get(`/post/${id}`)
    this.post = data
  },
}
</script>

<style scoped>
.v-container {
  max-width: 680px;
}
</style>
