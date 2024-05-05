<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12">
        <div class="text-h2 font-weight-bold">{{ post.title }}</div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-avatar class="ms-0 ma-3" size="48">
            <v-img :src="authorAvatar"></v-img>
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="text-body-1 font-weight-medium">{{ author }}</span>
            <span class="text-caption">{{ post.date }}</span>
          </div>
          <v-btn class="ms-auto" variant="tonal">Follow</v-btn>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex flex-column ga-1">
          <v-divider />
          <PostAction
            :id="id"
            :noLikes="likes"
            :noComments="comments"
            :author="author"
          />
          <v-divider />
        </div>
      </v-col>
      <v-col cols="12">
        <Markdown :breaks="true" :source="post.content" />
      </v-col>
      <v-col cols="12" class="mt-6">
        <div class="text-h6 mb-1 font-weight-bold">Tags</div>
        <v-chip-group column>
          <v-chip
            v-for="(tag, i) in tags"
            :key="i"
            class="ma-1"
            color="primary"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12">
        <PostAction
          :id="id"
          :noLikes="likes"
          :noComments="comments"
          :author="author"
          :onOpenComments="handleOpenComments"
        />
      </v-col>

      <v-col cols="12">
        <v-expand-transition>
          <CommentSection v-show="openComments" />
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Markdown from 'vue3-markdown-it'
import CommentSection from '@/components/CommentSection.vue'
import PostAction from '@/components/PostAction.vue'

export default {
  name: 'Post',
  components: {
    Markdown,
    CommentSection,
    PostAction,
  },
  data() {
    return {
      openComments: false,
      post: {
        id: 1,
        title: 'Post 1',
        date: '2021-01-01',
        description:
          'Description for post 1 Description for post 1 Description for post 1 Description for post 1 Description for post 1 Description for post 1',
        // content: '# Hello',
        content: `
  # The Art of Mindful Living: Finding Peace in Chaos
  
  In today's fast-paced world, finding peace and tranquility can seem like a daunting task. With constant notifications, endless to-do lists, and the pressures of everyday life, it's easy to feel overwhelmed and stressed. However, there is a way to find balance and serenity amidst the chaos: the art of mindful living.
  
  ## What is Mindful Living?
  
  Mindful living is the practice of being fully present and engaged in the current moment, without judgment or distraction. It's about cultivating awareness of your thoughts, feelings, and actions, and choosing to respond rather than react to life's challenges. By practicing mindfulness, you can reduce stress, improve your focus and concentration, and enhance your overall well-being.
  
  ## Tips for Practicing Mindful Living
  
  ### 1. Start Your Day with Intention
  
  Instead of reaching for your phone first thing in the morning, take a few moments to set an intention for the day. This could be as simple as expressing gratitude or setting a positive affirmation. Starting your day with intention can help you create a sense of purpose and direction.
  
  ### 2. Practice Mindful Breathing
  
  Throughout the day, take a few moments to focus on your breath. Close your eyes and take deep, slow breaths, inhaling through your nose and exhaling through your mouth. This simple practice can help calm your mind and reduce stress.
  
  ### 3. Be Present in Everyday Activities
  
  Whether you're eating, walking, or talking to someone, try to be fully present in the moment. Pay attention to the sensations, sights, and sounds around you. By being present, you can fully experience life's moments and appreciate the beauty of the here and now.
  
  ### 4. Embrace Mindful Eating
  
  Instead of rushing through meals or eating on the go, take the time to savor each bite. Chew slowly, and pay attention to the flavors, textures, and aromas of your food. Mindful eating can help you develop a healthier relationship with food and improve digestion.
  
  ## The Benefits of Mindful Living
  
  - Reduced stress and anxiety
  - Improved focus and concentration
  - Enhanced self-awareness
  - Better emotional regulation
  - Increased happiness and contentment
  
  In conclusion, the art of mindful living offers a pathway to finding peace and balance in our busy lives. By practicing mindfulness, we can cultivate a deeper connection with ourselves and the world around us, leading to greater happiness and well-being.
  
  So, why not start incorporating mindfulness into your daily routine today? Your future self will thank you!
        `,
      },
      author: 'Author 1',
      authorAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      image: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
      likes: 10,
      comments: 5,
      tags: ['Mindfulness', 'Wellness', 'Self-Care'],
    }
  },
  methods: {
    handleOpenComments() {
      this.openComments = !this.openComments
    },
  },
  mounted() {
    const id = this.$route.params.id
    console.log('Fetching post ID:', id)
  },
}
</script>

<style scoped>
.v-container {
  max-width: 680px;
}
</style>
