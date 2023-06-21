var database;

/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase consol. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBz4XDri3LdjRf6IPVSRcchTSpCij84JPo",
    authDomain: "website-dhruv2023y12.firebaseapp.com",
    databaseURL: "https://website-dhruv2023y12-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "website-dhruv2023y12",
    storageBucket: "website-dhruv2023y12.appspot.com",
    messagingSenderId: "65142065578",
    appId: "1:65142065578:web:c3bb646b4a5b75675143d3",
    measurementId: "G-QTWQ5JMZX2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // This log prints the firebase object to the console to show that it is working.
  // As soon as you have the script working, delete this log.
  console.log(firebase);
}
