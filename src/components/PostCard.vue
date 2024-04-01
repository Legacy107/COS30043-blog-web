<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <a :href="url" class="text-decoration-none text-unset">
        <v-card
          max-width="600"
          v-bind="props"
          :color="isHovering ? 'grey-darken-3' : undefined"
          :variant="isHovering ? 'elevated' : 'flat'"
          class="cursor-pointer"
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <div class="d-flex align-center">
                <v-avatar class="ma-3" size="24">
                  <v-img :src="avatarUrl"></v-img>
                </v-avatar>
                <span>{{ author }}</span>
              </div>
              <v-card-title class="text-h5">{{ title }}</v-card-title>

              <v-card-subtitle>{{ date }}</v-card-subtitle>

              <v-card-text>{{ description }}</v-card-text>
            </div>

            <v-avatar class="ma-2 align-self-center" rounded size="175">
              <v-img :src="imageUrl"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </a>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    id: {
      type: Number,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  computed: {
    url() {
      console.log(this)
      return `/post/${this?.id}`
    },
  },
}
</script>

<style scoped>
/* Add your component styles here */
</style>
