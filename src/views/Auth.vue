<template>
      <v-container class="fill-height" fluid>
     <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="3" align="center">
          <v-card elevation="6" light tag="section" v-if="getAuthStep() == 1">
            <v-card-title>
              <v-layout align-center justify-space-between>
           
                <v-flex>
                  <v-img :alt="platformName" class="ml-3" contain height="48px" position="center" src="https://www.mobygames.com/images/i/12/25/1435075.png"></v-img>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-alert
                      v-model="invalidUsername"
                      dense
                      type="warning"
                      dismissible
                    >Invalid username</v-alert>
              <v-form class="mt-5" v-on:submit.prevent="sendUsername">
                <v-text-field
            label="Username"
            outlined
                              v-model="username"></v-text-field>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
               <v-btn
      text
    >
Register              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp" @click="sendUsername">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card elevation="6" light tag="section" v-if="getAuthStep() == 4">
            <v-card-title>
              <v-layout align-center justify-space-between>
           
                <v-flex>
                  <v-img :alt="platformName" class="ml-3" contain height="48px" position="center" src="https://www.mobygames.com/images/i/12/25/1435075.png"></v-img>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
             
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
               <v-btn
      text @click="fido2register"
    >
Register              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp" @click="fido2authenticate">
                Authenticate
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card elevation="6" light tag="section" v-if="getAuthStep() == 2">
            <v-card-title>
              <v-layout align-center justify-space-between>
           
                <v-flex>
                  <v-img :alt="platformName" class="ml-3" contain height="48px" position="center" src="https://www.mobygames.com/images/i/12/25/1435075.png"></v-img>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
             <v-alert
                      v-if="authMailStatus === 'send'"
                      dense
                      type="warning"
                      dismissible
                    >Invalid username</v-alert>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp" @click="sendAuthMail">
                Send authentication mail
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
import CBOR from "@/cbor.js";
import jwt_decode from "jwt-decode";
import config from "@/plugins/config.js"

export default {
  name: 'App',

  data: () => ({
    username: null,
    invalidUsername: false,
    authToken: null,
    authMailStatus: null
  }),

  mounted() {
    if(localStorage.authToken) {
      this.authToken = localStorage.authToken;
    }
    else {
      this.initAuth()
    }
    console.log(config.value('apiUrl'))
  },

  watch: {
    authToken(newAuthToken) {
      localStorage.authToken = newAuthToken;
    }
  },

  methods: {
    initAuth() {
      axios({
        method: "post",
        url: config.value('apiUrl') + "/authentication/init",
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.status == 200) {
            this.authToken = response.data.access_token
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAuthStep() {
      var authStep = 0;
      if (this.authToken != null) {
        authStep = jwt_decode(this.authToken).authstep;
      }
      return authStep;
    },
    sendUsername() {
      const json = JSON.stringify({ username: this.username });
      axios({
        method: "post",
        url: config.value('apiUrl') + "/authentication/username",
        data: json,
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.status == 200) {
            this.authToken = response.data.access_token
            this.invalidUsername = false
          }

        })
        .catch(error => {
          if (error.response.status == 401) {
            this.invalidUsername = true
          }
          console.log(error);
        });
    },
    sendAuthMail() {
      axios({
        method: "post",
        url: config.value('apiUrl') + "/authentication/mail",
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authToken }
      })
        .then(response => {
          if (response.status == 200) {
            this.authMailStatus = "send";
          }
        })
        .catch(error => {
          this.authMailStatus = "error";
          console.log(error);
        });
    },
    fido2register() {
      var token = this.authToken
      fetch(config.value('apiUrl') + '/users/fido2/begin', {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + token},
      credentials: 'include'
    }).then(function(response) {
      if(response.ok) return response.arrayBuffer();
      throw new Error('Error getting registration data!');
    }).then(CBOR.decode).then(function(options) {
      return navigator.credentials.create(options);
    }).then(function(attestation) {
      return fetch(config.value('apiUrl') + '/users/fido2/complete', {
        method: 'POST',
        headers: {'Content-Type': 'application/cbor', 'Authorization': 'Bearer ' + token},
        body: CBOR.encode({
          "attestationObject": new Uint8Array(attestation.response.attestationObject),
          "clientDataJSON": new Uint8Array(attestation.response.clientDataJSON),
        }),
        credentials: 'include'
      });
    }).then(function(response) {
      var stat = response.ok ? 'successful' : 'unsuccessful';
      alert('Registration ' + stat + ' More details in server log...');
    }, function(reason) {
      alert(reason);
    }).then(function() {
      window.location = '/';
    });
  },
  fido2authenticate() {
    var vm = this;
    axios({
      url: config.value('apiUrl') + '/authentication/fido2/begin',
      method: 'post',
      headers: {'Authorization': 'Bearer ' + vm.authToken},
      withCredentials: true,
      responseType: 'arraybuffer'
    }).then(response => {
      if(response.status == 200) return response.data;
      throw new Error('No credential available to authenticate!');
    }).then(CBOR.decode).then(function(options) {
      return navigator.credentials.get(options);
    }).then(function(assertion) {
      return axios({
        url: config.value('apiUrl') + '/authentication/fido2/complete',
        method: 'post',
        headers: {'Content-Type': 'application/cbor', 'Authorization': 'Bearer ' + vm.authToken},
        data: CBOR.encode({
          "credentialId": new Uint8Array(assertion.rawId),
          "authenticatorData": new Uint8Array(assertion.response.authenticatorData),
          "clientDataJSON": new Uint8Array(assertion.response.clientDataJSON),
          "signature": new Uint8Array(assertion.response.signature)
        }),
        withCredentials: true
      })
    }).then(function(response) {
      if(response.status == 200) {
        var stat = 'successful';
        vm.authToken = response.data.access_token;
      }
      else {
        stat = 'unsuccessful';
      }
        alert('Authentication ' + stat + ' More details in server log...');
    }, function(reason) {
      alert(reason);
    });
  }
  }
};
</script>