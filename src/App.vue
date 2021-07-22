<template>
  <v-app style="background: url('https://cdn.vuetifyjs.com/images/parallax/material2.jpg') no-repeat center center fixed !important;  background-size: cover">
      <v-main>
      <v-container class="fill-height" fluid>
     <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="3" align="center">
          <v-card elevation="6" light tag="section" v-if="accessToken == null">
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
              <v-form class="mt-5">
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
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp" @click="sendUsername()">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card elevation="6" light tag="section" v-if="accessToken != null">
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
              <v-form class="mt-5">
                <v-text-field
            label="Usernameeee"
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
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp" @click="sendUsername()">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>
    </v-container>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script src="@/cbor.js"></script>
<script>
import axios from "axios";

export default {
  name: 'App',

  data: () => ({
    username: null,
    invalidUsername: false,
    accessToken: null
  }),

  methods: {
    sendUsername() {
      const json = JSON.stringify({ username: this.username });
      axios({
        method: "post",
        url: "https://localhost:5000/api/authenticate/username",
        data: json,
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.status == 200) {
            this.accessToken = response.data.access_token
            this.invalidUsername = false
            this.fido2register()
          }

        })
        .catch(error => {
          if (error.response.status == 401) {
            this.invalidUsername = true
          }
          console.log(error);
        });
    },
    fido2register() {
      fetch('https://localhost:5000/api/register/fido2/begin', {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + this.accessToken},
    }).then(function(response) {
      if(response.ok) return response.arrayBuffer();
      throw new Error('Error getting registration data!');
    }).then(CBOR.decode).then(function(options) {
      return navigator.credentials.create(options);
    }).then(function(attestation) {
      return fetch('/api/register/fido2/complete', {
        method: 'POST',
        headers: {'Content-Type': 'application/cbor', 'Authorization': 'Bearer ' + this.accessToken},
        body: CBOR.encode({
          "attestationObject": new Uint8Array(attestation.response.attestationObject),
          "clientDataJSON": new Uint8Array(attestation.response.clientDataJSON),
        })
      });
    }).then(function(response) {
      var stat = response.ok ? 'successful' : 'unsuccessful';
      alert('Registration ' + stat + ' More details in server log...');
    }, function(reason) {
      alert(reason);
    }).then(function() {
      window.location = '/';
    });
    }
  }
};
</script>
