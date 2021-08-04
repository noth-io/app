<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--7 mb-4">
      <modal v-model:show="clientCreated">
        <template v-slot:header>
          <h5 class="modal-title" id="exampleModalLabel">
            Client created successfully
          </h5>
        </template>

        <div class="py-3 text-center">
          <i class="ni ni-bell-55 ni-3x"></i>
          <h4 class="heading mt-4">Please keep the client secret below safe</h4>
          <h5 class="mb-4">You can't get it after closing this window</h5>

          <base-input
            alternative=""
            label="Client ID"
            input-classes="form-control-alternative"
            v-model="clientID"
            disabled
          />
          <base-input
            alternative=""
            label="Client secret"
            input-classes="form-control-alternative"
            v-model="clientSecret"
            disabled
          />
        </div>
        <template v-slot:footer>
          <base-button
            type="primary"
            outline
            @click="
              clientCreated = false;
              this.$router.push({ path: '/clients' });
            "
            >Close</base-button
          >
          <base-button type="primary" class="ml-auto" @click="copyClientID()"
            >Copy ID</base-button
          >
          <base-button type="danger" @click="copyClientSecret()"
            >Copy secret</base-button
          >
        </template>
      </modal>
      <div class="row">
        <div class="col-xl-12 order-xl-1">
          <card shadow type="secondary">
            <template v-slot:header>
              <div class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">New client</h3>
                  </div>
                </div>
              </div>
            </template>

            <form>
              <h6 class="heading-small text-muted mb-4">Client informations</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Name"
                      placeholder="Name"
                      input-classes="form-control-alternative"
                      v-model="clientName"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Application URL"
                      placeholder="https://example.com"
                      input-classes="form-control-alternative"
                      v-model="clientURL"
                    />
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-lg-3">
                    <h4 class="mb-4">Grant types</h4>
                    <base-checkbox
                      class="mb-3"
                      v-model="grantTypes.AC"
                      checked
                      disabled
                    >
                      Authorization code
                    </base-checkbox>
                    <base-checkbox
                      class="mb-3"
                      v-model="grantTypes.ROP"
                      disabled
                    >
                      Resource owner password
                    </base-checkbox>
                    <base-checkbox
                      class="mb-3"
                      v-model="grantTypes.IMP"
                      disabled
                    >
                      Implicit
                    </base-checkbox>
                  </div>
                  <div class="col-lg-3">
                    <h4 class="mb-4">Response types</h4>

                    <base-checkbox
                      class="mb-3"
                      v-model="responseTypes.code"
                      disabled
                      checked
                    >
                      code
                    </base-checkbox>

                    <base-checkbox
                      class="mb-3"
                      v-model="responseTypes.IDtoken"
                      disabled
                    >
                      id_token
                    </base-checkbox>
                    <base-checkbox
                      class="mb-3"
                      v-model="responseTypes.token"
                      disabled
                    >
                      token
                    </base-checkbox>
                    <base-checkbox
                      class="mb-3"
                      v-model="responseTypes.none"
                      disabled
                    >
                      none
                    </base-checkbox>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Redirect URI(s)"
                      placeholder="https://example.com/redirect_uri"
                      input-classes="form-control-alternative"
                      v-model="clientRedirectURI"
                    />
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Scopes"
                      placeholder="openid profile"
                      input-classes="form-control-alternative"
                      v-model="scopes"
                    />
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-lg-3">
                    <h4 class="mb-4">Token endpoint auth method</h4>

                    <base-checkbox class="mb-3" v-model="radios" disabled>
                      client_secret_post
                    </base-checkbox>
                    <base-checkbox
                      class="mb-3"
                      v-model="radios"
                      checked
                      disabled
                    >
                      client_secret_basic
                    </base-checkbox>
                    <base-checkbox class="mb-3" v-model="radios" disabled>
                      client_secret_jwt
                    </base-checkbox>
                  </div>
                  <div class="col-lg-3 mt-5">
                    <base-checkbox class="mb-3" v-model="radios" disabled>
                      private_key_jwt
                    </base-checkbox>
                    <base-checkbox class="mb-3" v-model="radios" disabled>
                      none
                    </base-checkbox>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-12 text-center">
                    <base-button
                      outline
                      type="primary"
                      @click="this.$router.push({ path: '/clients' })"
                      >Cancel</base-button
                    >
                    <base-button type="primary" @click="createClient()"
                      >Submit</base-button
                    >
                  </div>
                </div>
              </div>
            </form>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "@/plugins/config.js";

export default {
  name: "newclient",
  data() {
    return {
      clientCreated: false,
      clientID: "",
      clientSecret: "",
      clientName: "",
      clientURL: "",
      clientRedirectURI: "",
      scopes: "",
      radios: "",
      grantTypes: {
        AC: false,
        ROP: false,
        IMP: false,
      },
      responseTypes: {
        code: false,
        IDtoken: false,
        token: false,
        none: false,
      },
    };
  },
  methods: {
    test() {
      console.log(this.clientName);
      console.log(this.grantTypes.AC);
    },
    copyClientID() {
      navigator.clipboard.writeText(this.clientID);
    },
    copyClientSecret() {
      navigator.clipboard.writeText(this.clientSecret);
    },
    createClient() {
      const json = {
        client_name: this.clientName,
        client_uri: this.clientURL,
        grant_types: ["authorization_code"],
        redirect_uris: [this.clientRedirectURI],
        response_types: ["code"],
        scope: this.scopes,
        token_endpoint_auth_method: "client_secret_basic",
      };
      axios({
        method: "post",
        url: config.value("apiUrl") + "/oauth2/clients",
        data: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            this.clientID = response.data.client_id;
            this.clientSecret = response.data.client_secret;
            this.clientCreated = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style></style>
