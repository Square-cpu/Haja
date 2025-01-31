<template>
  <div class="user-info-container" v-if="user">
    <div class="user-info">
      <h1 style="text-align: center; margin-bottom: 20px;">{{ user.username }} (ID {{ user.id }})</h1>
      <p><b>Username:</b> {{ user.username }}</p>
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Created at:</b> {{ created_at_formatted }}</p>
      <p><b>Birthdate:</b> {{ birthdate_formatted }}</p>
      <p v-if="user.role.name === 'admin'"><b>Role:</b> {{ user.role.name }}</p>

      <button class="logout-button" @click="logout">Logout</button>
    </div>
  </div>
  <div v-else>
    <p id="loading">Loading user information...</p>
  </div>
</template>

<script setup>
import { useAxios } from "@/composables/useAxios";
import { DateTime } from "luxon";
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";

const { get } = useAxios();
const $toast = useToast();
const router = useRouter();

const user = ref(null);

const created_at_formatted = computed(() => {
  return DateTime.fromISO(user.value.created_at).toFormat("dd/MM/yyyy HH:mm");
});

const birthdate_formatted = computed(() => {
  return DateTime.fromISO(user.value.birthdate).toFormat("dd/MM/yyyy");
});

const fetchUser = () => {
  get("/users/me").then((response) => {
    user.value = response.data;
  });
};

const logout = () => {
  user.value = null;
  localStorage.removeItem("authToken");
  $toast.info("Logout successful!", { position: "bottom" });
  router.push("/login");
};

onMounted(() => {
  if (localStorage.getItem("authToken")) {
    fetchUser();
  }
});
</script>

  
<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap');

  h1 {
    font-size: 1.8rem;
    color: black;
    margin-bottom: 10px;
  }

  p {
    color: black;
    margin: 5px 0 20px 0;
  }

  #loading {
    text-align: center;
    margin: 5px 0 20px 0;
    color: #D9D9D9;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .user-info-container {
    text-align: center;
    padding: 20px;
  }

  .user-info {
    text-align: left;
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;

    background-color: #D9D9D9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }

  .logout-button {
    background: $background-attention;
    align-self: center;
  }

  .logout-button:hover {
    background: #df282e;
  }
</style>