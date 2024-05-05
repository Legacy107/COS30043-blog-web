<template>
  <div class="d-flex w-100 flex-column ga-8 root">
    <div>
      <div class="text-h5 mb-2 font-weight-bold">Trending Posts</div>
      <v-list lines="two" density="comfortable" bg-color="transparent">
        <v-list-item v-for="post in trendingPosts" :key="post.id" class="ps-0">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <router-link
                :to="`/user/${post.author.id}`"
                v-bind="props"
                class="text-decoration-none"
                :class="
                  'text-white ' +
                  (isHovering
                    ? 'text-decoration-underline'
                    : 'text-decoration-none')
                "
              >
                <div class="d-flex ga-2 align-center">
                  <v-avatar size="20">
                    <v-img
                      v-if="post.author.avatar"
                      :src="post.author.avatar"
                      :alt="post.author.firstname"
                    />
                    <span v-else class="text-h5">
                      {{ post.author.firstname?.[0] }}
                    </span>
                  </v-avatar>

                  <span class="text-subtitle-2">
                    {{ post.author.firstname }} {{ post.author.lastname }}
                  </span>
                </div>
              </router-link>
            </template>
          </v-hover>

          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <router-link
                :to="`/post/${post.id}`"
                v-bind="props"
                class="text-decoration-none"
                :class="
                  'text-white ' +
                  (isHovering
                    ? 'text-decoration-underline'
                    : 'text-decoration-none')
                "
              >
                <div class="mt-1 text-h7 font-weight-black">
                  {{ post.title }}
                </div>
              </router-link>
            </template>
          </v-hover>
        </v-list-item>
      </v-list>
    </div>

    <div>
      <div class="text-h5 mb-2 font-weight-bold">Recommended Topics</div>
      <v-chip-group column>
        <v-chip
          v-for="topic in recommendedTopics"
          :key="topic.id"
          color="primary"
          size="large"
        >
          {{ topic.title }}
        </v-chip>
      </v-chip-group>
    </div>

    <div>
      <div class="text-h5 mb-2 font-weight-bold">Recommended Authors</div>
      <v-list density="compact" bg-color="transparent" slim lines="three">
        <v-list-item
          v-for="user in recommendedAuthors"
          :key="user.id"
          :prepend-avatar="user.avatar"
          class="text-white ps-0"
          height="48"
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

          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <router-link
                v-bind="props"
                :to="`/user/${user.id}`"
                class="text-white text-decoration-none"
              >
                <div
                  :class="
                    'font-weight-bold ' +
                    (isHovering
                      ? 'text-decoration-underline'
                      : 'text-decoration-none')
                  "
                >
                  {{ user.firstname }} {{ user.lastname }}
                </div>
                <div class="clip-bio text-caption text-grey-lighten-2">
                  {{ user.bio }}
                </div>
              </router-link>
            </template>
          </v-hover>

          <template v-slot:append>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="align-self-center"
            >
              Follow
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    trendingPosts: [
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
      {
        id: 5,
        title:
          'Post 5 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description: 'Description for post 5',
        content: 'Content for post 5',
        date: '2021-01-05',
        image: 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg',
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
    recommendedTopics: [
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
      {
        id: 5,
        title: 'Topic 5',
      },
      {
        id: 6,
        title: 'Topic 6',
      },
      {
        id: 7,
        title: 'Topic 7',
      },
      {
        id: 8,
        title: 'Topic 8',
      },
    ],
    recommendedAuthors: [
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
.root {
  position: sticky;
  top: 2rem;
}

.v-list {
  padding-bottom: 0;
}

:deep(.v-slide-group__content) {
  row-gap: 0.2rem !important;
}

.clip-bio {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px !important;
}

:deep(.v-list-item--three-line .v-list-item__append) {
  align-self: center;
  padding-left: 0.75rem;
}
</style>
