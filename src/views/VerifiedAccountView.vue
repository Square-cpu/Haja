<template>
<div class="section">
    <div class="box session" style="background-color: #212121;">
        <h1 :style="{ color: color }">{{ statusTextTitle }}</h1>
        <p>{{ statusTextSubtitle }}</p>
        <a href="/login">
            Go to login page
        </a>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const code = ref(route.query.code);

const statusTextTitle = ref("");
const statusTextSubtitle = ref("");
const color = ref("");

if (code.value == null) {
    statusTextTitle.value = "Verifying your account";
    statusTextSubtitle.value = "Please wait while we verify your account...";
    color.value = "black";
} else if (code.value == 200) {
    statusTextTitle.value = "Account already verified";
    statusTextSubtitle.value = "Your account has already been verified.";
    color.value = "darkgreen";
} else if (code.value == 302) {
    statusTextTitle.value = "You have successfully verified your account";
    statusTextSubtitle.value = "You can now login to your account.";
    color.value = "#41ad25";
} else if (code.value == 400) {
    statusTextTitle.value = "Invalid or expired verification link";
    statusTextSubtitle.value = "The verification link you used is invalid or has expired.";
    color.value = "red";
} else if (code.value == 404) {
    statusTextTitle.value = "Email not found";
    statusTextSubtitle.value = "The email you entered is not associated with any account.";
    color.value = "gray";
}

console.log("Code: " + code.value);
</script>

<style scoped lang = "scss">
    .session {
        padding: 40px 30px;
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: left;
        text-align: center;
        width: auto;
        max-width: 500px;
    }

    h1 {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    p {
        color: #ababab;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }
</style>