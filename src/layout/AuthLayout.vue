<template>
  <section class="h-100 vh-100 authlayout">
    <div class="container h-100">
      <div class="row justify-content-sm-center h-100 align-items-center">
        <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
          <div class="text-center my-5">
            <svg
              aria-hidden="true"
              focusable="false"
              width="70"
              height="70"
              data-prefix="fas"
              data-icon="fingerprint"
              class="svg-inline--fa fa-fingerprint fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <use xlink:href="#noth-logo" />
            </svg>
            <br />
            <svg
              height="50"
              viewBox="0 0 192.2 67.101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="svgGroup"
                stroke-linecap="round"
                fill-rule="evenodd"
                font-size="9pt"
                fill="currentColor"
              >
                <use xlink:href="#noth-text" />
              </g>
            </svg>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AuthLayout",
};
</script>

<style>
.authlayout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>