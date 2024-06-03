<template>
  <v-dialog max-width="600" activator="parent">
    <v-card class="py-4">
      <v-card-title>
        <div class="text-h5">Share this post on</div>
      </v-card-title>
      <v-card-text class="d-flex flex-column align-center w-100">
        <div>
          <facebook-button :url="url" :isBlank="false" btnText />
          <twitter-button
            :url="url"
            :description="title"
            :isBlank="false"
            btnText
          />
          <linked-in-button :url="url" :isBlank="false" btnText />
          <telegram-button
            :url="url"
            :description="title"
            :isBlank="false"
            btnText
          />
        </div>

        <div class="my-5 text-subtitle-1">Or share with link</div>

        <v-text-field
          :value="url"
          variant="outlined"
          class="w-100"
          hide-details
          density="comfortable"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-content-copy"
              variant="plain"
              @click="copyLink"
              slim
              aria-label="Copy link"
            >
              <v-icon>mdi-content-copy</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ copyTooltip }}
              </v-tooltip>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FacebookButton from 'vue-share-buttons/src/components/FacebookButton'
import TwitterButton from 'vue-share-buttons/src/components/TwitterButton'
import LinkedInButton from 'vue-share-buttons/src/components/LinkedInButton'
import TelegramButton from 'vue-share-buttons/src/components/TelegramButton'

export default {
  components: {
    FacebookButton,
    TwitterButton,
    LinkedInButton,
    TelegramButton,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    copied: false,
  }),
  computed: {
    copyTooltip() {
      return this.copied ? 'Copied!' : 'Copy'
    },
  },
  methods: {
    copyLink() {
      this.$copyText(this.url).then(() => {
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      })
    },
  },
}
</script>
