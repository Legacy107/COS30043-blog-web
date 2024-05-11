<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card class="py-2">
          <v-card-title class="mb-4">
            <span class="text-h4">Create Post</span>
          </v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="submit"
              class="w-100 d-flex flex-column justify-start ga-2"
            >
              <v-text-field
                v-model="title"
                label="Title"
                flat
                variant="outlined"
                :rules="titleRules"
              ></v-text-field>

              <v-text-field
                v-model="description"
                label="Description"
                flat
                variant="outlined"
                :rules="descriptionRules"
              ></v-text-field>

              <v-file-input
                v-model="image"
                accept="image/*"
                clearable
                label="Thumbnail"
                variant="outlined"
                :rules="imageRules"
              ></v-file-input>

              <v-autocomplete
                v-model="selectedTopics"
                :items="topics"
                label="Topics"
                multiple
                variant="outlined"
                clearable
                chips
                closable-chips
                clear-on-select
              ></v-autocomplete>

              <mavon-editor
                v-model="content"
                language="en"
                placeholder="Compose your post in markdown"
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                class="align-self-start mt-4"
              >
                Create Post
              </v-btn>
              <v-alert
                v-if="errorMessage"
                type="error"
                dismissible
                border="start"
              >
                {{ errorMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from '@/utils/axios'

export default {
  data() {
    return {
      topics: [],
      selectedTopics: [],
      title: '',
      content: '# Hello World!',
      description: '',
      image: [],
      errorMessage: '',
      titleRules: [(v: string) => !!v || 'Title is required'],
      descriptionRules: [(v: string) => !!v || 'Description is required'],
      imageRules: [
        (value: File[]) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 2000000 ||
            'Thumbnail size should be less than 2 MB!'
          )
        },
      ],
      contentRules: [(v: string) => !!v || 'Content is required'],
      loading: false,
    }
  },
  methods: {
    async fetchTopics() {
      try {
        const { data } = await axios.get('/topic')
        this.topics = data.map((topic: any) => ({
          title: topic.name,
          value: topic.id,
        }))
      } catch (error: any) {
        this.errorMessage = error.response.data.message
      }
    },
    async submit(event: any) {
      try {
        this.loading = true
        const validation = await event
        if (!validation.valid) return
        const formData = new FormData()
        formData.append('title', this.title)
        formData.append('description', this.description)
        formData.append('content', this.content)
        formData.append('image', this.image[0])
        formData.append('topics', this.selectedTopics.join(','))
        await axios.post('/post', formData)
      } catch (error: any) {
        this.errorMessage = error.response.data.message
      } finally {
        this.loading = false
      }
    },
  },
  async mounted() {
    await this.fetchTopics()
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
