<template>
  <v-row>
    <v-col v-if="authenticated" cols="12" md="3">
      <v-select
        v-model="filter"
        :items="filterOptions"
        label="Filter by"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-autocomplete
        v-model="topics"
        :items="availableTopics"
        label="Filter by Topics"
        multiple
        variant="outlined"
        density="comfortable"
        clearable
        chips
        closable-chips
        clear-on-select
        hide-details
      />
    </v-col>

    <v-col cols="12" md="3">
      <v-select
        v-model="sort"
        :items="sortOptions"
        label="Sort By"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import axios from '@/utils/axios'
import { Topic } from '@/@types/topic'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'

export default {
  props: {
    sortBy: {
      type: String,
      default: 'Newest',
    },
    selectedTopics: {
      type: Array,
      required: true,
      default: () => [],
    },
    filterBy: {
      type: String,
      required: true,
      default: 'All',
    },
  },
  emits: ['update:sortBy', 'update:selectedTopics', 'update:filterBy'],
  data() {
    return {
      sortOptions: ['Newest', 'Most liked', 'Most commented'],
      availableTopics: [],
      filterOptions: ['All', 'Following'],
    }
  },
  computed: {
    ...mapState(useAppStore, ['authenticated']),
    topics: {
      get() {
        return this.selectedTopics
      },
      set(value: string[]) {
        this.$emit('update:selectedTopics', value)
      },
    },
    sort: {
      get() {
        return this.sortBy
      },
      set(value: string) {
        this.$emit('update:sortBy', value)
      },
    },
    filter: {
      get() {
        return this.filterBy
      },
      set(value: string) {
        this.$emit('update:filterBy', value)
      },
    },
  },
  methods: {
    async fetchTopics() {
      try {
        const { data } = await axios.get('/topic')
        this.availableTopics = data.map((topic: Topic) => topic.name)
      } catch (error) {
        console.error(error)
      }
    },
  },
  mounted() {
    this.fetchTopics()
  },
  watch: {
    authenticated(value: boolean) {
      if (!value) {
        this.filter = 'All'
      }
    },
  },
}
</script>

<style scoped>
.v-row {
  max-width: 750px;
}
</style>
