<template>
  <div class="container-fluid m-4">
    <div class="row">
      <div class="card px-0">
        <div class="card-header bg-dark text-white">
          <div class="d-flex bd-highlight align-items-center">
            <div class="p-2 bd-highlight">
              <h5>FIDO 2 tokens</h5>
            </div>
                        <div class="ms-auto p-2 bd-highlight">
              <button
                type="button"
                class="btn btn-primary"
                @click="fido2register()"
              >
Register FIDO2 token              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
                    <div class="alert alert-success" role="alert" v-if="clientCreated">
            Client successfully <strong>created</strong>
          </div>
          <div class="alert alert-success" role="alert" v-if="clientUpdated">
            Client successfully <strong>updated</strong>
          </div>
          <div class="alert alert-success" role="alert" v-if="clientDeleted">
            Client successfully <strong>deleted</strong>
          </div>
          <table class="table align-middle">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Client ID</th>
                <th scope="col">Scopes</th>
                <th scope="col">Creation date</th>

                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fido2cred in fido2creds" :key="fido2cred.id">
                <td>dd</td>
                <td>dd</td>
                <td>dd</td>
                <td>dd</td>

                <td style="text-align: right">
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-warning dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Action
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          >Edit</a
                        >
                      </li>
                      <li><a class="dropdown-item" href="#" >Disable</a></li>
                      <li><hr class="dropdown-divider" /></li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          >Remove</a
                        >
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import config from "@/plugins/config.js";
import { Modal } from "bootstrap";
import CBOR from "@/plugins/cbor.js";

export default {
  name: "credentials",
    data() {
    return {
      fido2creds: null,
    };
  },

  mounted() {
    this.getFido2Creds();
  },
  methods: {
    getFido2Creds() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/credentials/fido2",
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data)
            this.fido2creds = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fido2register() {
      fetch(config.value("apiUrl") + "/credentials/fido2/register/begin", {
        method: "POST",
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
          return fetch(config.value("apiUrl") + "/credentials/fido2/register/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/cbor",
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
          window.location = "/ui/credentials";
        });
    },
  },
};
</script>

