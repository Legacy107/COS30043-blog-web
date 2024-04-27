<template>
  <div class="container">
    <v-row>
      <v-col cols="12">
        <v-avatar size="100">
          <v-img v-if="user.avatar" :src="user.avatar" :alt="user.firstname" />
          <span v-else class="text-h5">
            {{ user.firstname?.[0] }}
          </span>
        </v-avatar>
      </v-col>
      <v-col cols="12">
        <h2>{{ user.firstname }} {{ user.lastname }}</h2>
        <p>{{ user.followers }} Followers</p>
        <p class="my-4">{{ user.bio }}</p>
        <v-btn color="primary" variant="outlined">Follow</v-btn>
      </v-col>
    </v-row>
    <div class="mt-10">
      <div class="text-h6">Following</div>
      <v-list density="compact" bg-color="transparent" slim>
        <v-hover v-for="followingUser in following" :key="followingUser.id">
          <template v-slot:default="{ isHovering, props }">
            <v-list-item
              :prepend-avatar="followingUser.avatar"
              v-bind="props"
              class="text-white ps-0"
              height="48"
            >
              <template v-slot:prepend>
                <router-link
                  :to="`/user/${followingUser.id}`"
                  class="text-decoration-none"
                >
                  <v-avatar size="24" color="primary" class="me-2">
                    <v-img
                      v-if="followingUser.avatar"
                      :src="followingUser.avatar"
                      :alt="followingUser.firstname"
                    />
                    <span v-else class="text-body">
                      {{ followingUser.firstname?.[0] }}
                    </span>
                  </v-avatar>
                </router-link>
              </template>

              <router-link
                :to="`/user/${followingUser.id}`"
                class="text-decoration-none"
              >
                <div
                  :class="
                    'text-white ' +
                    (isHovering
                      ? 'text-decoration-underline'
                      : 'text-decoration-none')
                  "
                >
                  {{ followingUser.firstname }} {{ followingUser.lastname }}
                </div>
              </router-link>

              <template v-slot:append>
                <v-menu
                  location="top center"
                  transition="fade-transition"
                  open-on-hover
                  :close-on-content-click="false"
                  origin="bottom center"
                  offset="5"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-horizontal"
                      variant="text"
                      v-bind="props"
                      class="text-decoration-none"
                    >
                    </v-btn>
                  </template>
                  <v-card
                    :title="`${followingUser.firstname} ${followingUser.lastname}`"
                    max-width="300"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary">
                        <v-img
                          v-if="followingUser.avatar"
                          :src="followingUser.avatar"
                          :alt="followingUser.firstname"
                        />
                        <span v-else class="text-body">
                          {{ followingUser.firstname?.[0] }}
                        </span>
                      </v-avatar>
                    </template>

                    <v-card-text>
                      <div>{{ followingUser.bio }}</div>
                      <div
                        class="d-flex justify-space-between mt-4 pt-4 border-t-sm align-center"
                      >
                        <div>{{ followingUser.followers }} Followers</div>
                        <v-btn
                          color="primary"
                          variant="outlined"
                          size="x-small"
                        >
                          Follow
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </v-list-item>
          </template>
        </v-hover>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { User } from '@/@types/user'

export default defineComponent({
  name: 'ProfileAbout',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    following: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
})
</script>

<style scoped>
.container {
  position: sticky;
  top: 1rem;
  max-width: 600px;
}
</style>
