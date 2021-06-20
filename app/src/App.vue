<template>
  <div id="app">
    <HeaderLayout />
    <transition name="slide" mode="out-in">
      <RouterView />
    </transition>
    <FooterLayout />
  </div>
</template>

<script>
import HeaderLayout from "./components/HeaderLayout.vue";
import FooterLayout from "./components/FooterLayout.vue";

export default {
  name: 'App',
  components: {
    HeaderLayout,
    FooterLayout
  },
  created() {
    this.$store.dispatch('reconnect');
  }
}
</script>

<style>
a:-webkit-any-link {
  text-decoration: none !important;
}
</style>
