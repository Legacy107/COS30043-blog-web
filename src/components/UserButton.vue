<template>
  <v-menu v-if="!!user" transition="fade-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" aria-label="User Menu">
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
import { useAppStore } from '../stores/app'
import { mapActions } from 'pinia'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  methods: {
    ...mapActions(useAppStore, ['logout']),
    signOut() {
      this.logout()
      this.$router.push('/')
    },
  },
})
</script>
