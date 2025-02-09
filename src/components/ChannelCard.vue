<template>
    <div class="channel-card">
        <p class="text"> {{ channelName }}</p>
        <p class="id">
            <span><b>{{ channelId }}</b></span>
        </p>
        <p class="author">
            <span><b>By: {{ authorUsername }}</b></span>
        </p>
        <p class="time">{{ formattedDate }}</p>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    channelName: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    authorUsername: {
        type: String,
        required: true
    },
    created: {
        type: String,
        required: true
    }
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
.channel-card {
    border: 1px solid $border-default;
    background-color: #272727;
    width: 90%;
    border-radius: 8px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
    padding: 30px;
    text-align: center;
    transition: all 0.2s ease-in-out;

    .text {
        font-size: 1.5em;
        color: #dadada;
    }

    .id {
        font-size: 1em;
        color: #a7a7a7;
    }

    .author {
        font-size: 1em;
        color: #a7a7a7;
    }

    .time {
        font-size: 1em;
        color: #a7a7a7;
    }
}

.channel-card:hover {
    background-color: #363636;
    cursor: pointer;
    transform: scale(1.05);
}

</style>
