<template>
  <div v-if="newspapperData">
    <h1>{{ newspapperData.title.rendered }}</h1>
    <article class="newspapper">
      <section class="informations">
        <ul>
          <li>
            Temps de préparation : {{ newspapperData.meta.preparation_time }} min.
          </li>
          <li>Temps de cuisson : {{ newspapperData.meta.cooking_time }} min.</li>
          <li>
            Coût par personne (pour {{ newspapperData.meta.servings }} pers.) :
            {{ newspapperData.meta.cost_per_person }} €
          </li>
        </ul>
        <div
          class="media-image"
          v-if="imageData"
          v-bind:style="{
            backgroundImage: cssBackgroundImage
          }"
        ></div>
      </section>

      <section class="ingredients">
        <h2>Mots-clés</h2>
        <ul>
          <li v-for="ingredient in ingredientsData" v-bind:key="ingredient.id">
            {{ ingredient.name }}
          </li>
        </ul>
      </section>
      <section class="preparation">
        <h2>Préparation</h2>
        <main v-html="newspapperData.content.rendered"></main>
      </section>
    </article>
    <CommentList
      v-if="commentOpen"
      v-bind:postId="newspapperData.id"
      v-bind:commentCount="newspapperData.comment_count"
    />
  </div>
</template>

<script>
import ApiClient from "@/services/ApiClient.js";
import CommentList from "@/components/CommentList.vue";

export default {
  name: "NewspapperFull",
  components: {
    CommentList
  },
  props: {
    newspapperId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      newspapperData: null,
      imageData: null,
      ingredientsData: []
    };
  },
  methods: {
    getNewspapperData() {
      // @todo Récupérer les informations en meta
      let newspapperRequest = ApiClient.get("/wp/v2/newspappers/" + this.newspapperId);

      newspapperRequest.then(response => {
        this.newspapperData = response.data;

        if (this.newspapperData.featured_media !== 0) {
          this.getImageData();
        }

        if (this.newspapperData["newspapper-ingredients"].length > 0) {
          this.getMotsclefsData();
        }
      });
      newspapperRequest.catch(error => {
        console.error(error);
      });
    },
    getImageData() {
      let imageRequest = ApiClient.get(
        "/wp/v2/media/" + this.newspapperData.featured_media
      );

      imageRequest.then(response => {
        this.imageData = response.data;
      });
    },
    getMotsclefsData() {
      let ingredientsRequest = ApiClient.get("/wp/v2/newspapper-ingredients", {
        params: {
          /**
           * Je récupère la liste des ingrédients uniquement liés à ma recette
           */
          include: this.newspapperData["newspapper-ingredients"]
        }
      });

      ingredientsRequest.then(response => {
        this.ingredientsData = response.data;
      });
    }
  },
  computed: {
    cssBackgroundImage() {
      let cssBackgroundImage;

      if (this.imageData) {
        cssBackgroundImage =
          "url(" + this.imageData.media_details.sizes.full.source_url + ")";
      } else {
        cssBackgroundImage = null;
      }

      return cssBackgroundImage;
    },
    commentOpen() {
      return this.newspapperData.comment_status === "open";
    }
  },
  mounted() {
    this.getNewspapperData();
  }
};
</script>

<style>
</style>
