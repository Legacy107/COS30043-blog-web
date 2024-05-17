<template>
  <v-dialog v-model="_open" max-width="400">
    <v-card>
      <v-card-title class="headline">Delete confirmation</v-card-title>
      <v-card-text>
        Are you sure to delete the post titled
        <span class="text-error font-weight-bold">{{ postTitle }}.</span>
        This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="handleClose">Cancel</v-btn>
        <v-btn color="error" text @click="confirmDelete" :loading="loading">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    postTitle: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:open'],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    _open: {
      get() {
        return this.open
      },
      set(value) {
        this.$emit('update:open', value)
      },
    },
  },
  methods: {
    async confirmDelete() {
      try {
        this.loading = true
        await this.onSubmit()
        this.handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      this._open = false
    },
  },
}
</script>
