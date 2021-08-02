<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5" v-if="registerToken == null">
          <div class="text-center text-muted mb-4">
            <medium>Sign up</medium>
            <base-alert class="mt-4" type="danger" v-if="userExists">
              Username or mail already exists
            </base-alert>
          </div>
          <form role="form">
            <base-input
              formClasses="input-group-alternative"
              placeholder="Username"
              addon-left-icon="ni ni-hat-3"
              v-model="username"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="email"
              focused
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative"
              placeholder="Firstname"
              addon-left-icon="ni ni-single-02"
              v-model="firstname"
              focused
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative"
              placeholder="Lastname"
              addon-left-icon="ni ni-single-02"
              v-model="lastname"
              focused
            >
            </base-input>

            <div class="row my-4">
              <div class="col-12">
                <base-checkbox class="custom-control-alternative">
                  <span class="text-muted"
                    >I agree with the <a href="#!">Privacy Policy</a></span
                  >
                </base-checkbox>
              </div>
            </div>
            <div class="text-center">
              <base-button type="primary" class="my-4" @click="register()"
                >Create account</base-button
              >
            </div>
          </form>
        </div>
        <div class="card-body px-lg-5 py-lg-5" v-if="registerToken != null">
          <div class="text-center text-muted mb-4">
            <medium>Confirm your email</medium>
            <base-alert class="mt-4" type="success">
              A confirmation mail has been sent to <strong>{{ email }}</strong>
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
import jwt_decode from "jwt-decode";

export default {
  name: "register",

  data() {
    return {
      username: "rgrente",
      email: "romain.grente@gmail.com",
      firstname: "Romain",
      lastname: "Grente",
      registerState: 0,
      registerToken: null,
      userExists: false,
    };
  },

  mounted() {
    if (localStorage.registerToken) {
      this.registerToken = localStorage.registerToken;
    }
  },

  watch: {
    registerToken(newToken) {
      if (jwt_decode(newToken).step == 0) {
        this.sendConfirmMail();
      }
    }
  },

  methods: {
    test() {
      console.log("teddst");
    },
    register() {
      var bodyFormData = new FormData();
      bodyFormData.append("username", this.username);
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
          console.log(response.status);
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
            //this.registerToken = response.data.register_token;
            localStorage.registerToken = response.data.register_token;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};
</script>
<style></style>
