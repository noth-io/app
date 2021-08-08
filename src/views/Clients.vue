<template>
  <!-- Client new/edit Modal -->
  <div
    class="modal fade"
    ref="clientModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div
      class="
        modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable
      "
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel" v-if="clientAction == 'update'">Edit client</h5>
                    <h5 class="modal-title" id="staticBackdropLabel" v-if="clientAction == 'create'">Create client</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="row g-3">
            <div class="col-12" v-if="clientAction == 'update'">
              <label for="clientID" class="form-label">Client ID</label>
              <input
                type="text"
                class="form-control"
                id="clientID"
                v-model="client.client_id"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="clientName" class="form-label">Client name</label>
              <input
                type="text"
                class="form-control"
                id="clientName"
                v-model="client.client_name"
              />
            </div>
            <div class="col-md-6">
              <label for="clientURI" class="form-label">Client URI</label>
              <input
                type="text"
                class="form-control"
                id="clientURI"
                v-model="client.client_uri"
              />
            </div>

            <div class="col-md-6">
              <label for="clientScope" class="form-label">Client scopes</label>
              <input
                type="text"
                class="form-control"
                id="clientScope"
                v-model="client.scope"
              />
            </div>
            <div class="col-md-6">
              <label for="clientRedirectURIS" class="form-label"
                >Client Redirect URIs</label
              >
              <input
                type="text"
                class="form-control"
                id="clientRedirectURIS"
                v-model="client.redirect_uris"
              />
            </div>
            <div class="col-md-6">
              <span>Client authentication</span>
              <div class="form-check mt-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDisabled"
                  checked
                  disabled
                />
                <label class="form-check-label" for="flexCheckDisabled">
                  client_secret_basic
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckCheckedDisabled"
                  disabled
                />
                <label class="form-check-label" for="flexCheckCheckedDisabled">
                  client_secret_post
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckCheckedDisabled"
                  disabled
                />
                <label class="form-check-label" for="flexCheckCheckedDisabled">
                  client_secret_jwt
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckCheckedDisabled"
                  disabled
                />
                <label class="form-check-label" for="flexCheckCheckedDisabled">
                  private_key_jwt
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckCheckedDisabled"
                  disabled
                />
                <label class="form-check-label" for="flexCheckCheckedDisabled">
                  none
                </label>
              </div>
            </div>
            <div class="col-md-6">
              <span>Grant types</span>
              <div class="form-check mt-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDisabled"
                  checked
                  disabled
                />
                <label class="form-check-label" for="flexCheckDisabled">
                  Authorization code
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckCheckedDisabled"
                  disabled
                />
                <label class="form-check-label" for="flexCheckCheckedDisabled">
                  Implicit
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckCheckedDisabled"
                  disabled
                />
                <label class="form-check-label" for="flexCheckCheckedDisabled">
                  Hybrid
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateClient(client.id)"
            v-if="clientAction == 'update'"
          >
            Update
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="createClient()"
            v-if="clientAction == 'create'"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Client ID/secret show Modal -->
  <div
    class="modal fade"
    ref="clientSecretModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div
      class="
        modal-dialog modal modal-dialog-centered modal-dialog-scrollable
      "
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Client created</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="row g-3">
            <div class="col-12">
              <label for="clientID" class="form-label">Client ID</label>
              <input
                type="text"
                class="form-control"
                id="clientID"
                v-model="client.client_id"
                disabled
              />
            </div>
                        <div class="col-12">
              <label for="clientSecret" class="form-label">Client secret</label>
              <input
                type="text"
                class="form-control"
                id="clientSecret"
                v-model="client.client_secret"
                disabled
              />
            </div>
            </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateClient(client.id)"
            v-if="clientAction == 'update'"
          >
            Update
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="createClient()"
            v-if="clientAction == 'create'"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid m-4">
    <div class="row">
      <div class="card px-0">
        <div class="card-header bg-dark text-white">
          <div class="d-flex bd-highlight align-items-center">
            <div class="p-2 bd-highlight">
              <h5>OAuth2 Clients</h5>
            </div>
            <div class="ms-auto p-2 bd-highlight">
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreateModal()"
              >
                Create client
              </button>
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
              <tr v-for="client in clients" :key="client.id">
                <td>{{ client.client_name }}</td>
                <td>{{ client.client_id }}</td>
                <td>{{ client.scope }}</td>
                <td>{{ client.client_id_issued_at }}</td>

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
                          @click="showEditModal(client.id)"
                          >Edit</a
                        >
                      </li>
                      <li><a class="dropdown-item" href="#">Disable</a></li>
                      <li><hr class="dropdown-divider" /></li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="deleteClient(client.id)"
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

export default {
  name: "clients",
  data() {
    return {
      clients: [],
      client: {},
      clientCreated: false,
      clientUpdated: false,
      clientDeleted: false,
      clientAction: null,
      refresh: false,
      modal: null,
    };
  },
  mounted() {
    this.getClients();
    this.modal = new Modal(this.$refs.clientModal);
    this.modalShowSecret = new Modal(this.$refs.clientSecretModal);
  },
  watch: {
    refresh(status) {
      if (status == true) {
        this.getClients();
        this.refresh = false;
      }
    },
  },
  methods: {
    showEditModal(id) {
      this.getClient(id);
      this.clientAction = "update";
      this.modal.show();
    },
    showCreateModal() {
      this.client = {
        client_name: null,
        client_uri: null,
        grant_types: ["authorization_code"],
        redirect_uris: [],
        response_types: ["code"],
        scope: "openid profile",
        token_endpoint_auth_method: "client_secret_basic",
      };
      this.clientAction = "create";
      this.modal.show();
    },
    getClients() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/oauth2/clients",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            this.clients = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createClient() {
      console.log(this.client)
      axios({
        method: "post",
        url: config.value("apiUrl") + "/oauth2/clients",
        data: this.client,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            this.client = response.data;
            this.clientCreated = true;
            this.refresh = true;
            this.modal.hide();
            this.modalShowSecret.show();

          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getClient(id) {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/oauth2/clients/" + id,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            this.client = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateClient(id) {
      axios({
        method: "put",
        url: config.value("apiUrl") + "/oauth2/clients/" + id,
        data: this.client,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            this.clientUpdated = true;
            this.refresh = true;
            this.modal.hide();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteClient(id) {
      axios({
        method: "delete",
        url: config.value("apiUrl") + "/oauth2/clients/" + id,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status == 200) {
            this.clientDeleted = true;
            this.refresh = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

