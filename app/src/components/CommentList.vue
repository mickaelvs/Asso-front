<template>
  <section class="comment-list">
    <header>
      <h2>Commentaires ({{ commentCount }})</h2>
    </header>
    <main>
      <div v-if="commentsLoaded && !commentsLoadedHasErrors">
        <div
          v-for="comment in commentItems"
          v-bind:key="comment.id"
          class="comment"
        >
          <p class="author">{{ comment.author_name }}</p>
          <div v-html="comment.content.rendered"></div>
        </div>
      </div>
      <div v-else-if="commentsLoadedHasErrors" class="alert error">
        Nous avons rencontré un problème avec la récupération des commentaires
      </div>
      <img v-else-if="commentCount !== 0" src="" class="loader" />
      <div class="comment-form" v-if="userLoggedIn">
        <h3>Commenter en tant que {{ displayName }}</h3>
        <form v-on:submit.prevent="onSubmit">
          <div>
            <div class="field">
              <textarea
                v-model="newCommentContent"
                placeholder="Le texte de votre commentaire"
                class="textarea field__input"
              ></textarea>
            </div>
          </div>
          <div>
            {{ newCommentContent.length }} /
            {{ newCommentContentMinLength }} caractères minimum
          </div>
          <div
            class="alert error"
            v-for="(error, index) in newCommentFormErrors"
            v-bind:key="index"
          >
            {{ error }}
          </div>
          <button
            v-if="newCommentContent.length >= newCommentContentMinLength"
            type="submit"
            class="button"
          >
            Commenter
          </button>
        </form>
      </div>
    </main>
  </section>
</template>

<script>
import ApiClient from "@/services/ApiClient.js";

export default {
  name: "CommentList",
  props: {
    postId: {
      type: Number,
      required: true
    },
    commentCount: {
      type: Number,
      required: false,
      default: null
    },
    newCommentContentMinLength: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      commentItems: [],
      commentsLoaded: false,
      commentsLoadedHasErrors: false,
      newCommentContent: "",
      newCommentFormErrors: []
    };
  },
  computed: {
    userLoggedIn() {
      return !!this.$store.state.user;
    },
    userLoggedOut() {
      return !this.userLoggedIn;
    },
    displayName() {
      return this.$store.state.user.displayName;
    }
  },
  methods: {
    onSubmit() {
      /**
       * @link https://fr.vuejs.org/v2/cookbook/form-validation.html
       */
      this.newCommentFormErrors = [];

      if (this.newCommentContent.length >= this.newCommentContentMinLength) {
        let createCommentRequest = ApiClient.post("/wp/v2/comments", {
          content: this.newCommentContent,
          post: this.postId
        });

        createCommentRequest.then(response => {
          let newComment = response.data;

          // J'ajoute le nouveau commentaire au début du tableau
          this.commentItems.unshift(newComment);

          // Je scroll tout en haut de mon composant
          this.$el.scrollIntoView();

          this.newCommentContent = "";
        });

        createCommentRequest.catch(error => {
          this.newCommentFormErrors.push(
            "Nous avons rencontré un problème lors de la création de votre commentaire."
          );

          if (error.response.data.message) {
            this.newCommentFormErrors.push(error.response.data.message);
          }
        });
      } else {
        this.newCommentFormErrors.push("Le commentaire n'est pas valide.");
      }
    }
  },
  mounted() {
    // Si je n'ai pas d'information sur le nombre de commentaire (this.commentCount === null)
    // OU (||)
    // Si j'ai un nombre de commentaire > 0 (this.commentCount > 0)
    if (this.commentCount === null || this.commentCount > 0) {
      // .. je récupère la liste des commentaires
      let commentListRequest = ApiClient.get("/wp/v2/comments", {
        params: {
          post: this.postId,
          per_page: this.commentCount
        }
      });

      commentListRequest.then(response => {
        this.commentItems = response.data;
        this.commentsLoaded = true;
      });
      commentListRequest.catch(error => {
        console.error(error);

        this.commentsLoaded = true;
        this.commentsLoadedHasErrors = true;
      });
    }
  }
};
</script>

<style>
</style>
