<template>
<div v-if="$route.name != 'loginconfirmmail'">
    <div v-if="authStep == null">
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
  <div v-if="authStep == '21'">
    <div class="alert alert-success" role="alert">
      An email has been sent to <strong>{{ username }}</strong>
    </div>
    <div class="row align-items-start mt-4">
      <div class="col">
        <button
          class="w-100 btn btn-lg btn-primary"
          type="submit"
          @click.prevent="window.alert('resend')"
        >
          Resend mail
        </button>
      </div>
    </div>
  </div>
    <div v-if="authStep == '31'">
        <div class="alert alert-success" role="alert">
      Please enter the <strong>OTP code</strong> sent to your mobile phone
    </div>
            <div class="alert alert-danger" role="alert" v-if="invalidOTPCode">
      Invalid OTP code
    </div>
    <form v-on:submit.prevent="checkOTPSMS()">
      <div class="form-floating">
        <input
          type="text"
          class="form-control"
          id="otpcode"
          placeholder="000000"
          v-model="otpcode"
        />
        <label for="otpcode">OTP code</label>
      </div>
      <div class="row align-items-start mt-4">
        <div class="col">
          <button
            class="w-100 btn btn-lg btn-primary"
            type="submit"
          >
            Validate OTP code
          </button>
        </div>
      </div>
    </form>
  </div>
  <div v-if="authStep == 4">
<div class="alert alert-warning" role="alert">
Follow instructions to logged in with your <br/>FIDO 2 token</div>
<div class="spinner-border mt-4" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
  </div>
</div>
<div v-if="$route.name == 'loginconfirmmail'">
  titi
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
      mailAuthToken: null,
      invalidOTPCode: false
    };
  },

  created() {
    if (this.$route.name == "loginwithinst") {
      this.loginInst = JSON.parse(atob(this.$route.params.logininst));
      console.log("in");
      if (this.loginInst.target) {
        this.loginTarget = this.loginInst.target;
      }
    }
    if (this.$route.name == "loginconfirmmail") {
      this.mailAuthToken = this.$route.params.emailtoken;
      this.confirmAuthMail();
    }
  },

  mounted() {
    if (sessionStorage.authToken) {
      this.authToken = sessionStorage.authToken;
      this.authStep = jwt_decode(this.authToken).nextstep;
    } 
    //else {
      //this.initAuth();
    //}
  },

  watch: {
    authToken(newToken) {
      sessionStorage.authToken = newToken;
      this.authStep = jwt_decode(this.authToken).nextstep;
    },
    authStep(nextStep) {
      if (nextStep == 20) {
        this.sendAuthMail();
      }
      else if (nextStep == 30) {
        this.sendOTPSMS();
      }
      else if (nextStep == 4) {
        this.fido2Auth();
        console.log("fido2")
      }
    },
  },
  methods: {
    usernameAuth() {
      const json = JSON.stringify({ email: this.username });
      axios({
        method: "post",
        url: config.value("apiUrl") + "/v1/auth/username",
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
              sessionStorage.removeItem("authToken");
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
    sendAuthMail() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/v1/auth/email",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authToken,
        },
        withCredentials: true,
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
    confirmAuthMail() {
      axios({
        method: "post",
        url:
          config.value("apiUrl") +
          "/v1/auth/email/" +
          this.mailAuthToken,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            this.authToken = response.data.auth_token;
            this.$router.push({ path: '/login' })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sendOTPSMS() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/v1/auth/otpsms",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authToken,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            this.authToken = response.data.auth_token;
            //console.log(response.data)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkOTPSMS() {
      const json = JSON.stringify({ code: this.otpcode });
      axios({
        method: "post",
        url: config.value("apiUrl") + "/v1/auth/otpsms",
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
              sessionStorage.removeItem("authToken");
              window.open(this.loginTarget, "_self");
            } else {
              this.authToken = response.data.auth_token;
            }          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 401) {
            this.invalidOTPCode = true;
          }
        });
    },
    fido2Auth() {
      var vm = this;
      axios({
        url: config.value("apiUrl") + "/v1/auth/fido2/begin",
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
            url: config.value("apiUrl") + "/v1/auth/fido2/complete",
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
                sessionStorage.removeItem("authToken");
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

