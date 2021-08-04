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
                    {{ title }}
                  </h3>
                </div>
                <div class="col text-right">
                  <base-button type="primary" @click="this.$router.push({ path: '/clients/new'});">Create client</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark' : ''"
                :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
                tbody-classes="list"
                :data="clients"
              >
                <template v-slot:columns>
                  <th>Name</th>
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
                        <span >{{
                          row.item.client_name
                        }}</span>
                      </div>
                    </div>
                  </th>
                  <td>
                    {{ row.item.client_id }}
                  </td>
                  <td>
                    <span v-for="i in row.item.grant_types" :key="i">{{ i }}<br/></span>
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
                    {{ row.item.client_id_issued_at }}
                  </td>

   

                  <td class="text-right">
                    <el-tooltip placement="top" content="Edit">
                      <base-button type="primary" outline icon="ni ni-settings-gear-65" size="sm"></base-button>
                    </el-tooltip>
                                        <el-tooltip placement="top" content="Enable/Disable">
                    <base-button type="primary" outline icon="ni ni-ui-04" size="sm"></base-button>
                                        </el-tooltip>
                                                            <el-tooltip placement="top" content="Remove">

                    <base-button type="danger" outline icon="fa fa-trash" size="sm"></base-button>
                                                            </el-tooltip>
                                                                <base-switch v-model="test"></base-switch>
                  </td>
                </template>
              </base-table>
            </div>

            <div
              class="card-footer d-flex justify-content-end"
              :class="type === 'dark' ? 'bg-transparent' : ''"
            >
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "@/plugins/config.js";

export default {
  name: "clients",
  props: {
    type: {
      type: String,
    }
  },
  data() {
    return {
      test: false,
      title: "Clients",
      sessionToken: null,
      clients: [],
      tableData: [
        {
          img: "img/theme/bootstrap.jpg",
          title: "Argon Design System",
          budget: "$2500 USD",
          status: "pending",
          statusType: "warning",
          completion: 60,
        },
        {
          img: "img/theme/angular.jpg",
          title: "Angular Now UI Kit PRO",
          budget: "$1800 USD",
          status: "completed",
          statusType: "success",
          completion: 100,
        },
        {
          img: "img/theme/sketch.jpg",
          title: "Black Dashboard",
          budget: "$3150 USD",
          status: "delayed",
          statusType: "danger",
          completion: 72,
        },
        {
          img: "img/theme/react.jpg",
          title: "React Material Dashboard",
          budget: "$4400 USD",
          status: "on schedule",
          statusType: "info",
          completion: 90,
        },
        {
          img: "img/theme/vue.jpg",
          title: "Vue Paper UI Kit PRO",
          budget: "$2200 USD",
          status: "completed",
          statusType: "success",
          completion: 100,
        },
      ],
    };
  },

  mounted() {
    this.sessionToken = localStorage.sessionToken;
    this.getClients();
  },
  methods: {
    getClients() {
      axios({
        method: "get",
        url: config.value("apiUrl") + "/oauth2/clients",
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
        .then((response) => {
          if (response.status == 200) {
            console.log("response.data")
            this.clients = response.data;
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
