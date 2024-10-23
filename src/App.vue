<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/creator">Creator</router-link> |
    <router-link to="/login">Login</router-link>
  </nav>
  <router-view class="view"/>
</template>

<style lang="scss">
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 800px;
    margin-right: auto;
    margin-left: auto;
    padding: 30px;
    color: inherit;

    a {
      color: $text-secondary;
      font-weight: bold;
      text-decoration: none;
    }

    a:not(:last-child) {
      margin-right: 15px;
    }

    a.router-link-active {
      color: $background-light;
    }
  }

  .view {
    margin-right: auto;
    margin-left: auto;

    h1 {
      color: $text-on-primary;
    }
  }
</style>
