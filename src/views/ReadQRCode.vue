<template>
  <div>
    <div v-if="!isPWA">
      <button type="button" class="btn btn-primary" @click="install()">Click to install</button>
      <a href="https://app.noth-dev.cloud.meanite.fr">test</a>
    </div>
    <div v-if="isPWA">
    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <qr-stream :camera="camera" @decode="onDecode" @init="onInit">
      <div v-if="validationSuccess" class="validation-success">
        This is a URL
      </div>

      <div v-if="validationFailure" class="validation-failure">
        This is NOT a URL!
      </div>

      <div v-if="validationPending" class="validation-pending">
        Long validation in progress...
      </div>
    </qr-stream>
    </div>
  </div>
</template>

<script>
import { QrStream } from "vue3-qr-reader";

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

function showInstallPromotion() {
  alert("ciao");
  console.log(deferredPrompt);
}

export default {
  name: "ReadQRCode",
  components: { QrStream },
  data() {
    return {
      isValid: undefined,
      camera: "auto",
      result: null,
      isPWA: false
    };
  },

  created() {

this.getPWADisplayMode();
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
  });
  window.addEventListener('appinstalled', () => {
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
  alert('installed');
});
  },

  computed: {
    validationPending() {
      return this.isValid === undefined && this.camera === "off";
    },

    validationSuccess() {
      return this.isValid === true;
    },

    validationFailure() {
      return this.isValid === false;
    },
  },
  methods: {
    async install() {
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  //deferredPrompt = null;
      },
      
  getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (navigator.standalone || isStandalone) {
    this.isPWA = true;
  }
},
    onInit(promise) {
      promise.catch(console.error).then(this.resetValidationState);
    },

    resetValidationState() {
      this.isValid = undefined;
    },

    async onDecode(content) {
      this.result = content;
      this.turnCameraOff();

      // pretend it's taking really long
      await this.timeout(3000);
      this.isValid = content.startsWith("http");

      // some more delay, so users have time to read the message
      await this.timeout(2000);

      this.turnCameraOn();
    },

    turnCameraOn() {
      this.camera = "auto";
    },

    turnCameraOff() {
      this.camera = "off";
    },

    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },
  },
};
</script>

<style scoped>
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}
</style>
