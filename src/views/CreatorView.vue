<template>
  <div>
    <div class="container">
      <div class="card">
        <h1>Create Channel</h1>
        <form @submit.prevent="createChannel">
          <input type="text" placeholder="Name" v-model="name"/>
          <input type="password" placeholder="Password" v-model="password"/>
      
          <button type="submit">Create</button>
        </form>
      </div>
    </div>

    <div class="container">
      <div class="card">
        <h1>Create Video</h1>
        <form @submit.prevent="createVideo">
          <input type="text" placeholder="Channel Id" v-model="channelId"/>
          <input type="text" placeholder="Title" v-model="title"/>
          <textarea rows="15" placeholder="Description" v-model="description"></textarea>
          <input type="text" placeholder="URL" v-model="url"/>
    
          <button type="submit">Create</button>
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

  const createVideo = () => {
    post(`/channels/${channelId.value}/videos`, { title: title.value, description: description.value, url: url.value }).then((response) => {
      console.log(response);
      title.value = "";
      description.value = "";
      url.value = "";
      
      $toast.success("Video created!", { position: "bottom" });
    })
    .catch((error) => {
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
    });
  };

  const createChannel = () => {
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
    });
  };
</script>


<style lang="scss" scoped>
  h1 {
    font-size: 1.8rem;
    color: black;
    margin-bottom: 20px;
  }
</style>