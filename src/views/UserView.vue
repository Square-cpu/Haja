<template>
  <div v-if="!channel" class="section">
    <div class="container">
      <div class="box session" style="width: 500px;">

        <h1 class="title is-1" style="text-align: center;">Enter Channel</h1>
      
        <form @submit.prevent="search" class="field is-centered">

          <div class="field">
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
            <div class="navbar-menu">
              <div class="navbar-start">
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <button @click="activeTab = 'own'" :style="{ backgroundColor: activeTab === 'own' ? '#f2f2f2' : 'gray' }" style="width: 220px;" class="button is-rounded is-white">Your Channels</button>
                  </p>
                </div>
              </div>
              <div class="navbar-end">
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <button @click="activeTab = 'subscribed'" :style="{ backgroundColor: activeTab === 'subscribed' ? '#f2f2f2' : 'gray' }" style="width: 220px;" class="button is-rounded is-white">Subscribed Channels</button>
                  </p>
                </div>
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
                :authorUsername="channel.creator_username"
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
              :authorUsername="channel.creator_username"
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
        <p style="font-size: 20px;"><b>ID:</b> {{ channel.id }}</p>
        <p style="font-size: 20px;"><b>Name:</b> {{ channel.name }}</p>
        <p style="font-size: 20px;"><b>Created at:</b> {{ created_at_formatted }}</p>
        <p style="font-size: 20px;"><b>Creator:</b> {{ channel.creator_username }}</p>
      </div>

      <div v-if="user.id === channel.creator_id" class="button-container">
        <button class="delete-button" @click="showDeleteModal = true">Delete Channel</button>
        <button class="edit-button" @click="manageVideos">Manage Videos</button>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal" @click.stop>
        <h2>Delete Channel</h2>
        <p>
          Are you sure you want to <b>delete</b> this channel? 
          You will lose all videos and subscribers. This action <b>cannot</b> be undone.
        </p>
        <button class="delete-button" @click="showConfirmModal = true; showDeleteModal = false">Yes, delete</button>
        <button @click="showDeleteModal = false">Cancel</button>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false; confirmText = ''">
      <div class="modal" @click.stop>
        <h2>Confirm Deletion</h2>
        <p>Please type "DELETE CHANNEL" to confirm:</p>
        <input type="text" v-model="confirmText" />
        <button class="delete-button" @click="deleteChannel" :disabled="confirmText !== 'DELETE CHANNEL'">Delete Channel</button>
        <button @click="showConfirmModal = false; confirmText = ''">Cancel</button>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr);">
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
    <div style="margin-top: 24px;">
      <button class="button is-danger" @click="quit">Return</button>
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
  const confirmText = ref('');

  const deleteChannel = () => {
    del(`/channels/${channel.value.id}`)
      .then((response) => {
        $toast.success("Successfully deleted the channel!", { position: "bottom" });
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
    confirmText.value = '';

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
      console.log("User data received:", response.data); // Log the data
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

.navbar-menu {
  button {
    background-color: #ccc;
    font-weight: bold;
    text-decoration: none;
  }
}

// h1 {
//   font-size: 1.8rem;
//   color: black;
//   margin-bottom: 20px;
// }

// h2 {
//   font-size: 1.5rem;
//   color: #141B41;
//   margin-bottom: 10px;
// }

// p {
//   color: black;
//   margin: 5px 0 20px 0;
// }

// .channel-wrapper {
//   display: flex;
//   flex-direction: column;
//   align-items: center; /* Centers the channel-info and buttons */
//   justify-content: center;
//   text-align: center;
//   margin: 20px auto;
//   max-width: 800px; /* Limits the width of the entire content */
// }

// .channel-info {
//   background-color: #D9D9D9;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
//   width: 100%; /* Makes it responsive */
//   max-width: 600px; /* Limits its size on large screens */
// }
  
// nav {
//   display: flex;
//   gap: 1rem;
//   margin-bottom: 1rem;
// }

// button {
//   border: none;
//   cursor: pointer;
//   background-color: #007bff;
//   color: white;
//   border-radius: 10px;
//   width: 50%;

//   &:hover {
//     background-color: #0056b3;
//   }
// }

// .quit-button {
//   background: $background-attention;
//   padding: 0.5em;
//   width: 150px;
  
//   font-size: 30px;
  
//   &:hover {
//     background-color: #b90019;
//   }
// }

// .button-container {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;
//   margin-top: 20px; /* Adds spacing between channel-info and buttons */
//   width: 100%;
//   max-width: 300px; /* Prevents buttons from becoming too wide */
// }

// .delete-button,
// .edit-button {
//   width: 100%;
//   max-width: 200px;
//   padding: 10px;
//   font-size: 16px;
//   border-radius: 10px;
//   border: none;
//   cursor: pointer;
//   text-align: center;
// }

// .delete-button {
//   background-color: #f30000;

//   &:hover {
//     background-color: #cc0000;
//   }
// }

// .edit-button {
//   background-color: #007bff;

//   &:hover {
//     background-color: #0056b3;
//   }
// }

// @media (min-width: 768px) {
//   .button-container {
//     flex-direction: row;
//     justify-content: center;
//     gap: 20px; /* Adds more spacing for larger screens */
//   }
// }

// .modal-overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

// .modal {
//   background-color: #fff;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//   width: 300px;

//   h2 {
//     margin-top: 0;
//   }
// }

// .modal button {
//   margin-top: 20px;
//   margin-right: 10px;
// }
</style>
