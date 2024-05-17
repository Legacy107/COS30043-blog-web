<template>
  <div class="container">
    <v-row>
      <v-col cols="12">
        <v-avatar size="100" color="primary">
          <v-img
            v-if="userProfile.avatar"
            :src="userProfile.avatar"
            :alt="userProfile.firstname"
          />
          <span v-else class="text-h5">
            {{ userProfile.firstname?.[0] }}
          </span>
        </v-avatar>
      </v-col>
      <v-col cols="12">
        <h2>{{ userProfile.firstname }} {{ userProfile.lastname }}</h2>
        <p>{{ followers }} Followers</p>
        <p class="my-4">{{ userProfile.bio }}</p>
        <template v-if="user">
          <template v-if="user.id !== userProfile.id">
            <v-btn
              v-if="isFollowing(userProfile)"
              color="primary"
              @click="() => handleUnfollowUser(userProfile)"
            >
              Following
            </v-btn>
            <v-btn
              v-else
              color="primary"
              variant="outlined"
              @click="() => handleFollowUser(userProfile)"
            >
              Follow
            </v-btn>
          </template>

          <template v-else>
            <v-btn color="primary" @click="openEdit = true">
              Edit Profile
              <ProfileEditDialog
                v-model:open="openEdit"
                v-model:avatar="editProfile.avatar"
                v-model:firstName="editProfile.firstname"
                v-model:lastName="editProfile.lastname"
                v-model:bio="editProfile.bio"
                @submit="handleEditProfile"
              />
            </v-btn>
          </template>
        </template>
      </v-col>
    </v-row>
    <div v-if="followingUsers.length" class="mt-10">
      <div class="text-h6">Following</div>
      <v-list density="compact" bg-color="transparent" slim>
        <v-hover v-for="followingUser in following" :key="followingUser.id">
          <template v-slot:default="{ isHovering, props }">
            <v-list-item
              :prepend-avatar="followingUser.avatar"
              v-bind="props"
              class="text-white ps-0"
              height="48"
            >
              <template v-slot:prepend>
                <router-link
                  :to="`/user/${followingUser.id}`"
                  class="text-decoration-none"
                >
                  <v-avatar size="24" color="primary" class="me-2">
                    <v-img
                      v-if="followingUser.avatar"
                      :src="followingUser.avatar"
                      :alt="followingUser.firstname"
                    />
                    <span v-else class="text-body">
                      {{ followingUser.firstname?.[0] }}
                    </span>
                  </v-avatar>
                </router-link>
              </template>

              <router-link
                :to="`/user/${followingUser.id}`"
                class="text-decoration-none"
              >
                <div
                  :class="
                    'text-white ' +
                    (isHovering
                      ? 'text-decoration-underline'
                      : 'text-decoration-none')
                  "
                >
                  {{ followingUser.firstname }} {{ followingUser.lastname }}
                </div>
              </router-link>

              <template v-slot:append>
                <v-menu
                  location="top center"
                  transition="fade-transition"
                  open-on-hover
                  :close-on-content-click="false"
                  origin="bottom center"
                  offset="5"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-horizontal"
                      variant="text"
                      v-bind="props"
                      class="text-decoration-none"
                    >
                    </v-btn>
                  </template>
                  <v-card
                    :title="`${followingUser.firstname} ${followingUser.lastname}`"
                    max-width="300"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary">
                        <v-img
                          v-if="followingUser.avatar"
                          :src="followingUser.avatar"
                          :alt="followingUser.firstname"
                        />
                        <span v-else class="text-body">
                          {{ followingUser.firstname?.[0] }}
                        </span>
                      </v-avatar>
                    </template>

                    <v-card-text>
                      <div>{{ followingUser.bio }}</div>
                      <div
                        class="d-flex justify-space-between mt-4 pt-4 border-t-sm align-center"
                      >
                        <div>
                          {{
                            followingUser.followers +
                            (followersDeltas[followingUser.id] ?? 0)
                          }}
                          {{ ' Followers' }}
                        </div>
                        <template v-if="user && followingUser.id !== user.id">
                          <v-btn
                            v-if="isFollowing(followingUser)"
                            color="primary"
                            size="x-small"
                            @click="
                              () => handleUnfollowUserFromList(followingUser)
                            "
                          >
                            Following
                          </v-btn>
                          <v-btn
                            v-else
                            color="primary"
                            variant="outlined"
                            size="x-small"
                            @click="
                              () => handleFollowUserFromList(followingUser)
                            "
                          >
                            Follow
                          </v-btn>
                        </template>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </v-list-item>
          </template>
        </v-hover>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { useAppStore } from '@/stores/app'
import { mapActions, mapState } from 'pinia'
import { defineComponent, PropType } from 'vue'
import { User } from '@/@types/user'
import ProfileEditDialog from '@/components/ProfileEditDialog.vue'
import axios from '@/utils/axios'

export default defineComponent({
  name: 'ProfileAbout',
  components: {
    ProfileEditDialog,
  },
  props: {
    userProfile: {
      type: Object as PropType<User>,
      required: true,
    },
    following: {
      type: Array as PropType<User[]>,
      required: true,
    },
    updateUser: {
      type: Function,
      default: () => {},
    },
  },
  data: () =>
    ({
      followersDelta: 0,
      followersDeltas: {} as Record<number, number>,
      openEdit: false,
      editProfile: {
        avatar: [],
        firstname: '',
        lastname: '',
        bio: '',
      },
    }) as {
      followersDelta: number
      followersDeltas: Record<number, number>
      openEdit: boolean
      editProfile: {
        avatar: File[]
        firstname: string
        lastname: string
        bio: string
      }
    },
  methods: {
    async handleFollowUser(user: User) {
      try {
        await this.followUser(user)
        this.followersDelta++
      } catch (error) {
        console.error(error)
      }
    },
    async handleUnfollowUser(user: User) {
      try {
        await this.unfollowUser(user)
        this.followersDelta--
      } catch (error) {
        console.error(error)
      }
    },
    async handleFollowUserFromList(user: User) {
      try {
        await this.followUser(user)
        this.followersDeltas[user.id] = (this.followersDeltas[user.id] ?? 0) + 1
      } catch (error) {
        console.error(error)
      }
    },
    async handleUnfollowUserFromList(user: User) {
      try {
        await this.unfollowUser(user)
        this.followersDeltas[user.id] = (this.followersDeltas[user.id] ?? 0) - 1
      } catch (error) {
        console.error(error)
      }
    },
    async handleEditProfile() {
      const formData = new FormData()
      formData.append('firstname', this.editProfile.firstname)
      formData.append('lastname', this.editProfile.lastname)
      formData.append('bio', this.editProfile.bio)
      if (this.editProfile.avatar.length > 0)
        formData.append('avatar', this.editProfile.avatar[0])

      await axios.put('/user', formData)
      this.updateUser()
    },
    ...mapActions(useAppStore, [
      'fetchFollowing',
      'followUser',
      'unfollowUser',
      'isFollowing',
    ]),
  },
  computed: {
    followers() {
      return this.userProfile.followers + this.followersDelta
    },
    ...mapState(useAppStore, ['user', 'followingUsers']),
  },
  mounted() {
    this.fetchFollowing()
  },
  watch: {
    userProfile: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal.id !== oldVal?.id)
          this.editProfile = {
            avatar: [],
            firstname: newVal.firstname,
            lastname: newVal.lastname,
            bio: newVal.bio,
          }
      },
    },
  },
})
</script>

<style scoped>
.container {
  position: sticky;
  top: 1rem;
  max-width: 720px;
}
</style>
