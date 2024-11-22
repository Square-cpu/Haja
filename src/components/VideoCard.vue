<template>
    <div class="video-card">
        <iframe
            width="320"
            height="240"
            :src="computedVideoLink"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
        ></iframe>
        <p class="author">
            <span><b>{{ author.username }}</b></span>
        </p>
        <p class="text">{{ title }}</p>
        <p class="text">{{ description }}</p>
        <p class="time">{{ formattedDate }}</p>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    videoLink: {
        type: String,
        required: true,
    },
    title: {
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

const computedVideoLink = computed(() => {
    return `https://www.youtube.com/embed/${props.videoLink}`;
});

const formattedDate = computed(() => {
    const date = new Date(props.created);
    return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
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

    iframe {
        border-radius: 8px;
    }
}

.time {
    color: $text-muted;
}
</style>
