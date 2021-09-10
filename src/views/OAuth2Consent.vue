<template>
  <div>
    <div class="row align-items-start mt-4">
      <div class="col-12">
        <div class="alert alert-success" role="alert">
          <p>
            Application <strong>{{ consentToken.client_name }}</strong> request
            access to :
          </p>
          <h6 v-for="scope in consentToken.scopes" :key="scope">{{ scope }}</h6>
        </div>
      </div>
      <div class="col-md-6">
        <button class="w-100 btn btn-lg btn-secondary" type="submit">
          Deny
        </button>
      </div>
      <div class="col-md-6">
        <button class="w-100 btn btn-lg btn-primary" @click="test()">
          Allow
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CBOR from "@/plugins/cbor.js";
import jwt_decode from "jwt-decode";
import config from "@/plugins/config.js";

export default {
  name: "Login",
  data() {
    return {
      consentToken: null,
    };
  },

  created() {
    this.consentToken = JSON.parse(atob(this.$route.params.consenttoken));
    console.log(this.consentToken);
  },

  methods: {
    test() {
      window.open(
        config.value("apiUrl") + this.consentToken.authorize_request,
        "_self"
      );
    },
  },
};
</script>
