<template>
  <v-container class="d-flex justify-center align-center" fluid>
    <v-sheet class="w-100 pa-5 d-flex" rounded>
      <v-form
        @submit.prevent="signup"
        class="w-100 d-flex flex-column justify-stretch ga-1"
      >
        <div class="text-h4 mb-7 font-weight-bold">Sign up</div>
        <v-text-field
          v-model="firstName"
          label="First Name"
          :rules="firstNameRules"
          flat
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="lastName"
          label="Last Name"
          :rules="lastNameRules"
          flat
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="username"
          label="Username"
          :rules="usernameRules"
          flat
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          :rules="passwordRules"
          flat
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="retypePassword"
          label="Confirm Password"
          type="password"
          :rules="retypePasswordRules"
          flat
          variant="outlined"
          required
        ></v-text-field>
        <v-btn
          :loading="loading"
          type="submit"
          color="primary"
          class="w-100"
          block
        >
          {{ loading ? 'Signing Up...' : 'Sign Up' }}
        </v-btn>
        <a
          href="/auth/login"
          class="text-decoration-none text-primary text-center mt-3"
        >
          Already have an account? Sign in here
        </a>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
import axios from '../../utils/axios'

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      retypePassword: '',
      loading: false,
    }
  },
  computed: {
    firstNameRules() {
      return [(v) => !!v || 'First Name is required.']
    },
    lastNameRules() {
      return [(v) => !!v || 'Last Name is required.']
    },
    usernameRules() {
      return [
        (v) => !!v || 'Username is required.',
        (v) =>
          !/^[0-9!@#$%^&*]/.test(v) ||
          'Username cannot start with a digit or symbol.',
      ]
    },
    passwordRules() {
      return [
        (v) => !!v || 'Password is required.',
        (v) =>
          (v &&
            v.length >= 8 &&
            /[a-z]/.test(v) &&
            /\d/.test(v) &&
            /[A-Z]/.test(v) &&
            /[!@#$%^&*]/.test(v)) ||
          'Password must be at least 8 characters long and contain at least 1 letter, 1 digit, 1 uppercase letter, and 1 symbol.',
      ]
    },
    retypePasswordRules() {
      return [
        (v) => !!v || 'Confirm Password is required.',
        (v) => v === this.password || 'Passwords do not match.',
      ]
    },
  },
  methods: {
    async signup(event) {
      try {
        this.loading = true
        const validation = await event
        if (!validation.valid) return

        await axios.post('/auth/signup', {
          firstname: this.firstName,
          lastname: this.lastName,
          username: this.username,
          password: this.password,
        })

        this.$router.push('/auth/login')
      } catch (error) {
        if (error.response.status === 400) {
          this.errors.username = 'Username is already taken.'
        }
      } finally {
        this.loading = false
      }
    },
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
