<template>
  <div class="box session">
    <h1 class="title is-1" style="color: #e8e8e8; text-align: center;">Reset Password</h1>
    <p class="subtitle is-4" style="color: #d4d4d4; text-align: center;">Please enter the new password.</p>

    <form @submit.prevent="sendResetEmail">
      <div class="field">
        <div class="control has-icons-left">
            <input type="password" id="password" v-model="password" class="input" placeholder="Password" required />
            <span class="icon is-left is-small">
              <i class="material-icons">lock_open</i>
            </span>
          </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button type="submit" class="button is-rounded is-white">Reset Password</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAxios } from "@/composables/useAxios";

import { useToast } from 'vue-toast-notification';

import { useRoute } from 'vue-router';
import router from '@/router';

const $toast = useToast();

const route = useRoute();

const token = route.query.token;

const password = ref('');

const { post } = useAxios();

const sendResetEmail = () => {
  try {
    post(`/auth/reset-password/${token}`, { password: password.value }).then(() => {
      $toast.success('Password reset sent successfully!');
      router.push('/login');
    })
  } catch (error) {
    $toast.error('Password reset failed!');
  }
};

</script>

<style scoped lang="scss">
.session {
  width: auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  margin: auto auto;
  margin-top: 200px;
}

button {
  padding: 10px 15px;
  border: none;
}

button:hover {
  background-color: #a3a3a3;
}

p {
  margin-top: 15px;
}
</style>