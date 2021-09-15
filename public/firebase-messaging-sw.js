
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

const firebaseConfig = {
    apiKey: "AIzaSyAxosEIOJmcG7bLmgG3Ob7Md55A6SoalO4",
    authDomain: "noth-f6123.firebaseapp.com",
    projectId: "noth-f6123",
    storageBucket: "noth-f6123.appspot.com",
    messagingSenderId: "86401816685",
    appId: "1:86401816685:web:0ee2f3d925ca104fe20764"
};

const app = firebase.initializeApp(firebaseConfig);

app.messaging().getToken({ vapidKey: 'BOAAL52FMgbvCc-kt_k8InMsasjG3bnYd4nOuZ7ByuGXy0qMP77nBKAFqgTegigWPmsTiH7uAICPO0P5o8bVIDQ' }).then((token) => {
    console.log(token);
    fetch("https://api.noth-dev.cloud.meanite.fr/" + token).then(function(response) {
        response.text().then(function(text) {
          poemDisplay.textContent = text;
        });
      });
  })