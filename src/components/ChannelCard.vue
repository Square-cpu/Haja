<template>
    <div class="channel-card">
        <p class = "text"> {{ channelName }}</p>
        <p class="author">
            <span><b>{{ authorId }}</b></span>
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
    authorId: {
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
    background-color: white;
    width: 400px;
    border-radius: 8px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
    padding: 12px;
    text-align: center;

    .text {
        color: $text-primary;
    }

    .author {
        color: $text-muted;
    }
}

.time {
    color: $text-muted;
}
</style>
