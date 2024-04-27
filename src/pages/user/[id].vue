<template>
  <v-container class="my-20 mt-4">
    <v-row>
      <v-col cols="12" sm="12" md="4" class="d-flex justify-center mb-4">
        <ProfileAbout
          :user="user"
          :followers="followers"
          :following="following"
        />
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-row class="flex-column align-center">
          <div class="post-title text-h4 font-weight-bold mb-2 ps-3 px-md-1">
            Posts
          </div>
          <v-data-iterator :items="posts" :page="page">
            <template v-slot:default="{ items }">
              <template v-for="(post, i) in items" :key="i">
                <v-col cols="12">
                  <PostCard
                    :showAuthor="false"
                    :id="post.raw.id"
                    :avatarUrl="post.raw.authorAvatar"
                    :author="post.raw.author"
                    :title="post.raw.title"
                    :description="post.raw.description"
                    :date="post.raw.date"
                    :imageUrl="post.raw.image"
                  />
                </v-col>
              </template>
            </template>
          </v-data-iterator>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostCard from '@/components/PostCard.vue'
import ProfileAbout from '@/components/ProfileAbout.vue'

export default {
  name: 'Profile',
  components: {
    PostCard,
    ProfileAbout,
  },
  data() {
    return {
      user: {
        id: 1,
        username: 'johndoe',
        firstname: 'John',
        lastname: 'Doe',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        followers: 100,
      },
      following: [
        {
          id: 2,
          username: 'janedoe',
          firstname: 'Jane',
          lastname: 'Doe',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          followers: 100,
        },
        {
          id: 3,
          username: 'johndoejr',
          firstname: 'John',
          lastname: 'Doe Jr.',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          followers: 100,
        },
      ],
      page: 1,
      posts: [
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
      ],
    }
  },
  methods: {
    // Your methods go here
  },
  mounted() {
    const id = this.$route.params.id
    console.log('Fetching post ID:', id)
  },
}
</script>

<style scoped>
.v-container {
  max-width: 1100px;
}
.post-title {
  width: 100%;
  max-width: 600px;
}
</style>
