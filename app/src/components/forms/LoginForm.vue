<template>
  <form v-on:submit.prevent="onSubmit()">
    <fieldset>
      <div class="field">
        <label class="field__label">Adresse e-mail</label>
        <input
          class="field__input"
          type="text"
          placeholder="johndoe@ocooking.local"
          v-model="email"
        />
      </div>
      <div class="field">
        <label class="field__label">Mot de passe</label>
        <input
          class="field__input"
          type="password"
          placeholder="Mot de passe"
          v-model="password"
        />
        <ul class="field__error-list"></ul>
      </div>
    </fieldset>

    <div v-if="hasError" class="alert error">
      La connexion a échoué. Veuillez vérifier vos informations de connexion.
    </div>
    <button class="button">Connexion</button>
  </form>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      hasError: false
    };
  },
  methods: {
    onSubmit() {
      // J'indique qu'il n'y a plus d'erreur avant de retester
      this.hasError = false;

      console.log(this.email, this.password);

      /**
       * @type {Promise}
       */
      let loginRequest = this.$store.dispatch(
        'connect', // action
        {
          username: this.email,
          password: this.password
        } // data
      );

      // Le formulaire vient ajouter son traitement après les traitements réalisés par l'action connect du store
      loginRequest.then(response => {
        if (response.data.success) {
          // Je "redirige" vers la home
          this.$router.push({ name: 'home' });
        } else {
          this.hasError = true;
        }
      });

      loginRequest.catch(error => {
        console.error(error);
      });
    }
  }
};
</script>

<style lang="scss"></style>
