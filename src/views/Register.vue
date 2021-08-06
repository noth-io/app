<template>
  <div v-if="registerStep == null">
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
      <div class="row align-items-start mt-4">
        <div class="col">
          <button
            class="w-100 btn btn-lg btn-primary"
            type="submit"
          >
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
  <div v-if="registerStep == 1 && registerConfirmToken == null">
    <div class="alert alert-success" role="alert">
      A confirmation mail has been sent to <strong>{{ mail }}</strong>
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
  </div>
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
      registerToken: null,
      registerStep: null,
      registerMail: null,
      registerConfirmToken: null,
      registerConfirmed: false,
      registerFailed: false,
    };
  },
  mounted() {
    if (localStorage.registerToken) {
      this.registerToken = localStorage.registerToken;
      if (this.$route.params.emailtoken) {
        this.registerConfirmToken = this.$route.params.emailtoken;
        this.confirmMail();
      }
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
    },
  },
  methods: {
    register() {
      var bodyFormData = new FormData();
      bodyFormData.append("username", this.email);
      bodyFormData.append("email", this.email);
      bodyFormData.append("firstname", this.firstname);
      bodyFormData.append("lastname", this.lastname);

      axios({
        method: "post",
        url: config.value("apiUrl") + "/users/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          if (response.status == 201) {
            this.registerToken = response.data.register_token;
          }
        })
        .catch((error) => {
          if (error.response.status == 400) {
            this.userExists = true;
          }
          console.log(error);
        });
    },
    sendConfirmMail() {
      axios({
        method: "post",
        url: config.value("apiUrl") + "/users/confirm",
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
        });
    },
    confirmMail() {
      axios({
        method: "get",
        url:
          config.value("apiUrl") +
          "/users/confirm/" +
          this.registerConfirmToken,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.registerToken,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            localStorage.removeItem("registerToken");
            this.registerConfirmed = true;
            // redirect to dashboard
            setTimeout(() => this.$router.push({ path: "/login" }), 5000);
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
