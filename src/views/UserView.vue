<template>
  <div v-if="!channel">
    <h1>UserView</h1>

    <form @submit.prevent="search">
      <input type="text" placeholder="Channel Name" v-model="name" />
      <input type="password" placeholder="Password" v-model="password" />

      <button type="submit">Enter</button>
    </form>

    <h1 style="margin-top: 100px;">Channels</h1>
    <div v-if="user === null">
      <h2>Please login first</h2>
    </div>
    <div v-else>
      <nav>
        <button @click="activeTab = 'own'">Your Channels</button>
        <button @click="activeTab = 'subscribed'">Subscribed Channels</button>
      </nav>
      <div v-if="activeTab === 'own'">
        <h2>Your Channels</h2>
        <div v-if="user.created_channels.length > 0">
          <ChannelCard
            v-for="channel in user.created_channels"
            :key="channel.id"
            :channelName="channel.name"
            :authorId="user.id"
            :created="channel.created_at"
          />
        </div>
      <div v-else>
        <p>You have not created any channels yet.</p>
      </div>        
    </div>
    <div v-else-if="activeTab === 'subscribed'">
      <h2>Subscribed Channels</h2>
      <div v-if="filteredSubscribedChannels.length > 0">
        <ChannelCard
          v-for="channel in filteredSubscribedChannels"
          :key="channel.id"
          :channelName="channel.name"
          :authorId="channel.creator_id"
          :created="channel.created_at"
        />
      </div>
      <div v-else>
        <p>You are not subscribed to any channels.</p>
      </div>
    </div>
  </div>
  </div>
  <div v-else>
    <h1>Channel</h1>
    <div class="channel-info">
      <p><b>ID:</b> {{ channel.id }}</p>
      <p><b>Name:</b> {{ channel.name }}</p>
      <p><b>Created at:</b> {{ created_at_formatted }}</p>
      <p><b>Creator:</b> {{ channel.creator_id }}</p>
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
      <button class="logout-button" @click="quit">Quit</button>
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

  const { post, get } = useAxios();

  const $toast = useToast();

  const name = ref("");
  const password = ref("");
  const channel = ref(null);
  const videos = ref([]);

  const user = ref(null);
  const activeTab = ref("own");

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
    return user.value?.subscribed_channels || [];
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
  .channel-info {
    text-align: left;
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;
  }

  .logout-button {
    background: $background-attention;
  }

  nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 0.25rem;

    &:hover {
      background-color: #0056b3;
    }
  }
</style>
