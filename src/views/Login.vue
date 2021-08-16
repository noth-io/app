<template>
  <div v-if="authStep == 1">
    <form v-on:submit.prevent="usernameAuth()">
      <div
        class="alert alert-danger alert-dismissible"
        role="alert"
        v-if="invalidUsername"
      >
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
  <div v-if="authStep == 3">
<div class="alert alert-warning" role="alert">
Follow instructions to logged in with your <br/>FIDO 2 token</div>
<div class="spinner-border mt-4" role="status">
  <span class="visually-hidden">Loading...</span>
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
      loginInst: null,
      loginTarget: "/ui",
    };
  },

  created() {
    console.log(this.$route.params.logininst);
    if (this.$route.params.logininst) {
      this.loginInst = JSON.parse(atob(this.$route.params.logininst));
      console.log("in");
      if (this.loginInst.target) {
        this.loginTarget = this.loginInst.target;
      }
    }
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
      else if (nextStep == 3) {
        this.fido2Auth();
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
              window.open(this.loginTarget, "_self");
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
    fido2Auth() {
      var vm = this;
      axios({
        url: config.value("apiUrl") + "/authentication/fido2/begin",
        method: "post",
        headers: { Authorization: "Bearer " + vm.authToken },
        withCredentials: true,
        responseType: "arraybuffer",
      })
        .then((response) => {
          if (response.status == 200) return response.data;
          throw new Error("No credential available to authenticate!");
        })
        .then(CBOR.decode)
        .then(function (options) {
          return navigator.credentials.get(options);
        })
        .then(function (assertion) {
          return axios({
            url: config.value("apiUrl") + "/authentication/fido2/complete",
            method: "post",
            headers: {
              "Content-Type": "application/cbor",
              Authorization: "Bearer " + vm.authToken,
            },
            data: CBOR.encode({
              credentialId: new Uint8Array(assertion.rawId),
              authenticatorData: new Uint8Array(
                assertion.response.authenticatorData
              ),
              clientDataJSON: new Uint8Array(assertion.response.clientDataJSON),
              signature: new Uint8Array(assertion.response.signature),
            }),
            withCredentials: true,
          });
        })
        .then(
          function (response) {
            if (response.status == 200) {
              if (response.data.authenticated) {
                localStorage.removeItem("authToken");
                window.open(vm.loginTarget, "_self");
              } else {
                this.authToken = response.data.auth_token;
              }
            } else {
              stat = "unsuccessful";
            }
            alert("Authentication " + stat + " More details in server log...");
          },
          function (reason) {
            alert(reason);
          }
        );
    },
  },
};
</script>

