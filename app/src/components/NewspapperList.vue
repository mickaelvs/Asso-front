<template>
  <div>
    <div class="filter-list">
      <div class="filter-list__title">Filtrer</div>
      <div class="filter-list__content">
        <div class="filter">
          <label class="filter__label">Type</label>
          <select
            class="filter__control select"
            v-model="selectedType"
            v-on:change="getNewspapperItems()"
          >
            <option
              v-for="type in typeItems"
              v-bind:key="type.id"
              v-bind:value="type.id"
              >{{ type.name }} ({{ type.count }})</option
            >
          </select>
        </div>
        <div class="filter">
          <label class="filter__label">Mots-clés</label>
          <select
            multiple
            class="filter__control select"
            v-model="selectedMotsclefs"
            v-on:change="getNewspapperItems()"
          >
            <option
              v-for="ingredient in ingredientItems"
              v-bind:key="ingredient.id"
              v-bind:value="ingredient.id"
              >{{ ingredient.name }} ({{ ingredient.count }})</option
            >
          </select>
        </div>
      </div>
    </div>
    <div class="newspapper-list">
      <h1>Actualités</h1>
      <!-- Utilisation "dynamique" des props -->
      <NewspapperExcerpt
        v-for="newspapper in newspapperItems"
        v-bind:key="newspapper.id"
        v-bind:newspapperId="newspapper.id"
        v-bind:title="newspapper.title.rendered"
        v-bind:excerpt="newspapper.excerpt.rendered"
        v-bind:imageId="newspapper.featured_media"
      />
      <!-- Utilisation statique des props -->
      <!--
      <NewspapperExcerpt
        title="Tarte aux fraises"
        excerpt="Une excellente recette de tarte aux fraises"
        image="https://source.unsplash.com/collection/157&random=1" />
      <NewspapperExcerpt
        title="Tarte aux abricots"
        excerpt="Une excellente recette de tarte aux abricots"
        image="https://source.unsplash.com/collection/157&random=2" />
      <NewspapperExcerpt
        title="Tarte à la rhubarbe"
        excerpt="Une excellente recette de tarte à la rhubarbe"
        image="https://source.unsplash.com/collection/157&random=3" />
      -->
    </div>
    <PaginationNavigation
      routeName="home-paginated"
      v-bind:pageNumber="pageNumber"
      v-bind:totalPages="totalPages"
    />
  </div>
</template>

<script>
import ApiClient from "@/services/ApiClient.js";
import NewspapperExcerpt from "./NewspapperExcerpt.vue";
import PaginationNavigation from "./PaginationNavigation.vue";

export default {
  name: "NewspapperList",
  data() {
    return {
      typeItems: [],
      ingredientItems: [],
      newspapperItems: [],
      totalPages: 0,
      selectedType: null,
      selectedMotsclefs: []
    };
  },
  methods: {
    handleTypeListResponse(response) {
      // console.log("OK", response.data);
      // Contrairement à fetch, axios nous envoie les données directement dans un objet
      // J'insère les données reçues en réponse à ma requête HTTP dans une data de mon composant afin de les utiliser dans le template
      this.typeItems = response.data;
    },
    handleTypeListResponseError(error) {
      console.error("KO", error);
    },
    handleMotsclefListResponse(response) {
      this.ingredientItems = response.data;
    },
    handleMotsclefListResponseError(error) {
      console.error(error);
    },
    handleNewspapperListResponse(response) {
      this.newspapperItems = response.data;
    },
    handleNewspapperListResponseError(error) {
      console.error(error);
    },
    getTypeItems() {
      /**
       * @type {Promise}
       */
      let typeListRequest = ApiClient.get("/wp/v2/newspapper-types");

      /**
       * J'associe le traitement à effectuer en cas de succès (promesse résolue)
       *
       * La fonction fléchée me permet d'accéder au this de composant (qui correspond à l'instance de mon composant)
       */
      typeListRequest.then(this.handleTypeListResponse);

      /**
       * J'associe le traitement à effectuer en cas d'échec (promesse rejetée)
       */
      typeListRequest.catch(this.handleTypeListResponseError);
    },
    getMotsclefItems() {
      let ingredientListRequest = ApiClient.get("/wp/v2/newspapper-ingredients");
      ingredientListRequest.then(this.handleMotsclefListResponse);
      ingredientListRequest.catch(this.handleMotsclefListResponseError);
    },
    getNewspapperItems() {
      let newspapperListRequestParams = {
        page: this.pageNumber
      };

      if (this.selectedType) {
        newspapperListRequestParams["newspapper-types"] = this.selectedType;
      }

      if (this.selectedMotsclefs.length) {
        newspapperListRequestParams[
          "newspapper-ingredients"
        ] = this.selectedMotsclefs;
      }

      let newspapperListRequest = ApiClient.get("/wp/v2/newspappers", {
        params: newspapperListRequestParams
      });
      newspapperListRequest.then(this.setTotalPages);
      newspapperListRequest.then(this.handleNewspapperListResponse);
      newspapperListRequest.catch(this.handleNewspapperListResponseError);

      /*
      // Sans variable stockant la promesse
      ApiClient
        .get(
          "/wp/v2/newspappers",
          {
            params: {
              page: this.pageNumber,
           },
          }
        )
        .then(this.setTotalPages)
        .then(this.handleNewspapperListResponse)
        .catch(this.handleNewspapperListResponseError);
      */
    },
    setTotalPages(response) {
      this.totalPages = parseInt(response.headers["x-wp-totalpages"], 10);

      return response;
    }
  },
  computed: {
    pageNumber() {
      let pageNumber;

      if (this.$route.params.pageNumber) {
        pageNumber = parseInt(this.$route.params.pageNumber, 10);
      } else {
        pageNumber = 1;
      }

      return pageNumber;
    }
  },
  /**
   * @link https://raoulkramer.de/vue-js-router-pagination/
   */
  watch: {
    /**
     * On observe les modifications du pageNumber afin de recharger la liste des recettes en fonction de la page sélectionnée
     *
     * @link https://fr.vuejs.org/v2/guide/computed.html#Observateurs
     */
    pageNumber() {
      this.getNewspapperItems();
    }
  },
  /**
   * Hook déclenché juste après que le DOM ait été modifié par le composant ( ~= DOMContentLoaded à l'échelle du Composant)
   */
  mounted() {
    this.getTypeItems();

    this.getMotsclefItems();

    this.getNewspapperItems();
  },
  components: {
    NewspapperExcerpt,
    PaginationNavigation
  }
};
</script>

<style>
</style>
