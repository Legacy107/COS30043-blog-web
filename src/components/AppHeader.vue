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
        <v-btn class="d-none d-sm-block" text>Sign In</v-btn>
        <v-btn class="d-none d-sm-block" color="primary">Get Started</v-btn>
        <div class="d-sm-none">
          <v-btn icon="mdi-magnify"></v-btn>

          <v-menu bottom left>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Sign In</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Get Started</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-app-bar>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      openMenu: false,
    }
  },
  methods: {
    signIn() {
      console.log('Sign In')
    },
    getStarted() {
      console.log('Get Started')
    },
    handleOpenMenu() {
      this.openMenu = !this.openMenu
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
