<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card class="py-2">
          <v-card-title class="mb-4">
            <span class="text-h4">Edit Post</span>
          </v-card-title>
          <v-card-text v-if="title">
            <PostForm
              v-model:title="title"
              v-model:description="description"
              v-model:content="content"
              v-model:image="image"
              v-model:selectedTopics="selectedTopics"
              @submit="submit"
              buttonText="Save"
            />
            <v-alert
              v-if="errorMessage"
              type="error"
              dismissible
              border="start"
            >
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from '@/utils/axios'
import PostForm from '@/components/PostForm.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { Topic } from '@/@types/topic'

export default {
  components: {
    PostForm,
  },
  data() {
    return {
      selectedTopics: [],
      title: '',
      content: '',
      description: '',
      image: [],
      errorMessage: '',
      loading: false,
    }
  },
  computed: {
    id() {
      const { id } = this.$route.params as unknown as { id: string }
      return id ?? ''
    },
    ...mapState(useAppStore, ['user']),
  },
  methods: {
    async fetchPost() {
      try {
        const { data } = await axios.get(`/post/${this.id}`)
        if (data.author.id !== this.user?.id) {
          this.$router.push('/')
          return
        }
        this.title = data.title
        this.description = data.description
        this.content = data.content
        this.selectedTopics = data.topics.map((topic: Topic) => topic.id)
      } catch (error: any) {
        this.errorMessage = error.response.data.message
      }
    },
    async submit() {
      try {
        const formData = new FormData()
        formData.append('title', this.title)
        formData.append('description', this.description)
        formData.append('content', this.content)
        formData.append('topics', this.selectedTopics.join(','))
        if (this.image.length > 0) {
          formData.append('image', this.image[0])
        }

        await axios.put(`/post/${this.id}`, formData)
        this.$router.push(`/post/${this.id}`)
      } catch (error: any) {
        this.errorMessage = error.response.data.message
      }
    },
  },
  async mounted() {
    await this.fetchPost()
  },
}
</script>

<style scoped>
.v-input--error {
  margin-bottom: 0.4rem;
}
</style>

<style>
.markdown-body input[type='text'] {
  color: #24292e;
}
</style>
