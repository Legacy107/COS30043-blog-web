<template>
  <v-dialog v-model="_open" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">Edit Profile</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <v-file-input
                  label="Avatar"
                  v-model="_avatar"
                  prepend-icon="mdi-camera"
                  accept="image/*"
                  clearable
                  variant="outlined"
                  :rules="rules.avatar"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="First Name"
                  v-model="_firstName"
                  variant="outlined"
                  :rules="rules.firstname"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Last Name"
                  v-model="_lastName"
                  variant="outlined"
                  :rules="rules.lastname"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Bio"
                  v-model="_bio"
                  variant="outlined"
                  counter
                  :rules="rules.bio"
                />
              </v-col>

              <v-col class="d-flex justify-end">
                <v-btn color="primary" type="submit" :loading="loading">
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: Array<File>,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  emits: [
    'update:open',
    'update:avatar',
    'update:firstName',
    'update:lastName',
    'update:bio',
  ],
  data() {
    return {
      rules: {
        avatar: [
          (value: File[]) => {
            return (
              !value ||
              !value.length ||
              value[0].size < 2000000 ||
              'Thumbnail size should be less than 2 MB!'
            )
          },
        ],
        firstname: [
          (value: string) => !!value || 'First Name is required',
          (value: string) =>
            value.length <= 45 || 'First Name must be less than 45 characters',
        ],
        lastname: [
          (value: string) => !!value || 'Last Name is required',
          (value: string) =>
            value.length <= 45 || 'Last Name must be less than 45 characters',
        ],
        bio: [
          (value: string) =>
            value.length <= 3000 || 'Bio must be less than 3000 characters',
        ],
      },
      loading: false,
    }
  },
  computed: {
    _open: {
      get() {
        return this.open
      },
      set(value: boolean) {
        this.$emit('update:open', value)
      },
    },
    _avatar: {
      get() {
        return this.avatar
      },
      set(value: string) {
        this.$emit('update:avatar', value)
      },
    },
    _firstName: {
      get() {
        return this.firstName
      },
      set(value: string) {
        this.$emit('update:firstName', value)
      },
    },
    _lastName: {
      get() {
        return this.lastName
      },
      set(value: string) {
        this.$emit('update:lastName', value)
      },
    },
    _bio: {
      get() {
        return this.bio
      },
      set(value: string) {
        this.$emit('update:bio', value)
      },
    },
  },
  methods: {
    async handleSubmit(event: any) {
      try {
        this.loading = true
        const validation = await event
        if (!validation.valid) return

        await this.onSubmit()
        this._open = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
