<template>
  <div class="app-container">
    <Navbar />
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>