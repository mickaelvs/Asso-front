import Vue from "vue";
import Vuex from "vuex";
import ApiClient from "@/services/ApiClient.js";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    notifications: []
  },
  // Les mutations sont les setters de l'état
  // Pour modifier l'état (state), je dois passer par une mutation (commit('nomMutation'))
  mutations: {
    /**
     * Authentication success mutation (setter)
     *
     * @param {Object} state New state
     * @param {Object} user Mutation data to pass to state
     */
    authenticationSuccess(state, user) {
      state.user = user;
    },
    disconnectionSuccess(state) {
      state.user = null;
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state, index) {
      state.notifications.splice(index, 1);
    }
  },
  actions: {
    /**
     * Connect
     *
     * @param {Object} context Store mutations, state and getters
     * @param {Object} credentials Connection data
     */
    connect(context, credentials) {
      /**
       * @type {Promise}
       */
      let loginRequest = ApiClient.post(
        "/jwt-auth/v1/token",
        // Données envoyées dans le corps de la requête (body) transformée automatiquement en JSON
        credentials
      );

      loginRequest.then(response => {
        if (response.data.success) {
          // Succès
          let token = response.data.data.token;
          let displayName = response.data.data.displayName;

          // Je stocke le token dans le sessionStorage
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("displayName", displayName);

          let user = response.data.data;

          sessionStorage.setItem("user", JSON.stringify(user));

          ApiClient.defaults.headers["Authorization"] = "Bearer " + token;

          // Je modifie le state avec les informations de l'utilisateur qui vient de se connecter
          context.commit("authenticationSuccess", user);
        }

        // J'envoie au then suivant la réponse complète
        return response;
      });

      return loginRequest;
    },
    /**
     * Disconnect
     *
     * @param {Object} context Store mutations, state and getters
     */
    disconnect(context) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("displayName");
      sessionStorage.removeItem("user");

      context.commit("disconnectionSuccess");

      delete ApiClient.defaults.headers["Authorization"];

      router.push({ name: "home" });
    },
    /**
     * Reconnect
     *
     * @param {Object} context Store mutations, state and getters
     */
    reconnect(context) {
      let token = sessionStorage.getItem("token");

      // Si j'ai un token ...
      if (token) {
        // je vérifie s'il est valide avec l'API
        let validateTokenRequest = ApiClient.post(
          "/jwt-auth/v1/token/validate",
          {},
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );

        validateTokenRequest.then(response => {
          // Si le token est valide
          if (response.data.success) {
            // Je reconnecte le user ...
            let user = sessionStorage.getItem("user");

            user = JSON.parse(user);

            ApiClient.defaults.headers["Authorization"] = "Bearer " + token;

            // ... en modifiant le state
            context.commit("authenticationSuccess", user);
          } else {
            // sinon je supprime les données invalides
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("displayName");
          }
        });
      }
    },
    /**
     * Notify user
     *
     * @param {Object} context
     * @param {Object} notification
     */
    notify(context, notification) {
      context.commit("ADD_NOTIFICATION", notification);
    },
    /**
     * Delete notification
     *
     * @param {Object} context
     * @param {Number} notificationIndex
     */
    removeNotification(context, notificationIndex) {
      context.commit("REMOVE_NOTIFICATION", notificationIndex);
    }
  },
  modules: {}
});
