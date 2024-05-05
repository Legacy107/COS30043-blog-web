<template>
  <v-card class="mx-auto" max-width="400">
    <v-list density="comfortable">
      <v-list-subheader class="font-weight-black">Post</v-list-subheader>

      <v-list-item
        v-for="(post, i) in posts"
        :key="i"
        :value="post"
        color="primary"
        :href="`/post/${post.id}`"
      >
        <v-list-item-title>{{ post.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-list>
      <v-list-subheader class="font-weight-black">People</v-list-subheader>

      <v-list-item
        v-for="(user, i) in users"
        :key="i"
        :value="user"
        color="primary"
        :href="`/user/${user.id}`"
      >
        <template v-slot:prepend>
          <router-link :to="`/user/${user.id}`" class="text-decoration-none">
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
    </v-list>

    <v-list density="comfortable">
      <v-list-subheader class="font-weight-black">Topics</v-list-subheader>

      <v-list-item
        v-for="(topic, i) in topics"
        :key="i"
        :value="topic"
        color="primary"
      >
        <v-list-item-title>{{ topic.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
export default {
  data: () => ({
    posts: [
      {
        id: 1,
        title:
          'Post 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description:
          'Description for post 1 Description for post 1 Description for post 1 Description for post 1 Description for post 1 Description for post 1',
        content: 'Content for post 1',
        date: '2021-01-01',
        image: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        author: {
          id: 1,
          username: 'johndoe',
          firstname: 'John',
          lastname: 'Doe',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      },
      {
        id: 2,
        title:
          'Post 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description: 'Description for post 2',
        content: 'Content for post 2',
        date: '2021-01-02',
        image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
        author: {
          id: 1,
          username: 'johndoe',
          firstname: 'John',
          lastname: 'Doe',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      },
      {
        id: 3,
        title:
          'Post 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description: 'Description for post 3',
        content: 'Content for post 3',
        date: '2021-01-03',
        image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
        author: {
          id: 1,
          username: 'johndoe',
          firstname: 'John',
          lastname: 'Doe',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      },
      {
        id: 4,
        title:
          'Post 4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description: 'Description for post 4',
        content: 'Content for post 4',
        date: '2021-01-04',
        image: 'https://cdn.vuetifyjs.com/images/cards/forest.jpg',
        author: {
          id: 1,
          username: 'johndoe',
          firstname: 'John',
          lastname: 'Doe',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      },
    ],
    topics: [
      {
        id: 1,
        title: 'Topic 1',
      },
      {
        id: 2,
        title: 'Topic 2',
      },
      {
        id: 3,
        title: 'Topic 3',
      },
      {
        id: 4,
        title: 'Topic 4',
      },
    ],
    users: [
      {
        id: 1,
        username: 'johndoe',
        firstname: 'John',
        lastname: 'Doe',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 2,
        username: 'janedoe',
        firstname: 'Jane',
        lastname: 'Doe',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 3,
        username: 'johndoejr',
        firstname: 'John',
        lastname: 'Doe Jr.',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ],
  }),
}
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
