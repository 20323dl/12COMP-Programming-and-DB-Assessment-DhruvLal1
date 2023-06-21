// FIREBASE FUNCTION FOR SHOOTER HIGHSCORES

let score_Shooter= 0;
let fb_ShooterHS;
let userName_ThatWillBeDisplayed;
let userHS_ThatWillBeDisplayed;
let HSList_Shooter = [];

function highScoreReader() {
  console.log("Readig highscores");
  firebase.database().ref(USERS_GAME1 + userObject.userID + '/shooterScoreHS/').once('value', function(snapshot) {
    console.log(snapshot.val());
    fb_ShooterHS = snapshot.val();
    snapshot.forEach(savesHighScoreInfo);
  }, fb_error);
}


function highScoreTable() {
  console.log("Readig highscores");
  firebase.database().ref(USERS_GAME1).orderByChild('shooterScoreHS').limitToLast(3).once('value', function(snapshot) {
    //console.log(snapshot.val());
    // fb_ShooterHS = snapshot.val();
    snapshot.forEach(savesHighScoreInfo);
  }, fb_error);
}

//3:01pm works

// saves firebase highscore items to variable
function savesHighScoreInfo(child) {
  //console.log(child.val());
  fb_data = child.val();
  HSList_Shooter.push(fb_data.shooterScoreHS);
  HSList_Shooter.push(fb_data.username);
  userName_ThatWillBeDisplayed = fb_data.username
  userHS_ThatWillBeDisplayed = fb_data.shooterScoreHS

}

function writesSHOOTERscoresToDB() {
  console.log(score_Shooter > fb_ShooterHS)
  firebase.database().ref(USERS_GAME1 + userObject.userID + "/shooterScore/").set(score_Shooter); //regardless of score_Shooterthis will change, this is not the HS
  if (score_Shooter > fb_ShooterHS) {
    firebase.database().ref(USERS_GAME1 + userObject.userID + "/shooterScoreHS/").set(score_Shooter);
    fb_ShooterHS = score_Shooter;
  }
}