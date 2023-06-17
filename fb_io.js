//vars  -------------------------------------------------------------------------------------------------------------------------
//var score = 1;
var testWord = "bob";
var userObject;
var brosData;
var userIsLogged = false;
const USERS_GAME1 = "/HOME/users/game1/"
const USERS_GAME2 = "/HOME/users/game2/"
var hasVal = false;
var userPreferedName;
//login -------------------------------------------------------------------------------------------------------------------------
function fb_login(DO_THIS, callBack) {
  console.log("logging in");
  firebase.auth().onAuthStateChanged((user) => {

    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      console.log("logged in");
      console.log("checking database");

      // my user
      userObject = {
        userID: user.uid,
        userRealName: user.displayName,
        userPhoto: user.photoURL,
      }

      // only runs if it is NOT undifended
      if (DO_THIS != undefined && DO_THIS != '') {
        DO_THIS(userObject);
      }
      if (callBack != undefined) {
        console.log("safd")
        callBack();
      }

    } else {
      console.log("not logged in");
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      });
    }
  });

}

//new or not --------------------------------------------------------------------------------------------------------------------
function checkBrosID() {
  console.log("Read Once" + userObject.userID);
  // adds bro to db :)
  firebase.database().ref(USERS_GAME1 + userObject.userID + '/').once('value', _readReg, fb_error);
  firebase.database().ref(USERS_GAME2 + userObject.userID + '/').once('value', _readReg, fb_error);
  console.log("Read Once");
  
  // checking if bro is already in db, we tryin welcome everyone here
  function _readReg(snapshot) {
    if (snapshot.val() == null) {
      firebase.database().ref(USERS_GAME1 + userObject.userID + '/').set(userObject);
      firebase.database().ref(USERS_GAME2 + userObject.userID + '/').set(userObject);
      console.log("never seen you before");
      window.location = "reg.html"
    } else {
      console.log("welcome back")
      window.location = "gameIndex.html"
    }
  }
}

//error -------------------------------------------------------------------------------------------------------------------------
function fb_error(error) {
  console.log("fb_error");
  console.log(error);
}
function fb_readError(error) {
  console.log("There was an error reading the message");
  console.error(error);
}

//form --------------------------------------------------------------------------------------------------------------------------

function submitForm() {
  console.log("in subit form")
  // parameter is used to make all the user stuff line up with my function so it works 
  fb_login(submitFormData);

}

function submitFormData() {
  var userPreferedName = document.getElementById('preferedName').value;
  var userPass = document.getElementById('psw').value;
  console.log(preferedName.value);
  console.log(psw.value);
  brosData = {
    username: userPreferedName,
    password: userPass,
    //usersRealName: user.displayName,
  }
  console.log(brosData)
  // smusher
  Object.assign(userObject, brosData)
  console.log(userObject)
  VALIDATE();
  if (hasVal === true) {
    firebase.database().ref(USERS_GAME1 + userObject.userID + '/').set(
      userObject,
    ).then(_DOTHIS)
    firebase.database().ref(USERS_GAME2 + userObject.userID + '/').set(
      userObject,
    ).then(_DOTHIS)
  }
  function _DOTHIS() {
    window.location = "gameIndex.html"
  }
}



function updateDetails() {
  VALIDATE();
  //snatch that data >:)
  var userPreferedName = document.getElementById('preferedName').value;
  var userPass = document.getElementById('psw').value;
  // this will only run if the did it properly
  if (hasVal == true) {
    //updater of game1 part
    firebase.database().ref(USERS_GAME1 + userObject.userID).once('value', function(snapshot) {
      var userData = snapshot.val();
      userData.username = userPreferedName;
      userData.password = userPass;
      firebase.database().ref(USERS_GAME1 + userObject.userID).set(userData);
    });
    //updater of game2 part
    firebase.database().ref(USERS_GAME2 + userObject.userID).once('value', function(snapshot) {
      var userData = snapshot.val(); // user data is that section in the db we lookin at
      // these things r the things we collecting from the database
      userData.username = userPreferedName;
      userData.password = userPass;
      firebase.database().ref(USERS_GAME2 + userObject.userID).set(userData);
    });
  }
}




function VALIDATE() {
  var userNameVAL = document.getElementById("preferedName").value;
  if (userNameVAL.length === 0) {
    console.log("bro rly tried to out nothing in here")
    document.getElementById("message1").innerHTML = "Invalid: Username cannot be empty, cheeky boy";
    hasVal = false;
    //not really necceray its just a precation
  } else if (userNameVAL.length > 10) {
    console.log("of this appears then something went wrong (maxlength is set in html, this is a safety protocol ))")
    document.getElementById("message1").innerHTML = "Invalid: Username MAXED at 10 characters.";
    hasVal = false;
  } else {
    console.log("congrats for loging in")
    document.getElementById("message1").innerHTML = "";
    alert("Hello " + userNameVAL);
    hasVal = true;
  }
}
