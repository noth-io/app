<template>
<div>
  <div v-if="registerStep == 0">
    <form v-on:submit.prevent="register()">
      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
          v-model="email"
        />
        <label for="email">Email address</label>
      </div>
      <div class="form-floating">
        <input
          type="text"
          class="form-control mt-4"
          id="firstname"
          placeholder="Firstname"
          v-model="firstname"
        />
        <label for="firstname">Firstname</label>
      </div>
      <div class="form-floating">
        <input
          type="text"
          class="form-control mt-4"
          id="lastname"
          placeholder="Lastname"
          v-model="lastname"
        />
        <label for="lastname">Lastname</label>
      </div>
      <div class="form-floating">
        <input
          type="tel"
          class="form-control mt-4"
          id="phone"
          placeholder="0"
          v-model="phone"
        />
        <label for="lastname">Phone</label>
      </div>
      <div class="row align-items-start mt-4">
        <div class="col">
          <button class="w-100 btn btn-lg btn-primary" type="submit">
            Register
          </button>
        </div>
      </div>
    </form>
    <div class="row mt-5 p-4">
      <p>
        Already registered ?
        <router-link :to="'login'">go to login</router-link>
      </p>
    </div>
  </div>
  <div v-if="registerStep == 1">
    <div class="alert alert-success" role="alert">
      A confirmation mail has been sent to <strong>{{ email }}</strong>
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
</div>
  <!--<div v-if="registerStep == 3">
    <div class="alert alert-success" role="alert">
      Please enter the <strong>OTP code</strong> sent to your mobile phone
    </div>
    <div class="alert alert-danger" role="alert" v-if="invalidOTPCode">
      Invalid OTP code
    </div>
    <form v-on:submit.prevent="validatePhone()">
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
          <button class="w-100 btn btn-lg btn-primary" type="submit">
            Validate OTP code
          </button>
        </div>
      </div>
    </form>
  </div>
  <div v-if="registerConfirmed == true">
    <div class="alert alert-success" role="alert">
      Your registration is confirmed. <br />
      You will be redirected to login in 5 seconds.
    </div>
  </div>
  <div v-if="registerFailed == true">
    <div class="alert alert-danger" role="alert">
      Your registration failed. <br />
      Resend confirmation mail to retry.
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
  </div>-->
</template>

<script>
import axios from "axios";
import config from "@/plugins/config.js";
import jwt_decode from "jwt-decode";

export default {
  name: "Register",
  data() {
    return {
      email: null,
      firstname: null,
      lastname: null,
      phone: null,
      registerToken: null,
      registerStep: 0,
      registerMail: null,
      registerConfirmToken: null,
      registerConfirmed: false,
      registerFailed: false,
      otpcode: null,
      invalidOTPCode: false,
      loginTarget: "/ui",
    };
  },
  created() {
    /*if (sessionStorage.registerToken) {
      this.registerToken = sessionStorage.registerToken;
    }
    if (localStorage.registerToken) {
      this.registerToken = localStorage.registerToken;
    }*/
    if (this.$route.params.emailtoken) {  
      this.registerStep = 2;
      this.confirmMail();
    }
  },
  watch: {
    registerToken(newToken) {
      localStorage.registerToken = newToken;
      this.registerStep = jwt_decode(newToken).step;
      this.mail = jwt_decode(this.registerToken).sub;
      if (this.registerStep == 0) {
        this.sendConfirmMail();
      }
      if (this.registerStep == 2) {
        this.sendConfirmPhone();
      }
      if (this.registerStep == 4) {
        this.exchangeRegisterToken();
      }
    },
  },
  methods: {
    register() {
      const json = JSON.stringify({ email: this.email, firstname: this.firstname, lastname: this.lastname, phone: this.phone });
      axios({
        method: "post",
        url: config.value("apiUrl") + "/v1/users",
        data: json,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status == 200) {
            //this.registerToken = response.data.register_token;
            this.registerStep = 1;
          }
        })
        .catch((error) => {
          if (error.response.status == 400) {
            this.userExists = true;
          }
          console.log(error);
        });
    },
    /*sendConfirmMail() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/v1/users/confirm/email",
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.registerToken = response.data.register_token;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },*/
    confirmMail() {
      axios({
        method: "post",
        url:
          config.value("apiUrl") +
          "/v1/users/confirm/email/" +
          this.$route.params.emailtoken,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.authenticated) {
              window.open(this.loginTarget, "_self");
            }
          }
        })
        .catch((error) => {
          this.registerFailed = true;
          console.log(error);
        });
    },
    /*sendConfirmPhone() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/v1/users/confirm/phone",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.registerToken,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.registerToken = response.data.register_token;
            //console.log(response.data)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    validatePhone() {
      const json = JSON.stringify({ otpcode: this.otpcode });
      axios({
        method: "post",
        url: config.value("apiUrl") + "/v1/users/confirm/phone",
        data: json,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.registerToken,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.registerToken = response.data.register_token;
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 401) {
            this.invalidOTPCode = true;
          }
        });
    },
    exchangeRegisterToken() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/authentication/tokenexchange",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.registerToken,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.authenticated) {
              localStorage.removeItem("registerToken");
              window.open(this.loginTarget, "_self");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },*/
  },
};
</script>
