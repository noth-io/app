<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4" v-if="registerConfirmed">
            <medium>Registration confirmed</medium>
            <base-alert class="mt-4" type="success">
              Your registration is confirmed. <br />
              You will be redirected to dashboard in 5 seconds.
            </base-alert>
          </div>
          <div class="text-center text-muted mb-4" v-if="registerFailed">
            <medium>Registration failed</medium>
            <base-alert class="mt-4" type="danger">
              Your registration failed. <br />
              Resend confirmation mail.
            </base-alert>
            <base-button type="primary" class="mt-4">Resend mail</base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "@/plugins/config.js";

export default {
  name: "register",

  data() {
    return {
      registerToken: null,
      registerConfirmed: false,
      registerFailed: false,
      sessionToken: null,
    };
  },

  watch: {
    sessionToken(newToken) {
      localStorage.sessionToken = newToken;
    }
  },

  mounted() {
    if (localStorage.registerToken) {
      this.registerToken = localStorage.registerToken;
    }
    this.sendMailToken();
  },

  methods: {
    sendMailToken() {
      axios({
        method: "get",
        url:
          config.value("apiUrl") +
          "/users/confirm/" +
          this.$route.params.emailtoken,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.registerToken,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            localStorage.removeItem("registerToken");
            this.sessionToken = response.data.session_token;
            this.registerConfirmed = true;
            // redirect to dashboard
            setTimeout( () => this.$router.push({ path: '/dashboard'}), 5000);    
          }
        })
        .catch((error) => {
          this.registerFailed = true;
          console.log(error);
        });
    },
  },
};
</script>
<style></style>
