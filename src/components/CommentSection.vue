<template>
  <div>
    <div class="text-h6">Comments</div>
    <v-textarea
      v-model="newComment"
      label="Enter your comment"
      class="mb-3 mt-6"
      variant="outlined"
      rows="4"
    ></v-textarea>
    <v-select
      v-model="selectedSort"
      :items="sortOptions"
      label="Sort by"
      class="mb-3"
      variant="plain"
    ></v-select>
    <v-card v-for="comment in comments" :key="comment.id" class="mb-4">
      <v-card-text>
        <div class="d-flex align-center">
          <v-avatar size="32">
            <img :src="comment.user.avatar" alt="User Avatar" />
          </v-avatar>
          <div class="ml-2 d-flex flex-column justify-content-between">
            <span class="font-weight-bold">
              {{ comment.user.firstname }} {{ comment.user.lastname }}
            </span>
            <span class="text-caption">{{ comment.time }}</span>
          </div>
        </div>
        <div class="mt-3">{{ comment.content }}</div>
        <div class="d-flex mt-4">
          <v-btn variant="plain" prepend-icon="mdi-heart-outline" class="px-0">
            {{ comment.noLikes }}
            <v-tooltip activator="parent" location="top">Like</v-tooltip>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newComment: '',
      sortOptions: ['Newest', 'Oldest', 'Most liked'],
      selectedSort: 'Newest',
      comments: [
        {
          id: 1,
          time: '2021-01-02 10:00:00',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          noLikes: 10,
          user: {
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
          time: '2021-01-02 10:00:00',
          content:
            'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
          noLikes: 5,
          user: {
            id: 2,
            username: 'janesmith',
            firstname: 'Jane',
            lastname: 'Smith',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          },
        },
        // Add more comments here
      ],
    }
  },
}
</script>

<style scoped>
.v-select {
  width: 120px;
}
</style>
