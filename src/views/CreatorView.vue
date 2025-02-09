<template>
  <div>
    <div class="container">
      <div class="card">
        <h1 class="title is-2">Create Channel</h1>
        <form @submit.prevent="createChannel">
          <input class="input" type="text" placeholder="Name" v-model="name"/>
          <input class="input" type="password" placeholder="Password" v-model="password"/>
      
          <button class="button is-primary is-fullwidth is-rounded" type="submit" ref="button_create_channel">Create</button>
        </form>
      </div>
    </div>

    <div class="container" style="margin-top: 10px;">
      <div class="card">
        <h1 class="title is-2">Create Video</h1>
        <form @submit.prevent="createVideo">
          <input class="input" type="text" placeholder="Channel Id" v-model="channelId"/>
          <input class="input" type="text" placeholder="Title" v-model="title"/>
          <textarea class="textarea" rows="10" placeholder="Description" v-model="description"></textarea>
          <input class="input" type="text" placeholder="URL" v-model="url"/>
    
          <button class="button is-primary is-fullwidth is-rounded" type="submit" ref="button_create_video">Create</button>
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