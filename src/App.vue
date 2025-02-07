<template>
  <div id="app">
    <nav v-if="showNavbar || (route.name == 'login' && isLoggedIn())" id="navbar">
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
  return route.meta.showNavbar !== false;
});

function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}
</script>

<style scoped lang="scss">
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #17171b;
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

    flex: 0 1 auto;
    padding-left: 50px;
  }

  #middle-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    margin: 0;
  }

  #nav-icons {
    flex: 0 1 auto;
    display: flex;
    gap: 20px;
    align-items: center;
    padding-right: 50px;
    justify-content: center;

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
  margin-top: 100px;
}
</style>
