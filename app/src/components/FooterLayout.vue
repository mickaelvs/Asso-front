<template>
  <footer class="footer">
    <nav class="nav">
      <RouterLink v-bind:to="{ name: 'home' }">Liste des recettes</RouterLink>
      <RouterLink
        v-if="userLoggedOut"
        v-bind:to="{ name: 'register' }">Inscription</RouterLink>
      <RouterLink
        v-if="userLoggedOut"
        v-bind:to="{ name: 'login' }">Connexion</RouterLink>
    </nav>
  </footer>
</template>

<script>
export default {
  name: "FooterLayout",
  computed: {
    userLoggedIn() {
      // return this.$store.state.user !== null;
      return !!this.$store.state.user;
    },
    userLoggedOut() {
      return !this.userLoggedIn;
    }
  }
};
</script>

<style>
</style>
