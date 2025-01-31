<template>
  <div v-if="user == null && register == false" class="container">
    <div class="card">
      <h1>Login</h1>
      <p>Welcome again!</p>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">Username or Email</label>
          <input
            type="text"
            id="username"
            v-model="username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
          />
        </div>

        <div class="form-footer">
          <button type="submit">Enter</button>
        </div>
      </form>      

      <p class="signup">
        Don't have an account yet?
        <a @click="register = true" class="register-link">
          <b> Register here! </b></a
        >
      </p>
      
      <p class="reset">
        Forgot your password?
        <a @click="resetPassword = true" class="reset-link">
          <b> Reset it here </b></a
        >
      </p>

      <p class="verify">
        Created an account?
        <a @click="verifyAccount = true" class="verify-link">
          <b> Verify it here! </b></a
        >
      </p>

      <!-- Reset password modal -->
      <div v-if="resetPassword" class="modal-overlay" @click.self="resetPassword = false">
        <div class="modal" @click.stop>
          <h1>Reset password</h1>
          <p>Enter your email to reset your password</p>

          <form @submit.prevent="sendResetEmail" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="text" id="email" v-model="email" />
            </div>

            <div class="form-footer">
              <button type="submit">Reset</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Verify account modal -->
      <div v-if="verifyAccount" class="modal-overlay" @click.self="verifyAccount = false">
        <div class="modal" @click.stop>
          <h1>Resend verification</h1>
          <p>Enter your email to verify your account</p>

          <form @submit.prevent="sendVerificationEmail" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="text" id="email" v-model="email" />
            </div>

            <div class="form-footer">
              <button type="submit">Resend</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
  <div v-else-if="user == null && register == true" class="container">
    <div class="card">
      <h1>Register</h1>

      <form @submit.prevent="registerUser" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" />          
        </div>

        <div class="form-group">
          <label for="birthdate">Birthdate</label>
          <input type="date" id="birthdate" v-model="birthdate" />          
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" />          
        </div>

        <div class="form-group">
          <label for="confirm_password">Confirm password</label>
          <input type="password" id="confirm_password" v-model="confirm_password" />          
        </div>

        <div class="form-footer">
          <button type="submit">Register</button>
        </div>
        
      </form>

      <p class="signup">
        Already have an account?
        <a @click="register = false" class="register-link">
          <b> Login here! </b></a
        >
      </p>
    </div>
  </div>
  <div v-else class="user-info-container">
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
</template>

  
<script setup>
  import { useAxios } from "@/composables/useAxios";
  import { DateTime } from "luxon";
  import { ref, onMounted, computed } from "vue";
  import { useToast } from "vue-toast-notification";
  import { useRouter } from "vue-router";

  const { post, get, storeToken } = useAxios();
  const $toast = useToast();
  const router = useRouter();

  const username = ref("");
  const password = ref("");
  const confirm_password = ref("");
  const email = ref("");
  const birthdate = ref(null);
  const user = ref(null);

  const register = ref(false);
  const resetPassword = ref(false);
  const verifyAccount = ref(false);

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
      router.push("/account");
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

  const sendResetEmail = () => {
    post("/auth/request-password-reset", {
      email: email.value,
    }).then(() => {
      $toast.success("Email sent successfully!", { position: "bottom" });
      resetPassword.value = false;
    }).catch(() => {
      $toast.error("Error sending email!", { position: "bottom" });
    });
  };

  const sendVerificationEmail = () => {
    post("/users/resend-verification", {email: email.value}).then(() => {
      $toast.success("Email sent successfully!", { position: "bottom" });
    }).catch(() => {
      $toast.error("Error sending email!", { position: "bottom" });
    })
  }

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
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap');

  .container {
    margin-top: 90px;
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

  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .signup, .reset, .verify {
    margin-top: 20px;
    font-size: 0.9rem;

    a {
      color: blue;
      text-decoration: none;
    }
  }

  .register-link, .reset-link, .verify-link {
    cursor: pointer;
  }

  .logout-button {
    background: $background-attention;
    align-self: center;
  }

  .logout-button:hover {
    background: #df282e;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    width: 300px;

    h2 {
      margin-top: 0;
    }

    button {
      margin-top: 10px;
    }
  }
</style>
  