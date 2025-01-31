<template>
  <div class="reset-password-container">
    <h1 style="color: black">Reset Password</h1>
    <p style="color: black">Please enter the new password.</p>

    <form @submit.prevent="sendResetEmail">
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>

      <button type="submit">Reset Password</button>
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

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: auto;
  margin-top: 120px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin-top: 15px;
}
</style>