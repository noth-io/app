<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--7 mb-4">
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
                    <base-checkbox class="mb-3" v-model="grantTypes.AC">
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

                    <base-checkbox class="mb-3" v-model="responseTypes.code">
                      code
                    </base-checkbox>

                    <base-checkbox class="mb-3" v-model="responseTypes.IDtoken">
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

                    <base-radio class="mb-3" v-model="radios" value="John">
                      client_secret_post
                    </base-radio>
                    <base-radio
                      class="mb-3"
                      v-model="radios"
                      
                    >
                      client_secret_basic
                    </base-radio>
                    <base-radio
                      class="mb-3"
                      v-model="radios"
                      
                    >
                      client_secret_jwt
                    </base-radio>
                  </div>
                  <div class="col-lg-3 mt-5">
                    <base-radio
                      class="mb-3"
                      v-model="radios"
                      
                    >
                      private_key_jwt
                    </base-radio>
                    <base-radio
                      class="mb-3"
                      v-model="radios"
                      
                    >
                      none
                    </base-radio>
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
                    <base-button type="primary" @click="test()">Submit</base-button>
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
export default {
  name: "newclient",
  data() {
    return {
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
        none: false
      }
    };
  },
  methods: {
    test() {
      console.log(this.clientName)
      console.log(this.radios)

    }
  }
};
</script>
<style></style>
