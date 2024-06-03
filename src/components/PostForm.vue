<template>
  <v-form
    @submit.prevent="submit"
    class="w-100 d-flex flex-column justify-start ga-2"
  >
    <v-text-field
      v-model="_title"
      label="Title"
      flat
      variant="outlined"
      :rules="titleRules"
    />

    <v-textarea
      v-model="_description"
      label="Description"
      flat
      variant="outlined"
      rows="4"
      counter
      :rules="descriptionRules"
    />

    <v-file-input
      v-model="_image"
      accept="image/*"
      clearable
      label="Thumbnail"
      variant="outlined"
      :rules="imageRules"
    />

    <v-autocomplete
      v-model="_selectedTopics"
      :items="topics"
      label="Topics"
      multiple
      variant="outlined"
      clearable
      chips
      closable-chips
      clear-on-select
    />

    <mavon-editor
      v-model="_content"
      language="en"
      placeholder="Compose your post in markdown"
      :toolbars="{
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        table: true,
        code: true,
        preview: true,
        fullscreen: false,
        guide: true,
        undo: true,
        redo: true,
      }"
    />
    <v-btn
      type="submit"
      color="primary"
      :loading="loading"
      class="align-self-end mt-4"
      aria-label="Submit post"
    >
      {{ buttonText }}
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import axios from '@/utils/axios'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    buttonText: {
      type: String,
      default: 'Create',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    selectedTopics: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
    image: {
      type: Array as PropType<File[]>,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function as PropType<() => Promise<void>>,
      required: true,
    },
  },
  emits: [
    'update:title',
    'update:description',
    'update:selectedTopics',
    'update:image',
    'update:content',
  ],
  data: () => {
    return {
      topics: [],
      loading: false,
      titleRules: [
        (v: string) => !!v || 'Title is required',
        (v: string) =>
          (v && v.length <= 100) || 'Title must be less than 100 characters',
      ],
      descriptionRules: [
        (v: string) => !!v || 'Description is required',
        (v: string) =>
          (v && v.length <= 300) ||
          'Description must be less than 300 characters',
      ],
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
    }
  },
  computed: {
    _title: {
      get() {
        return this.title
      },
      set(value: string) {
        this.$emit('update:title', value)
      },
    },
    _description: {
      get() {
        return this.description
      },
      set(value: string) {
        this.$emit('update:description', value)
      },
    },
    _selectedTopics: {
      get() {
        return this.selectedTopics
      },
      set(value: string[]) {
        this.$emit('update:selectedTopics', value)
      },
    },
    _image: {
      get() {
        return this.image
      },
      set(value: File[]) {
        this.$emit('update:image', value)
      },
    },
    _content: {
      get() {
        return this.content
      },
      set(value: string) {
        this.$emit('update:content', value)
      },
    },
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
        console.error(error)
      }
    },
    async submit(event: any) {
      try {
        this.loading = true
        const validation = await event
        if (!validation.valid) return

        await this.onSubmit()
      } catch (error: any) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
  async mounted() {
    await this.fetchTopics()
  },
})
</script>
