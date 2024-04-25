<template>
  <v-menu v-if="!!user" bottom left transition="fade-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar size="36" color="primary">
          <v-img v-if="user.avatar" :src="user.avatar" :alt="user.firstname" />
          <span v-else class="text-h5">
            {{ user.firstname?.[0] }}
          </span>
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-subheader>
        <v-list-item-title>
          {{ user.firstname }} {{ user.lastname }}
        </v-list-item-title>
      </v-list-subheader>
      <v-list-item @click="goToAccountSettings">
        <template v-slot:prepend>
          <v-icon icon="mdi-account-circle-outline"></v-icon>
        </template>
        <v-list-item-title>Account Settings</v-list-item-title>
      </v-list-item>
      <v-list-item @click="signOut">
        <template v-slot:prepend>
          <v-icon icon="mdi-exit-to-app"></v-icon>
        </template>
        <v-list-item-title>Sign Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { User } from '../@types/user'
import { defineComponent, PropType } from 'vue'
// import Cookies from 'js-cookie'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      // required: true,
    },
  },
  methods: {
    goToAccountSettings() {
      // Add your logic to navigate to the account settings page
    },
    signOut() {
      // Cookies.remove('token')
      // Cookies.remove('user')
      // this.$router.push('/')
    },
  },
})
</script>
