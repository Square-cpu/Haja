<template>
    <div class="video-card">
        <video width="320" height="240" controls>
            <source :src="videoLink" type="video/mp4">
        </video>
        <p class="author">
            <span><b>{{ author.username }}</b></span>
        </p>
        <p class="text">{{ description }}</p>
        <p class="time">{{ created }}</p>
    </div>
</template>

<script setup>
    defineProps({
        videoLink: {
            type: String,
            required: true,
        },
        author: {
            type: Object,
            required: true,
        },
        created: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    });
</script>

<style lang="scss" scoped>
    .video-card {
        border: 1px solid $border-default;
        width: 400px;
        border-radius: 8px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 24px;

        padding: 12px;

        text-align: center;

        video {
            border-radius: 8px;
        }
    }
</style>
  