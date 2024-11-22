<template>
  <div v-if="user == null && register == false">
    <h1>Login</h1>

    <form @submit.prevent="login" class="login-form">
      <input type="text" placeholder="Username" v-model="username" />
      <input type="password" placeholder="Password" v-model="password" />

      <button type="submit" class="login-button">Enter</button>
    </form>
    <p>
      Don't have an account yet?
      <a @click="register = true" class="register-link">
        <b> Register here! </b></a
      >
    </p>
  </div>
  <div v-else-if="user == null && register == true">
    <h1>Register</h1>

    <form @submit.prevent="registerUser">
      <input type="text" placeholder="Username" v-model="username" />
      <input type="text" placeholder="Email" v-model="email" />
      <input type="date" placeholder="Birthdate" v-model="birthdate" />
      <input type="password" placeholder="Password" v-model="password" />
      <input
        type="password"
        placeholder="Confirm Password"
        v-model="confirm_password"
      />

      <button type="submit">Register</button>
    </form>
    <p>
      Already have an account?
      <a @click="register = false" class="register-link">
        <b> Login here! </b></a
      >
    </p>
  </div>
  <div v-else>
    <h1>{{ user.username }} (ID {{ user.id }})</h1>
    <div class="user-info">
      <p><b>Username:</b> {{ user.username }}</p>
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Created at:</b> {{ created_at_formatted }}</p>
      <p><b>Birthdate:</b> {{ birthdate_formatted }}</p>
      <p><b>Role:</b> {{ user.role.name }}</p>

      <button class="logout-button" @click="logout">Logout</button>
    </div>
  </div>
</template>

  
<script setup>
  import { useAxios } from "@/composables/useAxios";
  import { DateTime } from "luxon";
  import { ref, onMounted, computed } from "vue";
  import { useToast } from "vue-toast-notification";

  const { post, get, storeToken } = useAxios();
  const $toast = useToast();

  const username = ref("");
  const password = ref("");
  const confirm_password = ref("");
  const email = ref("");
  const birthdate = ref(null);
  const user = ref(null);
  const register = ref(false);

  const fetchUser = () => {
    get("/users/me").then((response) => {
      user.value = response.data;
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
        $toast.success("Login successful!", { position: "bottom" });
      })
      .catch(() => {
        $toast.error("Invalid credentials!", { position: "bottom" });
      });
  };

  const registerUser = () => {
    if (
      !username.value ||
      !password.value ||
      !email.value ||
      !birthdate.value
    ) {
      $toast.error("Missing information!", { position: "bottom" });
      return;
    }

    // Handle timezone
    let birthdateUTC = new Date(birthdate.value);
    const offset = birthdateUTC.getTimezoneOffset();
    birthdateUTC = new Date(
      birthdateUTC.getTime() - offset * 60 * 1000
    ).toISOString();

    if (username.value.includes(" ")) {
      $toast.error("Username can't have spaces!", { position: "bottom" });
      return;
    }

    if (password.value !== confirm_password.value) {
      $toast.error("Passwords need to match!", { position: "bottom" });
      return;
    }

    post("/users/", {
      username: username.value,
      password: password.value,
      email: email.value,
      birthdate: birthdateUTC,
    })
      .then(() => {
        login();
      })
      .catch(() => {
        $toast.error("Error during user creation!", { position: "bottom" });
      });
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("authToken");
    $toast.info("Logout successful!", { position: "bottom" });
  };

  const created_at_formatted = computed(() => {
    return DateTime.fromISO(user.value.created_at).toFormat("dd/MM/yyyy HH:mm");
  });

  const birthdate_formatted = computed(() => {
    return DateTime.fromISO(user.value.birthdate).toFormat("dd/MM/yyyy");
  });

  onMounted(() => {
    if (localStorage.getItem("authToken")) {
      fetchUser();
    }
  });
</script>

  
<style lang="scss" scoped>  
    .user-info {
      text-align: left;
      max-width: 350px;
      margin-left: auto;
      margin-right: auto;
    }
  
    .logout-button {
      background: $background-attention;
    }

    .register-link {
      cursor: pointer;
    }
</style>
  