<template>
  <div class="container-fluid m-4">
    <div class="row">
      <div class="card px-0">
        <div class="card-header bg-dark text-white">
          <div class="d-flex bd-highlight align-items-center">
            <div class="p-2 bd-highlight">
              <h5>Credentials</h5>
            </div>
          </div>
        </div>
        <div class="card-body">
Credentials        </div>
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
  name: "credentials",
};
</script>

