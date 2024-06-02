<template>
  <div class="d-flex align-center">
    <v-btn variant="plain" :prepend-icon="likeIcon" @click="onLike">
      {{ noLikes }}
      <v-tooltip activator="parent" location="top">Like</v-tooltip>
    </v-btn>
    <v-btn
      variant="plain"
      prepend-icon="mdi-comment-outline"
      @click="onOpenComments"
    >
      {{ noComments }}
      <v-tooltip activator="parent" location="top">Comment</v-tooltip>
    </v-btn>
    <!-- <v-btn variant="plain" icon class="ms-auto">
      <v-icon>mdi-bookmark-plus-outline</v-icon>
      <v-tooltip activator="parent" location="top">Save</v-tooltip>
    </v-btn> -->
    <v-btn variant="plain" icon class="ms-auto">
      <v-icon>mdi-share-variant</v-icon>
      <v-tooltip activator="parent" location="top">Share</v-tooltip>
      <ShareModal :url="shareUrl" :title="shareTitle" />
    </v-btn>
  </div>
</template>

<script lang="ts">
import ShareModal from '@/components/ShareModal.vue'
export default {
  name: 'PostAction',
  components: {
    ShareModal,
  },
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
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    onOpenComments: {
      type: Function,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    onLike: {
      type: Function,
    },
  },
  computed: {
    likeIcon() {
      return this.isLiked ? 'mdi-heart' : 'mdi-heart-outline'
    },
    shareUrl() {
      return `${window.location.origin}/post/${this.id}`
    },
    shareTitle() {
      return `Check out this post "${this.title}" by ${this.author}`
    },
  },
}
</script>

<style scoped>
/* Add your component styles here */
</style>
