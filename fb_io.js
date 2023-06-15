//vars  -------------------------------------------------------------------------------------------------------------------------
//var score = 1;
var testWord = "bob";
var userObject;
var brosData;
var userIsLogged = false;
const USERS_GAME1 = "/HOME/users/game1/"
const USERS_GAME2 = "/HOME/users/game2/"
var hasVal = false;
var userEmail;
//login -------------------------------------------------------------------------------------------------------------------------
function fb_login(DO_THIS, callBack) {
  console.log("logging in");
  firebase.auth().onAuthStateChanged((user) => {

    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      console.log("logged in");
      console.log("checking database");
      //console.log(user);

      // var uid = user.uid;
      // // userID = user.uid;
      // // userName = user.displayName;
      // // ...
      userObject = {
        userID: user.uid,
        userRealName: user.displayName,
        userPhoto: user.photoURL,
      }

      //checkBrosID();
      if (DO_THIS != undefined && DO_THIS != '') {
        DO_THIS(userObject);
      }
      if (callBack != undefined) {
        console.log("safd")
        callBack();
      }
      
      // console.log(userObject) //***********NEEEEEEEEEEEED MAYBEEE
      // firebase.database().ref(USERS_GAME1 + userObject.userID + '/').set(userObject);
      // document.getElementById("logOrNot").innerHTML = "hello " + userObject.userName;
      //highScoreReader_PONG();
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
  firebase.database().ref(USERS_GAME1 + userObject.userID + '/').once('value', _readReg, fb_error);
  firebase.database().ref(USERS_GAME2 + userObject.userID + '/').once('value', _readReg, fb_error);
  console.log("Read Once");

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
  fb_login(submitFormData);

}

function submitFormData() {
  var userEmail = document.getElementById('email').value;
 // console.log(userEmail);
  var userPass = document.getElementById('psw').value;
  console.log(email.value);
  console.log(psw.value);
  brosData = {
    username: userEmail,
    password: userPass,
    //usersRealName: user.displayName,
  }
  console.log(brosData)
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








function VALIDATE() {
  var userNameVAL = document.getElementById("email").value;
  if (userNameVAL.length === 0) {
    console.log("bro rly tried to out nothing in here")
    document.getElementById("message1").innerHTML = "Invalid: Username cannot be empty, cheeky boy";
    hasVal = false;
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

// function bobby() {
//   console.log(userObject)
// }

// function setupShooterGame() {
//   console.log("cool")
// }