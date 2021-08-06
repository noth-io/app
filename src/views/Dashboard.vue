<template>
  <div class="container-fluid m-4">
    <div class="row">
      <div class="card px-0">
        <div class="card-header bg-dark text-white">
          <div class="d-flex bd-highlight align-items-center">
            <div class="p-2 bd-highlight">
              <h5>Clients</h5>
            </div>
            <div class="ms-auto p-2 bd-highlight">
              <a href="/clients/new" class="btn btn-primary">Create client</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <table class="table align-middle">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Client ID</th>
                <th scope="col">Scopes</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in clients" :key="client.id">
                <td>{{ client.client_name }}</td>
                <td>{{ client.client_id }}</td>
                <td>{{ client.scope }}</td>
                <td><div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <button class="btn btn-primary me-md-2" type="button">Button</button>
  <button class="btn btn-primary" type="button">Button</button>
         <button type="button" class="btn btn-labeled btn-success">
         <span class="btn-label"><i class="fa fa-check"></i></span>Success</button>
</div></td>
              </tr>
              <!--<tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>-->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      clients: [
        {
          id: 1,
          client_id: "FJHSKHIOEZHIO",
          client_id_issued_at: 1628251109,
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

