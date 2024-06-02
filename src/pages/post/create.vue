<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card class="py-2">
          <v-card-title class="mb-4">
            <span class="text-h4">Create Post</span>
          </v-card-title>
          <v-card-text>
            <PostForm
              v-model:title="title"
              v-model:description="description"
              v-model:content="content"
              v-model:image="image"
              v-model:selectedTopics="selectedTopics"
              @submit="submit"
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

export default {
  components: {
    PostForm,
  },
  data() {
    return {
      selectedTopics: [],
      title: '',
      content: '# Hello World!',
      description: '',
      image: [],
      errorMessage: '',
    }
  },
  methods: {
    async submit() {
      try {
        const formData = new FormData()
        formData.append('title', this.title)
        formData.append('description', this.description)
        formData.append('content', this.content)
        formData.append('image', this.image[0])
        formData.append('topics', this.selectedTopics.join(','))
        const { data } = await axios.post('/post', formData)
        this.$router.push(`/post/${data.insertId}`)
      } catch (error: any) {
        this.errorMessage = error.response.data.message
      }
    },
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

.markdown-body .fa-mavon-picture-o .dropdown-item:last-child {
  display: none;
}
</style>
