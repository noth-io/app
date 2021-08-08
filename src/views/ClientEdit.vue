<template>


  <div class="container-fluid m-4">
    <div class="row">
      <div class="card px-0">
        <div class="card-header bg-dark text-white">
          <div class="d-flex bd-highlight align-items-center">
            <div class="p-2 bd-highlight">
              <h5>Edit client</h5>
            </div>
            <div class="ms-auto p-2 bd-highlight">
              <a href="/clients" class="btn btn-primary">Go back</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form v-on:submit.prevent="usernameAuth()">

          <div class="row">
            <div class="col-lg-6">
    <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control mt-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
  </div>
              </div>
                          <div class="col-lg-6">
    <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control mt-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
  </div>
              </div>
          </div>
                    <div class="row mt-4">
                                  <div class="col-lg-6">
                                    <div class="form-check">
                                      <p>Grant type</p>
  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" checked disabled>
  <label class="form-check-label" for="defaultCheck1">
    Default checkbox
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="defaultCheck2" disabled>
  <label class="form-check-label" for="defaultCheck2">
    Disabled checkbox
  </label>
</div>
</div>
</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "Login",
  data() {
    return {
      clients: [
        {
          id: 1,
          client_id: "FJHSKHIOEZHIO",
          client_id_issued_at:
            moment(1628260597610).format("DD/MM/YYYY - HH:mm"),
          client_name: "test",
          client_uri: "https://test",
          grant_types: ["authorization_code"],
          redirect_uris: ["https://test/redirect_uri"],
          response_types: ["code"],
          scope: "openid profile",
          token_endpoint_auth_method: "basic",
          enabled: true,
        },
        {
          id: 1,
          client_id: "FJHSKHIOEZHIO",
          client_id_issued_at:
            moment(1628260597610).format("DD/MM/YYYY - HH:mm"),
          client_name: "test",
          client_uri: "https://test",
          grant_types: ["authorization_code"],
          redirect_uris: ["https://test/redirect_uri"],
          response_types: ["code"],
          scope: "openid profile",
          token_endpoint_auth_method: "basic",
          enabled: true,
        },
      ],
    };
  },
};
</script>