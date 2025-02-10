<template>
  <div v-if="!channel" class="section">
    <div class="container">
      <div class="box session" style="width: 500px;">

        <h1 class="title is-1" style="text-align: center;">Enter Channel</h1>
      
        <form @submit.prevent="search" class="field is-centered">

          <div class="field search-form">
            <div class="control has-icons-left">
              <input type="text" id="name" v-model="name" class="input" placeholder="Channel Name"/>
              <span class="icon is-left is-small">
                <i class="material-icons">search</i>
              </span>
            </div>

            <div class="control has-icons-left">
              <input type="password" id="password" v-model="password" class="input" placeholder="Password"/>
              <span class="icon is-left is-small">
                <i class="material-icons">lock</i>
              </span>
            </div>
          </div>

          <div class="field is-grouped is-grouped-centered">
            <p class="control">
              <button type="submit" class="button is-rounded is-white">Enter</button>
            </p>
          </div>

        </form>
      </div>
    </div>

    <div class="container" style="margin-top: 20px;">
      <div class="box session" style="width: 500px;">

        <h1 class="title is-1" style="text-align: center;">Channels</h1>

        <div v-if="user === null">
          <h2 class="title is-3">Please login first</h2>
        </div>
        <div v-else>

          <nav class="navbar">
            <div class="navbar-start" style="margin-bottom: 10px;">
              <div class="field is-grouped is-grouped-centered">
                <p class="control">
                  <button @click="activeTab = 'own'" :style="{ backgroundColor: activeTab === 'own' ? '#f2f2f2' : 'gray' }" style="width: 220px;" class="button is-rounded is-white">Your Channels</button>
                </p>
              </div>
            </div>
            <div class="navbar-end" style="margin-bottom: 10px;">
              <div class="field is-grouped is-grouped-centered">
                <p class="control">
                  <button @click="activeTab = 'subscribed'" :style="{ backgroundColor: activeTab === 'subscribed' ? '#f2f2f2' : 'gray' }" style="width: 220px;" class="button is-rounded is-white">Subscribed Channels</button>
                </p>
              </div>
            </div>
          </nav>

          <div v-if="activeTab === 'own'">
            <h2 class="title is-4" style="text-align: center;">Your Channels</h2>
            <div v-if="user.created_channels.length > 0">
              <ChannelCard
                v-for="channel in user.created_channels"
                :key="channel.id"
                :channelName="channel.name"
                :channelId="channel.id"
                :created="channel.created_at"
                @click="fetchChannel(channel.id)"
              />
            </div>
            <div v-else>
              <p class="subtitle is-6" style="text-align: center;">You have not created any channels yet.</p>
            </div>        
        </div>
        <div v-else-if="activeTab === 'subscribed'">
          <h2 class="title is-4" style="text-align: center;">Subscribed Channels</h2>
          <div v-if="filteredSubscribedChannels.length > 0">
            <ChannelCard
              v-for="channel in filteredSubscribedChannels"
              :key="channel.id"
              :channelName="channel.name"
              :channelId="channel.id"
              :created="channel.created_at"
              @click="fetchChannel(channel.id)"
            />
          </div>
          <div v-else>
            <p class="subtitle is-6" style="text-align: center;">You are not subscribed to any channels.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <div v-else class="section">
    <div class="container">
      <div class="box session channel-card">
        <h1 class="title is-1" style="text-align: center;">Channel</h1>
        <div class="box" style="background-color: #d9d9d9;">
          <p><b>ID:</b> {{ channel.id }}</p>
          <p><b>Name:</b> {{ channel.name }}</p>
          <p><b>Created at:</b> {{ created_at_formatted }}</p>
          <p><b>Creator:</b> {{ channel.creator_username }}</p>
        </div>
      </div>

      <div v-if="user.id === channel.creator_id" class="container">
        <div class="navbar is-centered" style="margin-top: 30px;">
          <div class="navbar-end" style="margin-bottom: 10px;">
            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <button @click="showDeleteModal = true" style="width: 220px;" class="button is-rounded is-danger">Delete Channel</button>
              </p>
            </div>
          </div>
          <div class="navbar-end" style="margin-bottom: 10px;">
            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <button @click="manageVideos" style="width: 220px;" class="button is-rounded is-info">Manage Videos</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <teleport to="body">
    <transition name="fade">
    <div v-if="showDeleteModal" class="modal" :class="{ 'is-active': showDeleteModal }">
      <div class="modal-background" @click="showDeleteModal = false"></div>
      <div class="modal-content box session">

        <h1 class="title is-3" style="text-align: center;">Delete Channel</h1>
        <p class="subtitle is-6" style="margin-top: 20px; text-align: justify;">
          Are you sure you want to <b>delete</b> this channel? 
          You will lose all videos and subscribers. This action <b>cannot</b> be undone.
        </p>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button class="button is-rounded is-danger" @click="showConfirmModal = true; showDeleteModal = false">Yes, delete</button>
          </p>
        </div>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button class="button is-rounded is-info" @click="showDeleteModal = false">Cancel</button>
          </p>
        </div>

      </div>
      <button class="modal-close is-large" aria-label="close" @click="showDeleteModal = false"></button>
    </div>
    </transition>
    </teleport>

    <!-- Confirm Modal -->
    <teleport to="body">
    <transition name="fade">
    <div v-if="showConfirmModal" class="modal" :class="{ 'is-active': showConfirmModal }">
      <div class="modal-background" @click="showConfirmModal = false"></div>
      <div class="modal-content box session">

        <h1 class="title is-3" style="text-align: center;">Confirm Deletion</h1>

        <p class="subtitle is-6" style="margin-top: 20px; text-align: justify;">
          Please type "DELETE CHANNEL" to confirm:
        </p>

        <div class="field">
          <input class="input" type="text" v-model="confirmText1" />
        </div>

        <p class="subtitle is-6" style="margin-top: 20px; text-align: justify;">
          Please type the channels name to confirm:
        </p>

        <div class="field">
          <input class="input" type="text" v-model="confirmText2" />
        </div>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button class="button is-rounded is-danger" @click="deleteChannel" :disabled="confirmText1 !== 'DELETE CHANNEL' || confirmText2 !== channel.name">Delete</button>
          </p>
        </div>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button class="button is-rounded is-info" @click="showConfirmModal = false">Cancel</button>
          </p>
        </div>

      </div>
      <button class="modal-close is-large" aria-label="close" @click="showConfirmModal = false"></button>
    </div>
    </transition>
    </teleport>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 20px;">
        <VideoCard 
          v-for="video in videos"
          :key="video.id"
          :videoLink="video.videoLink"
          :author="video.author"
          :created="formatDate(video.created)"
          :id="video.id"
          :title="video.title"
          :description="video.description"
        />
    </div>

    <div class="field is-grouped is-grouped-centered" style="margin-top: 24px;">
      <p class="control">
        <button class="button is-danger" @click="quit" style="padding: 20px 25px; font-size: 20px;">Return</button>
      </p>
    </div>
  </div>
</template>

<script setup>
  import VideoCard from "@/components/VideoCard.vue";
  import ChannelCard from "@/components/ChannelCard.vue";
  import { onMounted, ref, computed } from "vue";
  import { useAxios } from "@/composables/useAxios";
  import { useToast } from "vue-toast-notification";
  import { DateTime } from "luxon";
  
  const { post, get, del } = useAxios();
  
  const $toast = useToast();
  
  const name = ref("");
  const password = ref("");
  const channel = ref(null);
  const videos = ref([]);
  
  const user = ref(null);
  const activeTab = ref("own");
  
  const showDeleteModal = ref(false);
  const showConfirmModal = ref(false);
  const confirmText1 = ref('');
  const confirmText2 = ref('');

  const deleteChannel = () => {
    del(`/channels/${channel.value.id}`)
      .then((response) => {
        $toast.success("Successfully deleted the channel!", { position: "bottom" });
        get("/users/me").then((response) => {
          user.value = response.data;
        })
      })
      .catch((error) => {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;
          $toast.error(`Error ${status}: ${message}`, { position: "bottom" });
        }
      });

    showConfirmModal.value = false;
    showDeleteModal.value = false;
    confirmText1.value = '';
    confirmText2.value = '';

    channel.value = null;
  }

  const fetchChannel = (channelId) => {
    get(`/channels/${channelId}`).then((response) => {
      channel.value = response.data;
    });
    
    get(`/channels/${channelId}/videos`).then((response) => {
      videos.value = response.data.map(video => ({        
        videoLink: video.url,
        title: video.title,
        author: video.creator,
        created: video.created_at,
        description: video.description || "",  // Provide an empty string if description is missing
      }));
    });
  };

  const search = () => {
    post("/channels/search", {
      name: name.value,
      password: password.value,
    }).then((response) => {
      fetchChannel(response.data.channel_id);
      $toast.success("Successfully accessed the channel!", { position: "bottom" });
    }).catch((error) => {
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          $toast.error("You need to login first!", { position: "bottom" });
        } else if (status === 403) {
          $toast.error("Wrong password!", { position: "bottom" });
        }
      } else {
        $toast.error(
          "Unable to reach the server. Please check your connection.",
          {
            position: "bottom",
          }
        );
      }
    });
  };

  const quit = () => {
    channel.value = null;
    videos.value = [];
  };

  const created_at_formatted = computed(() => {
    return DateTime.fromISO(channel.value.created_at).toFormat("dd/MM/yyyy HH:mm");
  });

  const formatDate = (date) => {
    return DateTime.fromISO(date).toFormat("dd/MM/yyyy HH:mm");
  };

  const filteredSubscribedChannels = computed(() => {
    return user.value?.subscribed_channels.filter(channel => channel.creator_id !== user.value.id) || [];
  });

  onMounted(async () => {
    try {
      const response = await get("/users/me"); // Adjust the endpoint as needed
      //console.log("User data received:", response.data); // Log the data
      user.value = response.data; // Set the user if authenticated
    } catch (error) {
      $toast.warning("Please login", { position: "bottom" });
      user.value = null; // Ensure user is null if not authenticated
    }
  });
</script>

<style lang="scss" scoped>
.session {
  width: auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  margin: auto auto;
}

.search-form {
  .input {
    margin-bottom: 10px;
    border: none;
    border-bottom: 1px solid #fdfdfd97;
    --bulma-input-radius: 0rem;
  }

  input:focus {
    --bulma-input-focus-h: none;
  }
}

.channel-card {
  p {
    font-size: 20px;
    color: #0e0e0e
  }
}

.navbar-menu {
  button {
    background-color: #ccc;
    font-weight: bold;
    text-decoration: none;
  }
}

.navbar {
  width: auto;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
</style>
