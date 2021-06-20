<template>
  <main class="main-container">
    <NewspapperList />
  </main>
</template>

<script>
import NewspapperList from "../components/NewspapperList.vue";

export default {
  name: "Home",
  components: {
    NewspapperList
  }
};
</script>
