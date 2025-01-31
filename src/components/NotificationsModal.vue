<template>
    <div class="notifications-modal">
      <!-- Add your notifications content here -->
      <p>No new notifications</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotificationsModal'
  }
  </script>
  
  <style scoped>
  .notifications-modal {
    position: absolute;
    top: 50px; /* Adjust as needed */
    right: 0;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  </style>