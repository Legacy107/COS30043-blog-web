<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <a :href="url" class="text-decoration-none text-unset">
        <v-card
          max-width="720"
          v-bind="props"
          :color="isHovering ? 'grey-darken-3' : undefined"
          :variant="isHovering ? 'elevated' : 'flat'"
          class="cursor-pointer"
        >
          <div
            class="d-flex flex-no-wrap justify-space-between flex-column flex-sm-row"
          >
            <div>
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <router-link
                    v-if="showAuthor"
                    :to="`/user/${authorId}`"
                    class="text-white text-decoration-none"
                  >
                    <div
                      v-bind="props"
                      :class="
                        'd-flex align-center ' +
                        (isHovering
                          ? 'text-decoration-underline'
                          : 'text-decoration-none')
                      "
                    >
                      <v-avatar class="ma-3" size="24" color="primary">
                        <v-img
                          v-if="avatarUrl"
                          :src="avatarUrl"
                          :alt="author"
                        />
                        <span v-else class="text-body">
                          {{ author?.[0] }}
                        </span>
                      </v-avatar>
                      <span>{{ author }}</span>
                    </div>
                  </router-link>
                </template>
              </v-hover>
              <v-card-title
                :class="`text-wrap text-h5 ${!showAuthor ? 'mt-2' : ''}`"
                >{{ post.title }}</v-card-title
              >

              <v-card-subtitle
                class="d-inline-flex ga-1 justify-center align-center ga-5"
              >
                {{ formatDate(post.createAt) }}
                <span>
                  <v-icon size="small" color="primary">mdi-heart</v-icon>
                  {{ post.likes }}
                </span>
                <span>
                  <v-icon size="small" color="primary">mdi-comment</v-icon>
                  {{ post.comments }}
                </span>
              </v-card-subtitle>

              <v-card-text>{{ post.description }}</v-card-text>
            </div>

            <template v-if="post.image">
              <v-avatar
                class="ma-2 align-self-center d-none d-sm-block"
                rounded
                size="175"
              >
                <v-img :src="post.image"></v-img>
              </v-avatar>
              <v-img
                :src="post.image ?? ''"
                class="ma-4 d-sm-none"
                height="200"
                width="calc(100% - 32px)"
                cover
                rounded
              ></v-img>
            </template>
          </div>
        </v-card>
      </a>
    </template>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Post } from '@/@types/post'
import { formatDate } from '@/utils/date'

export default defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    url() {
      return `/post/${this.post.id}`
    },
  },
  methods: {
    formatDate,
  },
})
</script>
