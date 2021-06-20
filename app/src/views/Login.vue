<template>
  <main class="main-container">
    <h1>Connexion</h1>
    <LoginForm />
  </main>
</template>

<script>
import LoginForm from "../components/forms/LoginForm.vue";

export default {
  name: "Login",
  components: {
    LoginForm
  }
};
</script>

<style></style>
