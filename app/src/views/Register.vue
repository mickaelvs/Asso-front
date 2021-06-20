<template>
  <main class="main-container">
    <h1>Inscription</h1>
    <RegisterForm />
  </main>
</template>

<script>
import RegisterForm from "../components/forms/RegisterForm.vue";

export default {
  name: "Register",
  components: {
    RegisterForm
  }
};
</script>

<style></style>
