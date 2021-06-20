<template>
  <main class="main-container">
    <NewspapperList />
  </main>
</template>

<script>
import NewspapperList from "./NewspapperList.vue";

export default {
  name: "MainLayout",
  components: {
    NewspapperList
  }
};
</script>

<style>
</style>
