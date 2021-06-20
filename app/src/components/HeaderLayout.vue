<template>
  <header class="header" v-bind:class="{ 'logo-only': userLoggedOut }">
    <RouterLink v-bind:to="{ name: 'home' }">
      <div class="logo-container">
        <img class="logo" src="" />
        <div class="text-container">
          <span class="first-part">10 minutes</span>
          <span class="second-part">O'Four</span>
        </div>
      </div>
    </RouterLink>
    <div class="user" v-if="userLoggedIn">
      <span class="username">{{ userDisplayName }}</span>
      <img
        class="avatar"
        src=""
        v-on:click="toggleUserMenu()"
      />
      <div class="user-actions" v-show="userMenuVisible">
        <a href="javascript:void(0)">Inviter un ami</a>
        <a v-on:click="disconnect()">Déconnexion</a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderLayout",
  // La propriété data doit être de type function et doit retourner un objet
  // data: function() {
  data() {
    return {
      userMenuVisible: false
    };
  },
  methods: {
    toggleUserMenu() {
      this.userMenuVisible = !this.userMenuVisible;
    },
    disconnect() {
      // J'exécute l'action disconnect du store
      this.$store.dispatch('disconnect');

      this.userMenuVisible = false;
    }
  },
  computed: {
    userLoggedIn() {
      // return this.$store.state.user !== null;
      return !!this.$store.state.user;
    },
    userLoggedOut() {
      return !this.userLoggedIn;
    },
    userDisplayName() {
      return this.$store.state.user.displayName;
    }
  }
};
</script>

<style>
</style>
