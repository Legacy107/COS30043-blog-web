<template>
  <div class="d-flex align-center">
    <v-btn variant="plain" prepend-icon="mdi-heart-outline">
      {{ noLikes }}
      <v-tooltip activator="parent" location="top">Like</v-tooltip>
    </v-btn>
    <v-btn variant="plain" prepend-icon="mdi-comment-outline">
      {{ noComments }}
      <v-tooltip activator="parent" location="top">Comment</v-tooltip>
    </v-btn>
    <v-btn variant="plain" icon class="ms-auto">
      <v-icon>mdi-bookmark-plus-outline</v-icon>
      <v-tooltip activator="parent" location="top">Save</v-tooltip>
    </v-btn>
    <v-btn variant="plain" icon>
      <v-icon>mdi-share-variant</v-icon>
      <v-tooltip activator="parent" location="top">Share</v-tooltip>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'PostAction',
  props: {
    id: {
      type: Number,
      required: true,
    },
    noLikes: {
      type: Number,
      default: 0,
    },
    noComments: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
/* Add your component styles here */
</style>
