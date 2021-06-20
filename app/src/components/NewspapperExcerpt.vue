<template>
  <article class="article">
    <RouterLink
      v-bind:to="{
        name: 'single-newspapper',
        params: {
          newspapperId: newspapperId
        }
      }"
    >
      <div
        class="media-image"
        v-if="image"
        v-bind:style="{
          backgroundImage: cssBackgroundImage
        }"
      ></div>
      <div class="text-content">
        <h2>{{ title }}</h2>
        <div v-html="excerpt"></div>
      </div>
    </RouterLink>
  </article>
</template>

<script>
import ApiClient from "@/services/ApiClient.js";

export default {
  name: "NewspapperExcerpt",
  props: {
    newspapperId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: true
    },
    imageId: {
      type: Number,
      default: 0, // Pas d'image
      required: false
    }
  },
  data() {
    return {
      image: null
    };
  },
  computed: {
    imageURL() {
      let imageURL;

      if (this.image.media_details.sizes.large) {
        imageURL = this.image.media_details.sizes.large.source_url;
      } else {
        imageURL = this.image.media_details.sizes.full.source_url;
      }

      /*
      let imageSize;

      if (this.image.media_details.sizes.large) {
        imageSize = "large";
      } else {
        imageSize = "full";
      }

      let imageURL = this.image.media_details.sizes[imageSize].source_url;
      */

      return imageURL;
    },
    cssBackgroundImage() {
      return "url(" + this.imageURL + ")";
    }
  },
  methods: {
    getImage() {
      // S'il y a une image
      if (this.imageId !== 0) {
        let mediaRequest = ApiClient.get("/wp/v2/media/" + this.imageId);

        mediaRequest.then(response => {
          this.image = response.data;
        });
        mediaRequest.catch(error => {
          console.error(error);
        });
      }
    }
  },
  mounted() {
    this.getImage();
  }
};
</script>

<style>
</style>
