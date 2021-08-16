import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCookies from 'vue3-cookies';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPhone } from "@fortawesome/free-solid-svg-icons";

library.add(faPhone);

const app = createApp(App);
app.use(router);
app.use(VueAxios, axios);
app.mount('#app');
//app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
router.app = app;
app.use(VueCookies);
