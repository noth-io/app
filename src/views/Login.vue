<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5" v-if="authStep == 1">
          <div class="text-center text-muted mb-4">
            <medium>Sign in with your credentials</medium>
            <base-alert class="mt-4" type="danger" v-if="invalidUsername">
              Invalid username
            </base-alert>
          </div>
          <form role="form" v-on:submit.prevent="usernameAuth()">
            <base-input
              formClasses="input-group-alternative mb-5"
              placeholder="Username"
              addon-left-icon="ni ni-hat-3"
              v-model="username"
            >
            </base-input>
            <base-checkbox class="custom-control-alternative">
              <span class="text-muted">Remember me</span>
            </base-checkbox>
            <div class="text-center">
              <base-button type="primary" class="my-4" @click="usernameAuth()"
                >Sign in</base-button
              >
            </div>
          </form>
        </div>
        <div class="card-body px-lg-5 py-lg-5" v-if="authStep == 2">
          <div class="text-center text-muted mb-4">
            <medium>Mail authentication</medium>
            <base-alert class="mt-4" type="success" v-if="authMailStatus == 'sent'">
              An authentication mail has been sent to <strong>{{ username }}</strong>
            </base-alert>
            <base-alert class="mt-4" type="danger" v-if="authMailStatus == 'error'">
              An error occured when trying to send authentication mail to <strong>{{ username }}</strong>
            </base-alert>
            <base-button type="primary" class="mt-4">Resend mail</base-button>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light"><small>Forgot password?</small></a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/register" class="text-light"
            ><small>Create new account</small></router-link
          >
        </div>
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
  name: "Auth",

  data() {
    return {
      username: null,
      invalidUsername: false,
      authToken: null,
      authStep: null,
      authMailStatus: null,
      sessionToken: null
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
    },
    sessionToken(newToken) {
      localStorage.sessionToken = newToken;
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
            this.authStep = jwt_decode(this.authToken).nextstep;
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
        withCredentials: true
      })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.authenticated) {
              //this.sessionToken = response.data.session_token;
              localStorage.removeItem('authToken');
              this.$router.push({ path: '/dashboard'});    
            } else {
              this.authToken = response.data.auth_token;
              this.authStep = jwt_decode(this.authToken).nextstep;
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
    sendAuthMail() {
      axios({
        method: "post",
        url: config.value("apiUrl") + "/authentication/mail",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authToken,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.authMailStatus = "sent";
          }
        })
        .catch((error) => {
          this.authMailStatus = "error";
          console.log(error);
        });
    },
    fido2register() {
      var token = this.authToken;
      fetch(config.value("apiUrl") + "/users/fido2/begin", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        credentials: "include",
      })
        .then(function (response) {
          if (response.ok) return response.arrayBuffer();
          throw new Error("Error getting registration data!");
        })
        .then(CBOR.decode)
        .then(function (options) {
          return navigator.credentials.create(options);
        })
        .then(function (attestation) {
          return fetch(config.value("apiUrl") + "/users/fido2/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/cbor",
              Authorization: "Bearer " + token,
            },
            body: CBOR.encode({
              attestationObject: new Uint8Array(
                attestation.response.attestationObject
              ),
              clientDataJSON: new Uint8Array(
                attestation.response.clientDataJSON
              ),
            }),
            credentials: "include",
          });
        })
        .then(
          function (response) {
            var stat = response.ok ? "successful" : "unsuccessful";
            alert("Registration " + stat + " More details in server log...");
          },
          function (reason) {
            alert(reason);
          }
        )
        .then(function () {
          window.location = "/";
        });
    },
    fido2authenticate() {
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
              var stat = "successful";
              vm.authToken = response.data.access_token;
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
<style></style>
