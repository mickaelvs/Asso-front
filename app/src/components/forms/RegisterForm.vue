<template>
  <form>
    <fieldset>
      <div class="field">
        <label class="field__label">Prénom</label>
        <input class="field__input" type="text" placeholder="John" />
      </div>
      <div class="field">
        <label class="field__label">Nom</label>
        <input class="field__input" type="text" placeholder="Doe" />
      </div>
      <div class="field">
        <label class="field__label">Adresse e-mail</label>
        <input
          class="field__input"
          type="text"
          placeholder="johndoe@ocooking.local"
        />
      </div>
    </fieldset>
    <fieldset>
      <div class="field">
        <label class="field__label">Identifiant</label>
        <input class="field__input" type="text" placeholder="johndoe" />
      </div>
      <div class="field">
        <label class="field__label">Mot de passe</label>
        <input
          class="field__input"
          type="password"
          placeholder="Mot de passe"
        />
      </div>
      <div class="field">
        <label class="field__label">Confirmation du mot de passe</label>
        <input
          class="field__input"
          type="password"
          placeholder="Confirmez le mot de passe"
        />
      </div>
    </fieldset>

    <button class="button">Créer le compte</button>
  </form>
</template>

<script>
export default {
  name: "RegisterForm"
};
</script>

<style></style>
