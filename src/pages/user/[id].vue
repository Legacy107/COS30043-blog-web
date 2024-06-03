<template>
  <v-container class="my-20 mt-4" :key="`user-${id}`">
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
        class="d-flex justify-center mb-4 pe-md-6"
      >
        <ProfileAbout
          v-if="user && typeof following?.length === 'number'"
          :updateUser="() => user && fetchUser(user.id)"
          :userProfile="user"
          :followers="user.followers"
          :following="following"
        />
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-row class="flex-column align-center">
          <div class="post-title text-h4 font-weight-bold mb-2 ps-3 px-md-1">
            Posts
          </div>
          <div v-if="user" class="mt-3">
            <template v-if="postLoading">
              <v-row class="posts-container overflow-hidden">
                <v-col cols="12">
                  <v-skeleton-loader
                    type="image"
                    v-for="i in limit"
                    :key="`post-loading-${i}`"
                    class="mb-6"
                    width="720px"
                    height="200px"
                  />
                </v-col>
              </v-row>
            </template>

            <template v-if="!postLoading">
              <v-hover v-for="post in posts" :key="post.id">
                <template v-slot:default="{ isHovering, props }">
                  <v-row
                    v-bind="props"
                    class="position-relative posts-container"
                  >
                    <v-col cols="12">
                      <PostCard
                        :post="post"
                        :avatarUrl="user.avatar ?? ''"
                        :author="user.firstname + ' ' + user.lastname"
                        :authorId="user.id"
                      />
                    </v-col>
                    <v-fade-transition>
                      <div
                        v-if="showPostActions"
                        v-show="isHovering"
                        class="position-absolute post-edit flex-column"
                      >
                        <v-btn
                          icon="mdi-delete"
                          class="mb-2"
                          color="error"
                          @click="() => handleOpenDeleteDialog(post.id)"
                          aria-label="Delete"
                        />
                        <v-btn
                          :to="`/post/${post.id}/edit`"
                          icon="mdi-pencil"
                          class="mb-2"
                          color="primary"
                          aria-label="Edit"
                        />
                      </div>
                    </v-fade-transition>
                  </v-row>
                </template>
              </v-hover>
            </template>

            <v-pagination
              v-if="total > limit"
              v-model="page"
              :length="Math.ceil(total / limit)"
              class="mt-6 mb-10"
            />
          </div>
        </v-row>
      </v-col>
    </v-row>

    <DeletePostConfirmation
      v-if="showPostActions && deletePostTitle"
      v-model:open="openDeleteDialog"
      :postTitle="deletePostTitle"
      @submit="handleDeletePost"
    />
  </v-container>
</template>

<script lang="ts">
import PostCard from '@/components/PostCard.vue'
import ProfileAbout from '@/components/ProfileAbout.vue'
import DeletePostConfirmation from '@/components/DeletePostConfirmation.vue'
import axios from '@/utils/axios'
import { User } from '@/@types/user'
import { Post } from '@/@types/post'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Profile',
  components: {
    PostCard,
    ProfileAbout,
    DeletePostConfirmation,
  },
  data() {
    return {
      user: null,
      following: [],
      page: 1,
      limit: 5,
      total: 0,
      posts: [],
      postLoading: true,
      openDeleteDialog: false,
      deletePostId: 0,
    } as {
      user: null | User
      following: User[]
      page: number
      limit: number
      total: number
      posts: Post[]
      postLoading: boolean
      openDeleteDialog: boolean
      deletePostId: number
    }
  },
  methods: {
    fetchPosts() {
      this.postLoading = true
      const offset = (this.page - 1) * this.limit
      axios
        .get('/post', {
          params: {
            offset: offset,
            limit: this.limit,
            userId: this.id,
          },
        })
        .then(({ data }) => {
          this.posts = data.posts
          this.total = data.total
          this.postLoading = false
        })
        .catch((error) => {
          console.error(error)
          this.postLoading = false
        })
    },
    async fetchUser(id: number): Promise<User> {
      try {
        const { data } = await axios.get(`/user/${id}`)
        this.user = data
        return data
      } catch (error) {
        console.error(error)
        return {} as User
      }
    },
    async fetchFollowing(id: number) {
      try {
        const { data } = await axios.get(`/user/${id}/following`)
        this.following = data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchData(id: number) {
      this.fetchUser(id)
      this.fetchFollowing(id)
      this.fetchPosts()
    },
    handleOpenDeleteDialog(postId: number) {
      this.deletePostId = postId
      this.openDeleteDialog = true
    },
    async handleDeletePost() {
      try {
        if (!this.deletePostId) return
        await axios.delete(`/post/${this.deletePostId}`)
        this.fetchPosts()
      } catch (error) {
        console.error(error)
      }
    },
  },
  computed: {
    id() {
      const { id } = this.$route.params as unknown as { id: string }
      return parseInt(id ?? '0')
    },
    ...mapState(useAppStore, {
      currentUser: (store) => store.user,
    }),
    showPostActions() {
      return this.user?.id === this.currentUser?.id
    },
    deletePostTitle() {
      return this.posts?.find((post) => post.id === this.deletePostId)?.title
    },
  },
  mounted() {
    this.fetchData(this.id)
  },
  watch: {
    id(newId) {
      this.posts = []
      this.page = 1
      this.fetchData(newId)
    },
    page() {
      this.fetchPosts()
    },
  },
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
.post-title {
  width: 100%;
  max-width: 720px;
}
.posts-container {
  max-width: 730px;
}
.post-edit {
  display: flex;
  bottom: 1rem;
  right: 0;
  transform: translateX(-40%);
}
</style>
