<template>
  <v-card class="mx-auto w-100" max-width="400">
    <template v-if="loading">
      <v-container class="text-center py-6">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-container>
    </template>

    <template v-else>
      <v-list density="comfortable">
        <v-list-subheader class="font-weight-black">Post</v-list-subheader>

        <template v-if="posts.length">
          <v-list-item
            v-for="(post, i) in posts"
            :key="i"
            :value="post"
            color="primary"
            :href="`/post/${post.id}`"
          >
            <v-list-item-title>{{ post.title }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item>
            <v-list-item-title class="text-grey"
              >No post found</v-list-item-title
            >
          </v-list-item>
        </template>
      </v-list>

      <v-list>
        <v-list-subheader class="font-weight-black">People</v-list-subheader>

        <template v-if="users.length">
          <v-list-item
            v-for="(user, i) in users"
            :key="i"
            :value="user"
            color="primary"
            :href="`/user/${user.id}`"
          >
            <template v-slot:prepend>
              <router-link
                :to="`/user/${user.id}`"
                class="text-decoration-none"
              >
                <v-avatar size="32" color="primary" class="me-3">
                  <v-img
                    v-if="user.avatar"
                    :src="user.avatar"
                    :alt="user.firstname"
                  />
                  <span v-else class="text-body">
                    {{ user.firstname?.[0] }}
                  </span>
                </v-avatar>
              </router-link>
            </template>

            <v-list-item-title>
              {{ user.firstname }} {{ user.lastname }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item>
            <v-list-item-title class="text-grey"
              >No user found</v-list-item-title
            >
          </v-list-item>
        </template>
      </v-list>

      <v-list density="comfortable">
        <v-list-subheader class="font-weight-black">Topics</v-list-subheader>

        <template v-if="topics.length">
          <v-list-item
            v-for="(topic, i) in topics"
            :key="i"
            :value="topic"
            color="primary"
          >
            <v-list-item-title>{{ topic.name }}</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item>
            <v-list-item-title class="text-grey"
              >No topic found</v-list-item-title
            >
          </v-list-item>
        </template>
      </v-list>
    </template>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Post } from '@/@types/post'
import { User } from '@/@types/user'
import { Topic } from '@/@types/topic'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    posts: {
      type: Array as PropType<Post[]>,
      default: () => [],
    },
    users: {
      type: Array as PropType<User[]>,
      default: () => [],
    },
    topics: {
      type: Array as PropType<Topic[]>,
      default: () => [],
    },
  },
})
</script>

<style scoped>
.v-list-subheader {
  font-size: 1rem;
  position: relative;
}
.v-list-subheader::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.75rem;
  right: 0.75rem;
  height: 2px;
  background-color: rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
