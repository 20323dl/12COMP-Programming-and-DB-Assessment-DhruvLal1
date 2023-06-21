// FIREBASE FUNCTION FOR PONG HIGHSCORES

let fb_pongHS;
let HSList_pong = []


function  writesPONGscoresToDB() {
  firebase.database().ref(USERS_GAME2 + userObject.userID + "/pongScore/").set(score_PONG);
  if (score_PONG > fb_pongHS) {
    firebase.database().ref(USERS_GAME2 + userObject.userID + "/pongScoreHS/").set(score_PONG);
    fb_pongHS = score_PONG;
  }
}


function highScoreReader_PONG() {
  console.log("Reading highscores");
  firebase.database().ref(USERS_GAME2 + userObject.userID + '/pongScoreHS/').once('value', function(snapshot) {
    console.log(snapshot.val());
    fb_pongHS = snapshot.val();
    //snapshot.forEach(savesHighScoreInfo_PONG);
  }, fb_error);
}

function highScoreTable_PONG() {
  console.log("Readig highscores");
  firebase.database().ref(USERS_GAME2).orderByChild('pongScoreHS').limitToLast(3).once('value', function(snapshot) {
    snapshot.forEach(savesHighScoreInfo_PONG);
  }, fb_error);
}

function savesHighScoreInfo_PONG(child) {
  //console.log(child.val());
  fb_data = child.val();
  console.log(fb_data.pongScoreHS);
  console.log(fb_data.username);
  HSList_pong.push(fb_data.pongScoreHS);
  HSList_pong.push(fb_data.username);
  console.log(HSList_pong);
}
