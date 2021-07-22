<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div>
          <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="3" align="center">
                        <v-card class="elevation-12">
              <v-toolbar color="grey darken-4" flat height="10"></v-toolbar>
              <v-tabs fixed-tabs background-color="grey darken-3" dark v-model="tab">
                <v-tab>Login</v-tab>
                <v-tab>Register</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card-text>
                    <!--<v-alert
                  type="success"
                  icon="mdi-shield-lock-outline"
                  text
                    >Enter your credentials to login</v-alert>-->
                    <v-alert
                      v-model="registerSuccess"
                      dense
                      type="info"
                      dismissible
                    >Registration success. You can now login</v-alert>
                    <v-alert
                      v-model="loginFailure"
                      dense
                      type="error"
                      dismissible
                    >Invalid login or password</v-alert>
                    <v-form @keyup.native.enter="doLogin()">
                      <v-text-field
                        label="Mail"
                        name="mail"
                        type="text"
                        prepend-inner-icon="mdi-at"
                        rounded
                        filled
                        v-model="mail"
                        class="mb-n4"
                      />
                      <v-text-field
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        prepend-inner-icon="mdi-lock"
                        rounded
                        filled
                        height="5"
                        v-model="password"
                      />
                      <v-btn color="green" block outlined rounded @click="doLogin()">Login</v-btn>
                    </v-form>
                    <h5 class="ma-2">Forgot username or password ?</h5>
                  </v-card-text>
                </v-tab-item>
                <v-tab-item>
                  <v-card-text>
                    <v-alert
                      v-model="registerErrorDuplicate"
                      dense
                      type="error"
                      dismissible
                    >This mail address is already registered</v-alert>
                    <v-form @keyup.native.enter="doRegister()">
                      <v-text-field
                        label="Enter your mail address"
                        name="registerMail"
                        type="text"
                        prepend-inner-icon="mdi-at"
                        rounded
                        filled
                        v-model="registerMail"
                        class="mb-n4"
                      />
                      <v-text-field
                        label="Enter your firstname"
                        name="firstname"
                        type="text"
                        prepend-inner-icon="mdi-at"
                        rounded
                        filled
                        v-model="firstname"
                        class="mb-n4"
                      />
                      <v-text-field
                        label="Enter your lastname"
                        name="lastname"
                        type="text"
                        prepend-inner-icon="mdi-at"
                        rounded
                        filled
                        v-model="lastname"
                        class="mb-n4"
                      />
                      <v-text-field
                        id="password"
                        label="Define your password"
                        name="password"
                        type="password"
                        prepend-inner-icon="mdi-lock"
                        rounded
                        filled
                        height="5"
                        v-model="registerPassword"
                        class="mb-n4"
                      />
                      <v-text-field
                        id="password"
                        label="Re-enter your password"
                        name="password"
                        type="password"
                        prepend-inner-icon="mdi-lock-check"
                        rounded
                        filled
                        height="5"
                        v-model="registerPasswordCheck"
                      />
                      <v-btn color="red" block outlined rounded @click="doRegister()">Register</v-btn>
                    </v-form>
                  </v-card-text>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
            </v-col>
        </v-row>
      </v-container>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import axios from "axios";
export default {
  props: {
    source: String
  },
  data: () => ({
    tab: null,
    registerMail: null,
    firstname: null,
    lastname: null,
    registerPassword: null,
    registerPasswordCheck: null,
    registerSuccess: false,
    registerErrorDuplicate: false,
    //accessToken: null,
    mail: null,
    password: null,
    loginFailure: false,
    dialog: false,
    snackbar: false,
    progressbar: false,
    activityName: null,
    activityDescription: null,
    activityFile: null,
    activityTypes: [],
    activityType: null,
    raceTypes: [],
    raceTypeId: null,
    trainingTypes: [],
    trainingTypesIds: []
  })
}
  </script>
