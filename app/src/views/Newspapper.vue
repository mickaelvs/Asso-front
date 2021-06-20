<template>
  <main class="main-container">
    <NewspapperFull v-bind:newspapperId="newspapperId" />
  </main>
</template>

<script>
import NewspapperFull from "../components/NewspapperFull.vue";

export default {
  name: "Newspapper",
  components: {
    NewspapperFull
  },
  computed: {
    newspapperId() {
      return parseInt(this.$route.params.newspapperId, 10);
    }
  }
};
</script>

<style></style>
