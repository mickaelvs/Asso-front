import ApiClient from "@/services/ApiClient.js";

export default {
  getList() {
    return ApiClient
      .get("wp/v2/newspapper-details")
      .then(response => response.data);
  }
};
