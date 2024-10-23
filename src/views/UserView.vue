<template>
    <div>
        <h1>User View</h1>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr);">
          <VideoCard 
            v-for="video in videos"
            :key="video.id"
            :videoLink="video.videoLink"
            :author="video.author"
            :created="video.created"
            :id="video.id"
            :description="video.description"
          />
        </div>             
    </div>
</template>

<script setup>
    import VideoCard from '@/components/VideoCard.vue';
    import { reactive } from 'vue';

    const videos = reactive([
    {
      videoLink: "/videos/1.mp4",
      author: {
        id: 1,
        username: "tiago123",
      },
      created: "2022-06-05T20:53:48",
      id: 1,
      description: "Look at that fun animation :D",
    },
    {      
      videoLink: "/videos/2.mp4",
      author: {
        id: 1,
        username: "tiago123",
      },
      created: "2022-06-10T17:34:22",
      id: 2,
      description: "I love this plataform :)",
    },
    {      
      videoLink: "/videos/3.mp4",
      author: {
        id: 2,
        username: "brunin774",
      },
      created: "2022-06-21T12:54:10",
      id: 3,
      description: "This video is fire .O.",
    },
  ]);
</script>

<style lang="scss" scoped></style>