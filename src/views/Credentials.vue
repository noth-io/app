<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--7 mb-4">
      <div class="row">
        <div class="col">
          <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
            <div
              class="card-header border-0"
              :class="type === 'dark' ? 'bg-transparent' : ''"
            >
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
                    FIDO 2 tokens
                  </h3>
                </div>
                <div class="col text-right">
                  <base-button
                    type="primary"
                    @click="fido2register()"
                    >Register FIDO2 token</base-button
                  >
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark' : ''"
                :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
                tbody-classes="list"
                :data="fido2creds"
              >
                <template v-slot:columns>
                  <th>ID</th>
                  <th>Client ID</th>
                  <th>Grant types</th>
                  <th>Status</th>
                  <th>Creation date</th>
                  <th></th>
                </template>

                <template v-slot:default="row">
                  <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body">
                        <span>{{ row.item.id }}</span>
                      </div>
                    </div>
                  </th>
                  <td>
                    dd
                  </td>
                  <td>
                    dd
                  </td>
                  <td>
                    <badge class="badge-dot mr-4" type="success">
                      <!--<i :class="`bg-${row.item.statusType}`"></i>
                      <span class="status">{{ row.item.status }}</span>-->
                      <i :class="`bg-success`"></i>
                      <span class="status">Enable</span>
                    </badge>
                  </td>
                  <td>
                    dd
                  </td>

                  <td class="text-right">
                    <el-tooltip placement="top" content="Edit">
                      <base-button
                        type="primary"
                        outline
                        icon="ni ni-settings-gear-65"
                        size="sm"
                      ></base-button>
                    </el-tooltip>
                    <el-tooltip placement="top" content="Enable/Disable">
                      <base-button
                        type="primary"
                        outline
                        icon="ni ni-ui-04"
                        size="sm"
                      ></base-button>
                    </el-tooltip>
                    <el-tooltip placement="top" content="Remove">
                      <base-button
                        type="danger"
                        outline
                        icon="fa fa-trash"
                        size="sm"
                      ></base-button>
                    </el-tooltip>
                    <base-switch v-model="test"></base-switch>
                  </td>
                </template>
              </base-table>
            </div>

            <div
              class="card-footer d-flex justify-content-end"
              :class="type === 'dark' ? 'bg-transparent' : ''"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "@/plugins/config.js";
import CBOR from "@/plugins/cbor.js";

export default {
  name: "clients",
  props: {
    type: {
      type: String,
    },
  },
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
            console.log("response.data")
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
          window.location = "/credentials";
        });
    },
  },
};
</script>
<style></style>
