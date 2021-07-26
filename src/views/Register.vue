<template>
<v-container class="fill-height" fluid>
     <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="3" align="center">
          <v-card elevation="6" light tag="section" v-if="registerState == 0">
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
              <v-form class="mt-5" v-on:submit.prevent="register">
                <v-text-field
            label="Username"
            outlined v-model="username"></v-text-field>
                           <v-text-field
            label="Mail"
            outlined v-model="email"></v-text-field>
                            <v-text-field
            label="Firstname"
            outlined v-model="firstname"></v-text-field>
                            <v-text-field
            label="Lastname"
            outlined v-model="lastname"></v-text-field> 
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
               <v-btn
      text
    >
Cancel              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp" @click="register">
                Register
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card elevation="6" light tag="section" v-if="registerState == 1">
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
  border="bottom"
  color="green"
  type="success"
></v-alert>
            
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
               <v-btn
      text
    >
Cancel              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :large="$vuetify.breakpoint.smAndUp">
                Resend mail
              </v-btn>
            </v-card-actions>
          </v-card>



        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
import config from "@/plugins/config.js"

export default {
  name: 'Auth',

  data: () => ({
    username: null,
    email: null,
    firstname: null,
    lastname: null,
    registerState: 0,
    authToken: null
  }),

  mounted() {
    if(localStorage.authToken) {
      this.authToken = localStorage.authToken;
    }
    else {
      this.initAuth()
    }
  },

  watch: {
    authToken(newAuthToken) {
      localStorage.authToken = newAuthToken;
    }
  },

  methods: {
    register() {
      var bodyFormData = new FormData();
      bodyFormData.append('username', this.username);
      bodyFormData.append('email', this.email);   
      bodyFormData.append('firstname', this.firstname);   
      bodyFormData.append('lastname', this.lastname);   

      axios({
        method: "post",
        url: config.value('apiUrl') + "/users/",
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response.status)
          if (response.status == 201) {
            console.log("ok");
            console.log(this.sendUsername());
            /*
            if (this.authToken) {
              console.log("send email")
              this.registerState = 1
            }*/
          }
        })
        /*.catch(error => {
          if (error.response.status == 400) {
            console.log("duplicated")
          }
          console.log(error);
        });*/
    }
  },
  sendConfirmMail() {
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
          }

        })
        .catch(error => {
          if (error.response.status == 401) {
            this.invalidUsername = true
          }
          console.log(error);
        });
    },
}
</script>