<template>
  <div>
    <form v-on:submit.prevent="usernameAuth()">
      <div class="alert alert-danger alert-dismissible" role="alert" v-if="invalidUsername">
        Invalid username
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="username"
          placeholder="name@example.com"
          v-model="username"
        />
        <label for="username">Email address</label>
      </div>
  

      <div class="row align-items-start mt-4">
        <div class="col my-auto">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckChecked"
              checked
            />
            <label class="form-check-label" for="flexSwitchCheckChecked"
              >Remember me</label
            >
          </div>
        </div>
        <div class="col">
          <button class="w-100 btn btn-lg btn-primary" type="submit">
            Login
          </button>
        </div>
      </div>
    </form>
    <div class="row mt-5 p-4">
      <p>
        Want to use Noth ?
        <router-link :to="'register'">register here</router-link>
      </p>
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
      username: null,
      invalidUsername: false,
      authToken: null,
      authStep: null,
      authMailStatus: null,
      sessionToken: null,
    };
  },

  mounted() {
    if (localStorage.authToken) {
      this.authToken = localStorage.authToken;
      this.authStep = jwt_decode(this.authToken).nextstep;
    } else {
      this.initAuth();
    }
  },

  watch: {
    authToken(newToken) {
      localStorage.authToken = newToken;
      this.authStep = jwt_decode(this.authToken).nextstep;
    },
    authStep(nextStep) {
      if (nextStep == 2) {
        this.sendAuthMail();
      }
    },
  },
  methods: {
    initAuth() {
      axios({
        method: "post",
        url: config.value("apiUrl") + "/authentication/init",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status == 200) {
            this.authToken = response.data.auth_token;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    usernameAuth() {
      const json = JSON.stringify({ username: this.username });
      axios({
        method: "post",
        url: config.value("apiUrl") + "/authentication/username",
        data: json,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authToken,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.authenticated) {
              localStorage.removeItem("authToken");
              this.$router.push({ path: "/dashboard" });
            } else {
              this.authToken = response.data.auth_token;
            }
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.invalidUsername = true;
          }
          console.log(error);
        });
    },
  },
};
</script>

