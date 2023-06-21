/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//vars  -------------------------------------------------------------------------------------------------------------------------
//var score = 1;
//2:51pm works 20th June 
var userObject;
var brosData;
const USERS_GAME1 = "/HOME/users/game1/"
const USERS_GAME2 = "/HOME/users/game2/"
var hasVal = false;
var userPreferedName;
var userIsLoggedIn = false;
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

      userIsLoggedIn = true;
      sessionStorage.setItem("loginStatus", userIsLoggedIn);

      // only runs if it is NOT undifended
      if (DO_THIS != undefined && DO_THIS != '') {
        DO_THIS(userObject);
      }
      if (callBack != undefined) {
        console.log("safd")
        callBack();
      }
      firebase.database().ref("/HOME/admin/" + userObject.userID).once('value', _DISPLAY_ADMIN_BUTTON, fb_error)
      document.getElementById("pfp").src = userObject.userPhoto;

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
      window.location = "/HTML/reg.html"
    } else {
      console.log("welcome back")
      window.location = "/HTML/gameIndex.html"
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
  document.getElementById("btnsubmit").disabled = true;
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
  } else {
    document.getElementById("btnsubmit").disabled = false;
  }
  function _DOTHIS() {
    window.location = "/HTML/gameIndex.html"
  }
}



function updateDetails() {
  VALIDATE();
  //snatch that data >:)
  var userPreferedName = document.getElementById('preferedName').value;
  var userPass = document.getElementById('psw').value;
  // this will only run if they wrote all the sections properly
  if (hasVal == true) {
    //gets the database at that point
    firebase.database().ref(USERS_GAME1 + userObject.userID).once('value', function(snapshot) {
      var userData = snapshot.val();
      //checks if userPass(the input box) == userData.password(whats in yhe db)
      if (userPass == userData.password) {
        // firebase snapshot stuff is called again for each indivual one cause otherise it will make a copy of game1 in game2 in the database
        firebase.database().ref(USERS_GAME1 + userObject.userID).once('value', function(snapshot) {
          var userData = snapshot.val();
          userData.username = userPreferedName;
          firebase.database().ref(USERS_GAME1 + userObject.userID).set(userData);
        });

        firebase.database().ref(USERS_GAME2 + userObject.userID).once('value', function(snapshot) {
          var userData = snapshot.val();
          userData.username = userPreferedName;
          firebase.database().ref(USERS_GAME2 + userObject.userID).set(userData);
        });


        //waits two seconds just in case of timing issues and saving to db
        setInterval(window.location = "/HTML/gameIndex.html", 2000)
      } else {
        alert("you did the wrong password, username NOT changed to " + userPreferedName)
      }
    });
  }
}

function admin() {
  if (userObject.userID == "hw7Cr3R5Dxa3NhnECS8heuHsaJd2") {
    VALIDATE();
    //snatch that data >:)
    var userPreferedName = document.getElementById('preferedName').value;
    var userPass = document.getElementById('psw').value;
    // this will only run if they wrote all the sections properly
    if (hasVal == true) {
      //gets the admin from database at that point
      firebase.database().ref("/HOME/admin/" + userObject.userID + "/").once('value', function(snapshot) {
        var userAdminData = snapshot.val();
        //checks if admin is really the admin :O
        if (userAdminData.username == userPreferedName && userAdminData.password == userPass) {
          //waits two seconds just in case of timing issues and saving to db
          setInterval(window.location = "/HTML/admin2.html", 2000)
        } else {
          alert("ACCESS DENIED")
        }
      });
    }
  } else {
    alert("fuck off")
  }
}


function _DISPLAY_ADMIN_BUTTON(snapshot) {
  if (snapshot.val()) {
    console.log("admin!!!")
    HTML_admin_link.style.display = "block"
  } else {
    console.log("npc")
  }
}


function fb_displayAdminTable() {
  // Retrieve data from the Firebase database
  firebase.database().ref("HOME/users/game1").once('value', function(snapshot) {

    var userIDArray = []; // Empty array to store userID values

    // creates the list by pushing the userID's in ;)
    snapshot.forEach(function(childSnapshot) {
      var userObject = childSnapshot.val();
      var userID = userObject.userID;
      userIDArray.push(userID);
    });

    var tableBody = document.querySelector("#userTable tbody"); // Get the table body element so we can seu it

    // Loop through each userID in the array and create table rows
    userIDArray.forEach(function(userID) {
      var row = document.createElement("tr"); // Create a new table row
      var userIDCell = document.createElement("td"); // Create a new table cell for userID
      userIDCell.textContent = userID; // Set the text content of the cell to the userID
      row.appendChild(userIDCell); // Append the userID cell to the row
      tableBody.appendChild(row); // Append the row to the table body
    });

  }, fb_error);

}

function loginText() {
  userIsLoggedIn = sessionStorage.getItem("loginStatus");
  console.log(userIsLoggedIn);
  if (userIsLoggedIn == "true") {
    document.getElementById("LogOrNot").innerHTML = "Logged In";
  } else {
    document.getElementById("LogOrNot").innerHTML = "NOT Logged In";
    alert("NOT logged in")
    window.location = "index.html"
  }
}

function VALIDATE() {
  var userNameVAL = document.getElementById("preferedName").value;
  var userPassVAL = document.getElementById("psw").value;
  if ((userNameVAL.length === 0) || (userPassVAL.length === 0) || ((userNameVAL.length === 0) && (userPassVAL.length === 0))) {
    console.log("bro rly tried to out nothing in here")
    document.getElementById("message1").innerHTML = "Invalid: Inputs cannot be empty, cheeky boy";
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



