<template>
<body class="login-body">   
  
  <transition name="slide" mode="out-in">
  <div v-if="user == null && register == false" key="login">
    <div class="box log-in session">
      <h1 class="title is-1">HAJA</h1>

      <form @submit.prevent="login" class="field is-centered">
        <div class="field">
          <div class="control has-icons-left">
            <input type="text" id="username" v-model="username" class="input" placeholder="Username or Email"/>
            <span class="icon is-left is-small">
              <i class="material-icons">mail</i>
            </span>
          </div>

          <div class="control has-icons-left">
            <input type="password" id="password" v-model="password" class="input" placeholder="Password"/>
            <span class="icon is-left is-small">
              <i class="material-icons">lock_open</i>
            </span>
          </div>
        </div>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button type="submit" class="button is-rounded is-white" ref="login_button">Login</button>
          </p>
        </div>
      </form>
      
      <div class="buttons is-centered" style="margin-top: 20px;">

        <button class="button" title="Register here!" @click="register = true">
          <span class="icon material-icons">person_add</span>
        </button>

        <button class="button" title="Verify your account" @click="verifyAccount = true">
          <span class="icon material-icons">verified_user</span>
        </button>

        <button class="button" title="Reset your password" @click="resetPassword = true">
          <span class="icon material-icons">lock_reset</span>
        </button>

      </div>

      <!-- Verify Account Modal -->
      <teleport to="body">
      <transition name="fade">
      <div v-if="verifyAccount" class="modal" :class="{ 'is-active': verifyAccount }">
        <div class="modal-background" @click="verifyAccount = false"></div>
        <div class="modal-content box log-in session">

          <h1 class="title is-3">Resend verification</h1>
          <p class="subtitle is-6" style="margin-top: 20px;">If you have created an account but did not verified it, enter your email to verify. You will receive an email with a verification link.</p>

          <form @submit.prevent="sendVerificationEmail" class="field is-centered">

            <div class="field">
              <div class="control has-icons-left">
                <input type="text" id="email" v-model="email" class="input" placeholder="Email" />
                <span class="icon is-left is-small">
                  <i class="material-icons">mail</i>
                </span>
              </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <button type="submit" ref="resend_button" class="button is-rounded is-white">Resend</button>
              </p>
            </div>
            
          </form>

        </div>
        <button class="modal-close is-large" aria-label="close" @click="verifyAccount = false"></button>
      </div>
      </transition>
      </teleport>
      
      <!-- Reset Password Modal -->
      <teleport to="body">
      <transition name="fade">
      <div v-if="resetPassword" class="modal" :class="{ 'is-active': resetPassword }">
        <div class="modal-background" @click="resetPassword = false"></div>
        <div class="modal-content box log-in session">

          <h1 class="title is-3">Reset password</h1>
          <p class="subtitle is-6" style="margin-top: 20px;">Enter your email to reset your password</p>

          <form @submit.prevent="sendResetEmail" class="field is-centered">

            <div class="field">
              <div class="control has-icons-left">
                <input type="text" id="email" v-model="email" class="input" placeholder="Email" />
                <span class="icon is-left is-small">
                  <i class="material-icons">mail</i>
                </span>
              </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <button type="submit" ref="reset_button" class="button is-rounded is-white">Reset</button>
              </p>
            </div>

          </form>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="resetPassword = false"></button>
      </div>
      </transition>
      </teleport>

    </div>
  </div>

  <div v-else-if="user == null && register == true" key="register">
    <div class="box log-in session">
      <h1 class="title is-1">HAJA</h1>

      <form @submit.prevent="registerUser" class="field">
        <div class="field">

          <div class="control has-icons-left">
            <input class="input" type="text" id="username" v-model="username" placeholder="Username" />
            <span class="icon is-left is-small">
              <i class="material-icons">person</i>
            </span>
          </div>

          <div class="control has-icons-left">
            <input class="input" type="email" id="email" v-model="email" placeholder="Email" />
            <span class="icon is-left is-small">
              <i class="material-icons">mail</i>
            </span>
          </div>

          <div class="control has-icons-left">
            <input class="input" type="date" id="birthdate" v-model="birthdate" placeholder="Birthdate" />
            <span class="icon is-left is-small">
              <i class="material-icons">calendar_today</i>
            </span>
          </div>

          <div class="control has-icons-left">
            <input class="input" type="password" id="password" v-model="password" placeholder="Password" />
            <span class="icon is-left is-small">
              <i class="material-icons">lock</i>
            </span>
          </div>
          
          <div class="control has-icons-left">
            <input class="input" type="password" id="confirm_password" v-model="confirm_password" placeholder="Confirm Password" />
            <span class="icon is-left is-small">
              <i class="material-icons">lock</i>
            </span>
          </div>
          
        </div>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button type="submit" ref="register_button"class="button is-rounded is-white">Register</button>
          </p>
        </div>
        
      </form>

      <p class="signup">
        Already have an account?        
      </p>
      <p> <a @click="register = false"> <b> Login here! </b></a> </p>
    </div>
  </div>
  </transition>

</body>
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
  const verifyAccount = ref(false);
  const resetPassword = ref(false);

  const login_button = ref(null);
  const register_button = ref(null);
  const resend_button = ref(null);
  const reset_button = ref(null);

  const fetchUser = () => {
    get("/users/me").then((response) => {
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(user.value));
    });
  };

  const login = () => {
    login_button.value.classList.add('is-loading');

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
    .catch((response) => {
      if (response.status === 401) {
        $toast.error("Invalid credentials!", { position: "bottom" });
      } else {
        $toast.error("An unexpected error occurred.", { position: "bottom" });
      }
    })
    .finally(() => {
      login_button.value.classList.remove('is-loading');
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

    //animação botão
    register_button.value.classList.add('is-loading');

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
      sendVerificationEmail();
    })
    .catch(() => {
      $toast.error("Error during user creation!", { position: "bottom" });
    })
    .finally(() => {
      register_button.value.classList.remove('is-loading');
    });
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("authToken");
    $toast.info("Logout successful!", { position: "bottom" });
  };

  const sendResetEmail = () => {
    reset_button.value.classList.add('is-loading');

    //se o email tiver vazio
 

    console.log(email.value);
    post("/auth/request-password-reset", {
      email: email.value,
    }).then(() => {
      $toast.success("Email sent successfully!", { position: "bottom" });
      resetPassword.value = false;
    }).catch(() => {
      $toast.error("Error sending email!", { position: "bottom" });
    })
    .finally(() => {
      reset_button.value.classList.remove('is-loading');
    });
  };

  const sendVerificationEmail = () => {
    resend_button.value.classList.add('is-loading');

    post("/users/resend-verification", {email: email.value}).then(() => {
      $toast.success("Email sent successfully!", { position: "bottom" });
      verifyAccount.value = false;
    })
    .catch(() => {
      $toast.error("Error sending email!", { position: "bottom" });
    })
    .finally(() => {
      resend_button.value.classList.remove('is-loading');
    });
  }

  const created_at_formatted = computed(() => {
    return DateTime.fromISO(user.value.created_at).toFormat("dd/MM/yyyy HH:mm");
  });

  const birthdate_formatted = computed(() => {
    return DateTime.fromISO(user.value.birthdate).toFormat("dd/MM/yyyy");
  });

  onMounted(() => {
    if (localStorage.getItem("authToken")) {
      router.push("/account");
    }
  });

</script>

  
<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap');

  body.login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-image: url("https://www.home-designing.com/wp-content/uploads/2017/04/sydney-opera-house-australia-black-and-white-graphic.jpg");
    background-size: cover;
  }

  .session {
    width: auto;
    min-width: 350px;
    max-width: 850px;
    display: flex;
    flex-direction: row;
    margin: auto auto;
  }

  .log-in {
    padding: 40px 30px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;

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
</style>
  