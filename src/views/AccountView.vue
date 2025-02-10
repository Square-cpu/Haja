<template>
  <div class="container" v-if="user">
    <div class="box session">
      <h1 style="text-align: center; margin-bottom: 20px; color: white;">{{ user.username }} (ID {{ user.id }})</h1>
      <div class="box" style="background-color: #d9d9d9;">
        <div class="columns is-multiline is-2">
          <div class="column is-four-fifths"><p><b>Username:</b> {{ user.username }}</p></div>
          <div class="column is-one-fifth"><button class="button is-info is-dark is-small" @click="editUsernameModal = true">Edit</button></div>
          <div class="column is-four-fifths"><p><b>Email:</b> {{ user.email }}</p></div>
          <div class="column is-one-fifth"><button class="button is-info is-dark is-small" @click="editEmailModal = true">Edit</button></div>
          <div class="column is-full"><p><b>Created at:</b> {{ created_at_formatted }}</p></div>
          <div class="column is-full"><p><b>Birthdate:</b> {{ birthdate_formatted }}</p></div>
          <p v-if="user.role.name === 'admin'"><b>Role:</b> {{ user.role.name }}</p>
        </div>
      </div>

      <button class="button is-danger is-dark" @click="logout">Logout</button>
    </div>

    <!-- Change Username Modal -->
    <teleport to="body">
      <transition name="fade">
      <div v-if="editUsernameModal" class="modal" :class="{ 'is-active': editUsernameModal }">
        <div class="modal-background" @click="editUsernameModal = false; username = ''; password = ''"></div>
        <div class="modal-content box session">

          <h1 class="title is-3" style="color: #d9d9d9; text-align: center;">Edit username</h1>

          <form @submit.prevent="editUser" class="field is-centered">

            <div class="field">
              <div class="control has-icons-left">
                <input type="password" id="password" v-model="password" class="input" placeholder="Password" />
                <span class="icon is-left is-small">
                  <i class="material-icons">lock</i>
                </span>
              </div>
            </div>

            <div class="field">
              <div class="control has-icons-left">
                <input type="text" id="username" v-model="username" class="input" placeholder="New Username" />
                <span class="icon is-left is-small">
                  <i class="material-icons">person</i>
                </span>
              </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <button type="submit" class="button is-rounded is-white">Edit</button>
              </p>
            </div>
            
          </form>

        </div>
        <button class="modal-close is-large" aria-label="close" @click="editUsernameModal = false; username = ''; password = ''"></button>
      </div>
      </transition>
    </teleport>

    <!-- Change Email Modal -->
    <teleport to="body">
      <transition name="fade">
      <div v-if="editEmailModal" class="modal" :class="{ 'is-active': editEmailModal }">
        <div class="modal-background" @click="editEmailModal = false; username = ''; password = ''"></div>
        <div class="modal-content box session">
          
          <h1 class="title is-3" style="color: #d9d9d9; text-align: center;">Edit email</h1>
          <p class="subtitle is-6" style="color: #d9d9d9; text-align: center; margin-bottom: 20px;">You will need to verify the account again</p>

          <form @submit.prevent="editUser" class="field is-centered">

            <div class="field">
              <div class="control has-icons-left">
                <input type="password" id="password" v-model="password" class="input" placeholder="Password" />
                <span class="icon is-left is-small">
                  <i class="material-icons">lock</i>
                </span>
              </div>
            </div>

            <div class="field">
              <div class="control has-icons-left">
                <input type="email" id="email" v-model="email" class="input" placeholder="New Email" />
                <span class="icon is-left is-small">
                  <i class="material-icons">mail</i>
                </span>
              </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <button type="submit" class="button is-rounded is-white">Edit</button>
              </p>
            </div>
            
          </form>

        </div>
        <button class="modal-close is-large" aria-label="close" @click="editEmailModal = false; username = ''; password = ''"></button>
      </div>
      </transition>
    </teleport>

  </div>
  <div v-else>
    <div class="loader"></div>
    <p class="loading">Loading user information...</p>
  </div>
</template>

<script setup>
import { useAxios } from "@/composables/useAxios";
import { DateTime } from "luxon";
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";

const { get, post, put, storeToken } = useAxios();
const $toast = useToast();
const router = useRouter();

const user = ref(null);
const password = ref("");
const username = ref("");
const email = ref("");

const itsUsername = ref(false);
const itsEmail = ref(false);

const editUsernameModal = ref(false);
const editEmailModal = ref(false);

const created_at_formatted = computed(() => {
  return DateTime.fromISO(user.value.created_at).toFormat("dd/MM/yyyy HH:mm");
});

const birthdate_formatted = computed(() => {
  return DateTime.fromISO(user.value.birthdate).toFormat("dd/MM/yyyy");
});

const fetchUser = () => {
  get("/users/me").then((response) => {
    user.value = response.data;
  }).catch((error) => {
    console.error("Error fetching user:", error);
    $toast.error("An error occurred while fetching user information.");
  });
};

const logout = () => {
  user.value = null;
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  $toast.info("Logout successful!", { position: "bottom" });
  router.push("/login");
};

const editUser = () => {
  if (!password.value || (!username.value && !email.value)) {
    $toast.error("Please fill in all fields!", { position: "top" });
    return;
  } 

  post("/auth/confirm-password", { password: password.value }).then((response) => {
    if (response.status === 200) {

      itsUsername.value = username.value.trim() !== "";
      itsEmail.value = email.value.trim() !== "";

      put("/users/", { username: username.value, email: email.value }).then((response) => {
        $toast.success("User updated successfully!", { position: "bottom" });        
        
        if (itsUsername.value) {
          login();
        } else if (itsEmail.value) {
          router.push("/login");
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
        }

        editUsernameModal.value = false;
        editEmailModal.value = false;
        username.value = "";
        email.value = "";
        password.value = "";

        itsUsername.value = false;
        itsEmail.value = false;

      }).catch((error) => {
        editUsernameModal.value = false;
        editEmailModal.value = false;
        username.value = "";
        email.value = "";
        password.value = "";

        if (error.response?.status === 404) {
          $toast.info("Needs to be different than the old one.", { position: "bottom" });
        } else if (error.response?.status === 409) {
          $toast.error("Not available.", { position: "bottom" });
        } else {
          console.error("Error updating user:", error);
          $toast.error("An error occurred. Please try again later.");
        }
      });
    }
  }).catch((error) => {
    editUsernameModal.value = false;
    editEmailModal.value = false;
    username.value = "";
    email.value = "";
    password.value = "";

    if (error.response?.status === 401) {
      $toast.error("Wrong password.", { position: "bottom" });
    } else {
      console.error("Error confirming password: ", error);
      $toast.error("An error occurred. Please try again later.");
    }    
  });
};

const login = () => {
  post("/auth/login", {
    username: username.value,
    password: password.value,
  })
  .then((response) => {
    storeToken(response.data.access_token);
    fetchUser();
  })
};

onMounted(() => {
  if (localStorage.getItem("authToken")) {
    fetchUser();
  }
});
</script>

  
<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap');

  .session {
    padding: 40px 30px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: left;
    width: auto;
    max-width: 500px;
  }

  h1 {
    font-size: 1.8rem;
    color: black;
    margin-bottom: 10px;
  }

  p {
    color: black;
    margin: 5px 0 20px 0;
  }

  .loading {
    margin-top: 20px;
    text-align: center;    
    color: #D9D9D9;
    font-weight: bold;
    font-size: 2rem;
  }

  .loader {
    margin: auto;
    margin-top: 250px;
    border: 16px solid #dddddd; /* Light grey */
    border-top: 16px solid #005994; /* Blue */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>