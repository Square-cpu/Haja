<template>
    <div class="box session block" style="box-shadow: none; outline: auto;">
        <iframe
            class="block"
            width="320"
            height="240"
            :src="computedVideoLink"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
        ></iframe>
        <p class="title">{{ title }}</p>
        <p class="author">
            <span><b>{{ author.username }}</b></span>
        </p>
        <p class="description">{{ description }}</p>
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
.card {
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

.title {
    color: #cccccc;
    font-size: 20px;
    text-align: center;
}

.description {
    color: #b4b4b4;
    font-size: 15px;
    text-align: justify;
}

.time {
    color: #afafaf;
    text-align: center;
}

.author {
    color: #cccccc;
    text-align: center;
    font-size: 16px;
}
</style>
