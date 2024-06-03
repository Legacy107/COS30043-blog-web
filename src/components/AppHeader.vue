<template>
  <header>
    <v-app-bar app scroll-behavior="elevate">
      <v-app-bar-title
        :class="'bar-title ' + (expandSearch ? 'd-none' : 'd-block')"
      >
        <a
          href="/"
          class="text-h5 text-sm-h4 text-decoration-none font-weight-bold text-white"
        >
          Blov
        </a>
      </v-app-bar-title>

      <v-text-field
        v-model="search"
        class="search-bar d-none d-sm-block mr-md-auto mr-3"
        placeholder="Search"
        center-affix
        density="compact"
        hide-details
        variant="outlined"
      >
        <v-menu open-on-click activator="parent" open-on-focus>
          <SearchResult
            v-if="search.length > 1"
            :search-query="search"
            :loading="searchLoading"
            :posts="searchPosts"
            :users="searchUsers"
            :topics="searchTopics"
          />
        </v-menu>
      </v-text-field>

      <template v-slot:append>
        <a
          v-for="item in menu"
          :key="item.title"
          :href="item.link"
          class="text-decoration-none d-none d-sm-block"
        >
          <v-btn :color="item.color" :aria-label="item.title">
            {{ item.title }}
          </v-btn>
        </a>

        <v-fade-transition hide-on-leave>
          <v-text-field
            v-show="expandSearch"
            v-model="search"
            class="search-bar d-sm-none mr-3"
            placeholder="Search"
            center-affix
            density="compact"
            flat
            hide-details
            variant="outlined"
          >
            <v-menu open-on-click activator="parent" open-on-focus>
              <SearchResult
                v-if="search.length > 1"
                :search-query="search"
                :loading="searchLoading"
                :posts="searchPosts"
                :users="searchUsers"
                :topics="searchTopics"
              />
            </v-menu>
          </v-text-field>
        </v-fade-transition>

        <div class="d-sm-none min-width-100">
          <v-btn
            icon="mdi-magnify"
            v-on:click="openSearch"
            aria-label="Search"
          />
          <v-menu transition="fade-transition">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                aria-label="Menu"
              />
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
import SearchResult from './SearchResult.vue'
import axios from '@/utils/axios'
import { Post } from '@/@types/post'
import { User } from '@/@types/user'
import { Topic } from '@/@types/topic'

const publicMenu = [
  { title: 'Home', link: '/', color: 'white' },
  { title: 'Sign In', link: '/auth/login', color: 'white' },
  { title: 'Get Started', link: '/auth/signup', color: 'primary' },
]
const privateMenu = (id: string) => [
  { title: 'Home', link: '/', color: 'white' },
  { title: 'Profile', link: `/user/${id}`, color: 'white' },
  { title: 'New Post', link: '/post/create', color: 'primary' },
]

export default {
  name: 'AppHeader',
  components: {
    UserButton,
    SearchResult,
  },
  data() {
    return {
      openMenu: false,
      search: '',
      searchPosts: [],
      searchTopics: [],
      searchUsers: [],
      searchTimeout: null,
      searchLoading: false,
      expandSearch: false,
    } as {
      openMenu: boolean
      search: string
      searchPosts: Post[]
      searchTopics: Topic[]
      searchUsers: User[]
      searchTimeout: any
      searchLoading: boolean
      expandSearch: boolean
    }
  },
  methods: {
    handleOpenMenu() {
      this.openMenu = !this.openMenu
    },
    openSearch() {
      this.expandSearch = !this.expandSearch
    },
    async fetchSearchPosts() {
      try {
        const { data } = await axios.get(
          `/post?search=${this.search}&limit=5&sort=Newest`,
        )
        this.searchPosts = data.posts
      } catch (error) {
        console.error(error)
      }
    },
    async fetchSearchTopics() {
      try {
        const { data } = await axios.get(`/topic?search=${this.search}&limit=5`)
        this.searchTopics = data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchSearchUsers() {
      try {
        const { data } = await axios.get(`/user?search=${this.search}&limit=5`)
        this.searchUsers = data
      } catch (error) {
        console.error(error)
      }
    },
    async handleSearch() {
      if (this.search.length < 2) {
        this.searchPosts = []
        this.searchTopics = []
        this.searchUsers = []
        return
      }
      try {
        this.searchLoading = true
        await this.fetchSearchPosts()
        await this.fetchSearchUsers()
        await this.fetchSearchTopics()
      } catch (error) {
        console.error(error)
      } finally {
        this.searchLoading = false
      }
    },
  },
  computed: {
    ...mapStores(useAppStore),
    ...mapState(useAppStore, ['user', 'authenticated']),
    menu() {
      return this.authenticated
        ? privateMenu(`${this.user?.id ?? ''}`)
        : publicMenu
    },
  },
  watch: {
    search() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(this.handleSearch, 500)
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
  min-width: 3rem;
}

.min-width-100 {
  min-width: 100px;
}

@media (min-width: 601px) {
  .bar-title {
    display: block !important;
  }
}

@media (max-width: 600px) {
  :deep(.v-toolbar__append) {
    width: 100%;
    margin-left: 10px;
    justify-content: flex-end;
  }
}
</style>
