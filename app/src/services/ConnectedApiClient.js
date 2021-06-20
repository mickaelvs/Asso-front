import axios from "axios";

const ConnectedApiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    Authorization: "Bearer " + sessionStorage.getItem("token")
  }
});

export default ConnectedApiClient;
