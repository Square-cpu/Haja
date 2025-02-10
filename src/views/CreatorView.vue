<template>
  
  <div>
    <div v-if="!channelCreatorCard && !videoCreatorCard">
      <div class="container session" style="flex-direction: row; gap: 50px;">
        <div class="box session" @click="channelCreatorCard = true; videoCreatorCard = false">
          <span class="icon is-left is-small block">
            <i class="material-icons" style="font-size: 100px;">groups</i>
          </span>
          <h1 class="title is-1 block" style="color: #e8e8e8; text-align: center;">Create Channels</h1>
            
        </div>
        <div class="box session" @click="channelCreatorCard = false; videoCreatorCard = true">
          <span class="icon is-left is-small block">
            <i class="material-icons" style="font-size: 100px;">smart_display</i>
          </span>
          <h1 class="title is-1 block" style="color: #e8e8e8; text-align: center;">Create Videos</h1>
        </div>
      </div>
    </div>

    <div v-else-if="channelCreatorCard" class="container">
      <div class="card">
        <h1 class="title is-2">Create Channel</h1>
        <form @submit.prevent="createChannel">
          <input class="input" type="text" placeholder="Name" v-model="name" required/>
          <input class="input" type="password" placeholder="Password" v-model="password" required/>
      
          <button class="button is-primary is-fullwidth is-rounded" type="submit" ref="button_create_channel">Create</button>
          <div class="field is-grouped is-grouped-centered" style="margin-top: 24px;">
            <p class="control">
              <button class="button is-danger" @click="channelCreatorCard = false" style="font-size: 20px;">Return</button>
            </p>
          </div>
        </form>
      </div>
    </div>

    <div v-else-if="videoCreatorCard" class="container" style="margin-top: 10px;">
      <div class="card">
        <h1 class="title is-2">Create Video</h1>
        <form @submit.prevent="createVideo">
          <input class="input" type="text" placeholder="Channel Id" v-model="channelId" required/>
          <input class="input" type="text" placeholder="Title" v-model="title" required/>
          <textarea class="textarea" rows="10" placeholder="Description" v-model="description"></textarea>
          <input class="input" type="text" placeholder="URL" v-model="url" required/>
    
          <button class="button is-primary is-fullwidth is-rounded" type="submit" ref="button_create_video">Create</button>

          <div class="field is-grouped is-grouped-centered" style="margin-top: 24px;">
            <p class="control">
              <button class="button is-danger" @click="videoCreatorCard = false" style="font-size: 20px;">Return</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>
  

<script setup>
  import { ref } from "vue";
  import { useAxios } from "@/composables/useAxios";
  import { useToast } from "vue-toast-notification";

  const { post } = useAxios();

  const $toast = useToast();

  const channelId = ref("");
  const title = ref("");
  const description = ref("");
  const url = ref("");

  const name = ref("");
  const password = ref("");

  const button_create_channel = ref(null);
  const button_create_video = ref(null);

  const channelCreatorCard = ref(false);
  const videoCreatorCard = ref(false);

  const createVideo = () => {
    button_create_video.value.classList.add('is-loading');
    post(`/channels/${channelId.value}/videos`, { title: title.value, description: description.value, url: url.value }).then((response) => {
      console.log(response);
      title.value = "";
      description.value = "";
      url.value = "";
      
      $toast.success("Video created!", { position: "bottom" });
    })
    .catch((error) => {
      button_create_video.value.classList.remove('is-loading');
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          $toast.error("You need to login first!", { position: "bottom" });
        } else if (status === 403) {
          $toast.error("You don't have access to this channel!", { position: "bottom" });
        } else if (status === 404) {
          $toast.error("Channel not found!", { position: "bottom" });
        } else {
          $toast.error("An unexpected error occurred.", { position: "bottom" });
        }
      } else {
        $toast.error(
          "Unable to reach the server. Please check your connection.",
          {
            position: "bottom",
          }
        );
      }
    })
    .finally(() => {
     button_create_video.value.classList.remove('is-loading');
    });
  };

  const createChannel = () => {
    button_create_channel.value.classList.add('is-loading');

    post("/channels/", { name: name.value, password: password.value }).then((response) => {
      console.log(response);

      post("/channels/search", {
        name: name.value,
        password: password.value,
      })
      
      name.value = "";
      password.value = "";
      
      $toast.success("Channel created!", { position: "bottom" });

    })
    .catch((error) => {
      button_create_channel.value.classList.remove('is-loading');
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          $toast.error("You need to login first!", { position: "bottom" });
        } else {
          $toast.error("An unexpected error occurred.", { position: "bottom" });
        }
      } else {
        $toast.error(
          "Unable to reach the server. Please check your connection.",
          {
            position: "bottom",
          }
        );
      }
    })
    .finally(() => {
      button_create_channel.value.classList.remove('is-loading');
    });
  };
</script>


<style lang="scss" scoped>
  .session {
    padding: 40px 30px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    gap: 20px;
  }

  .box {
    cursor: pointer;

    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  .container .input, textarea {
    margin-bottom: 10px;
  }
  .container {
    padding: 5vw 10vw 5vw 10vw;
  }
  .card{
    padding: 15%;
  }
</style>