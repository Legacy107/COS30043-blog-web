<template>
  <v-row>
    <v-col cols="12" sm="3">
      <v-select
        v-model="filterBy"
        :items="filterOptions"
        label="Filter by"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </v-col>

    <v-col cols="12" sm="6">
      <v-autocomplete
        v-model="selectedTopics"
        :items="topics"
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

    <v-col cols="12" sm="3">
      <v-select
        v-model="sortBy"
        :items="sortOptions"
        label="Sort By"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      sortBy: 'Newest',
      sortOptions: ['Newest', 'Most viewed', 'Most liked'],
      selectedTopics: [],
      topics: [
        'topic1',
        'topic2',
        'topic3',
        'topic4',
        'topic5',
        'topic6',
        'topic7',
        'topic8',
        'topic9',
      ],
      filterBy: 'All',
      filterOptions: ['All', 'Following'],
      posts: [],
    }
  },
  computed: {
    filteredPosts() {
      let filteredPosts = this.posts

      if (this.selectedTopics.length > 0) {
        filteredPosts = filteredPosts.filter((post) => {
          return this.selectedTopics.includes(post.topic)
        })
      }

      if (this.sortBy === 'newest') {
        filteredPosts.sort((a, b) => b.date - a.date)
      } else if (this.sortBy === 'most viewed') {
        filteredPosts.sort((a, b) => b.views - a.views)
      } else if (this.sortBy === 'most liked') {
        filteredPosts.sort((a, b) => b.likes - a.likes)
      }

      if (this.filterBy === 'following') {
        filteredPosts = filteredPosts.filter((post) => post.following)
      }

      return filteredPosts
    },
  },
}
</script>

<style scoped>
.v-row {
  max-width: 750px;
}
</style>
