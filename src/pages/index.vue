<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-data-iterator :items="items" :page="page">
            <template v-slot:default="{ items }">
              <template v-for="(item, i) in items" :key="i">
                <v-col cols="12">
                  <PostCard
                    :id="item.raw.id"
                    :avatarUrl="item.raw.authorAvatar"
                    :author="item.raw.author"
                    :title="item.raw.title"
                    :description="item.raw.description"
                    :date="item.raw.date"
                    :imageUrl="item.raw.image"
                  />
                </v-col>
              </template>
            </template>
          </v-data-iterator>
        </v-row>
      </v-col>
      <v-col cols="4">
        <!-- Content for the 3-column section -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
const items = ref([
  {
    id: 1,
    title: 'Post 1',
    description:
      'Description for post 1 Description for post 1 Description for post 1 Description for post 1 Description for post 1 Description for post 1',
    content: 'Content for post 1',
    author: 'Author 1',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    date: '2021-01-01',
    image: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
  },
  {
    id: 2,
    title: 'Post 2',
    description: 'Description for post 2',
    content: 'Content for post 2',
    author: 'Author 2',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    date: '2021-01-02',
    image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
  },
  {
    id: 3,
    title: 'Post 3',
    description: 'Description for post 3',
    content: 'Content for post 3',
    author: 'Author 3',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    date: '2021-01-03',
    image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
  },
  {
    id: 4,
    title: 'Post 4',
    description: 'Description for post 4',
    content: 'Content for post 4',
    author: 'Author 4',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    date: '2021-01-04',
    image: 'https://cdn.vuetifyjs.com/images/cards/forest.jpg',
  },
  {
    id: 5,
    title: 'Post 5',
    description: 'Description for post 5',
    content: 'Content for post 5',
    author: 'Author 5',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
    date: '2021-01-05',
    image: 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg',
  },
  {
    id: 6,
    title: 'Post 6',
    description: 'Description for post 6',
    content: 'Content for post 6',
    author: 'Author 6',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/6.jpg',
    date: '2021-01-06',
    image: 'https://cdn.vuetifyjs.com/images/cards/beach.jpg',
  },
  {
    id: 7,
    title: 'Post 7',
    description: 'Description for post 7',
    content: 'Content for post 7',
    author: 'Author 7',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/7.jpg',
    date: '2021-01-07',
    image: 'https://cdn.vuetifyjs.com/images/cards/sunset.jpg',
  },
  {
    id: 8,
    title: 'Post 8',
    description: 'Description for post 8',
    content: 'Content for post 8',
    author: 'Author 8',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/8.jpg',
    date: '2021-01-08',
    image: 'https://cdn.vuetifyjs.com/images/cards/river.jpg',
  },
  {
    id: 9,
    title: 'Post 9',
    description: 'Description for post 9',
    content: 'Content for post 9',
    author: 'Author 9',
    authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/9.jpg',
    date: '2021-01-09',
    image: 'https://cdn.vuetifyjs.com/images/cards/lake.jpg',
  },
])
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style>
