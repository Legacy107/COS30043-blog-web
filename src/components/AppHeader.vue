<template>
  <header>
    <v-app-bar app scroll-behavior="elevate">
      <v-app-bar-title class="bar-title">
        <a
          href="/"
          class="text-h5 text-sm-h4 text-decoration-none font-weight-bold text-white"
          >Logo</a
        >
      </v-app-bar-title>
      <v-text-field
        class="search-bar d-none d-sm-block mr-md-auto mr-3"
        placeholder="Search"
        center-affix
        density="compact"
        flat
        hide-details="false"
        variant="outlined"
      ></v-text-field>

      <template v-slot:append>
        <a
          v-for="item in menu"
          :key="item.title"
          :href="item.link"
          class="text-decoration-none d-none d-sm-block"
        >
          <v-btn text :color="item.color">{{ item.title }}</v-btn>
        </a>

        <div class="d-sm-none">
          <v-btn icon="mdi-magnify" v-on:click="test"></v-btn>
          <v-menu bottom left transition="fade-transition">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
            </template>
            <v-list>
              <a
                v-for="item in menu"
                :key="item.title"
                :href="item.link"
                :class="'text-decoration-none text-' + item.color"
              >
                <v-list-item>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </a>
            </v-list>
          </v-menu>
        </div>

        <div v-if="authenticated && user">
          <UserButton :user="user" />
        </div>
      </template>
    </v-app-bar>
  </header>
</template>

<script lang="ts">
import { useAppStore } from '../stores/app'
import { mapState, mapStores } from 'pinia'
import UserButton from './UserButton.vue'

const publicMenu = [
  { title: 'Sign In', link: '/auth/login', color: 'white' },
  { title: 'Get Started', link: '/auth/signup', color: 'primary' },
]
const privateMenu = [
  { title: 'Profile', link: '/profile', color: 'white' },
  { title: 'New Post', link: '/post/create', color: 'primary' },
]

export default {
  name: 'AppHeader',
  components: {
    UserButton,
  },
  data() {
    return {
      openMenu: false,
    }
  },
  methods: {
    handleOpenMenu() {
      this.openMenu = !this.openMenu
    },
    test() {
      console.log('test', this.user)
    },
  },
  computed: {
    ...mapStores(useAppStore),
    ...mapState(useAppStore, ['user', 'authenticated']),
    menu() {
      return this.authenticated ? privateMenu : publicMenu
    },
  },
}
</script>

<style scoped>
.search-bar {
  max-width: 400px;
}

.bar-title {
  flex-grow: 0;
  flex-basis: auto;
  margin-right: 1rem;
}
</style>
