<template>
  <v-container class="d-flex justify-center align-center" fluid>
    <v-sheet class="w-100 pa-5 d-flex" rounded>
      <v-form
        @submit.prevent="login"
        class="w-100 d-flex flex-column justify-stretch ga-1"
      >
        <div class="text-h4 mb-7 font-weight-bold">Sign in</div>
        <v-text-field
          v-model="username"
          label="Username"
          :rules="usernameRules"
          :error-messages="errorMessage"
          required
          flat
          variant="outlined"
          autocomplete="username"
          @input="errorMessage = ''"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :rules="passwordRules"
          :error-messages="errorMessage"
          type="password"
          required
          flat
          variant="outlined"
          autocomplete="current-password"
          @input="errorMessage = ''"
        ></v-text-field>
        <v-btn :loading="loading" type="submit" color="primary" block
          >Login</v-btn
        >
        <a
          href="/auth/signup"
          class="text-decoration-none text-primary text-center mt-3"
        >
          Don't have an account? Sign up here
        </a>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
import { mapActions } from 'pinia'
import axios from '../../utils/axios'
import { useAppStore } from '../../stores/app'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      usernameRules: [(v) => !!v || 'Username is required'],
      passwordRules: [(v) => !!v || 'Password is required'],
      loading: false,
    }
  },
  methods: {
    async login(event) {
      try {
        this.loading = true
        const validation = await event
        if (!validation.valid) return

        const response = await axios.post('/auth/login', {
          username: this.username,
          password: this.password,
        })
        const { accessToken, user } = response.data
        Cookies.set('token', accessToken)
        Cookies.set('user', JSON.stringify(user))
        this.setUser(user)
        this.$router.push('/')
      } catch (error) {
        this.errorMessage = error.response.data.message
        this.password = ''
      } finally {
        this.loading = false
      }
    },
    ...mapActions(useAppStore, ['setUser']),
  },
}
</script>

<style scoped>
.v-container {
  max-width: 400px;
  height: 100%;
}
.v-input--error {
  margin-bottom: 0.4rem;
}
</style>
