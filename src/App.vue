<template>
  <div id="app">
    <nav v-if="showNavbar || isLoggedIn()" id="navbar">
      <div id="logo">
        <router-link to="/">HAJA</router-link>
      </div>
      <div id="middle-content">
        <p>Focus, learn and grow</p>
      </div>
      <div id="nav-icons">
        <router-link to="/about">
          <span class="material-icons">help</span>
        </router-link>
        <router-link to="/creator">
          <span class="material-icons">upload</span>
        </router-link>
        <router-link to="/account">
          <span class="material-icons">account_circle</span>
        </router-link>
      </div>
    </nav>
    <router-view class="view" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const showNavbar = computed(() => {
  return route.name !== 'login';
});

function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}
</script>

<style lang="scss">
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: $background-primary;
  color: $text-on-primary;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;

  a {
    color: #ccc;
    font-weight: bold;
    text-decoration: none;
  }

  a.router-link-active {
    color: #fff; /* Active link color */
  }

  #logo {
    font-size: 2rem;
    font-weight: bold;

    flex: 1;
  }

  #middle-content {
    flex: 1; /* Take up available space */
    display: flex;
    justify-content: center; /* Center the content */
    align-items: center;
  }

  #nav-icons {
    display: flex;
    gap: 20px;
    justify-content: center;

    flex: 1;

    .material-icons {
      font-size: 1.8rem;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: $background-attention;
      }
    }
  }
}

.view {
  margin-top: 120px; /* To account for the fixed navbar */
}
</style>
