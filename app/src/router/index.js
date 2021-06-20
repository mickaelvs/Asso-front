import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Newspapper from "../views/Newspapper.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/newspapper/:newspapperId",
    name: "single-newspapper",
    component: Newspapper
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/:pageNumber",
    name: "home-paginated",
    component: Home
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

export default router;
