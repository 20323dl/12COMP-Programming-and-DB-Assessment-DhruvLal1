//basic
let score = 0;
let game;
let fb_pongHS;
let HSList_pong = []
let button_PONG;
function setup() {
  console.log("setup: bob");

  console.log("yes")

  highScoreTable_PONG();


  cnv = new Canvas(windowWidth, windowHeight);
  //ball
  ball = new Sprite(windowWidth / 4, random(50, windowHeight - 50), 30, 'd');
  ball.shapeColor = color('white');
  ball.vel.x = 5;
  ball.vel.y = 2.5;
  ball.bounciness = 1.2;

  //paddle
  paddle = new Sprite(windowWidth - 100, windowHeight / 2, 20, 120, 'k');
  paddle.shapeColor = color('white');

  ball.friction = 0;
  wallGroup = new Group();
  walls();
  movement();
  //reset game button_PONG
  button_PONG = createButton('reset');
  button_PONG.position(0, 0);
  button_PONG.mousePressed(resetGame_PONG);
  //reset game button_PONG
}

function draw() {
  ball.collides(paddle, scoreFunction);
  ball.collides(wallRH, dead)
  background('black');
  wallGroup.stroke = color("white");
  fill(255);
  textSize(20);
  text(score, 100, 100);
  HS_TABLE_DISPLAY_PONG();
}

function scoreFunction() {
  score++;
}
function dead() {
  console.log(score > fb_pongHS)
  ball.vel.y = 0;
  ball.vel.x = 0;
  text("game over", 310, 310);

  firebase.database().ref(USERS_GAME2 + userObject.userID + "/pongScore/").set(score);
  if (score > fb_pongHS) {
    firebase.database().ref(USERS_GAME2 + userObject.userID + "/pongScoreHS/").set(score);
    fb_pongHS = score;
  }

  noLoop();
  button_PONG.mousePressed(resetGame);
}

function movement() {
  let speed = 20;
  let slow = 0;
  document.addEventListener("keydown", function(event) {
    if (event.code === "KeyW") {
      paddle.vel.y = -speed;
    } else if (event.code === "KeyS") {
      paddle.vel.y = speed;
    }
  });
  document.addEventListener("keyup", function(event) {
    if (event.code === "KeyW") {
      paddle.vel.y = slow;
    } else if (event.code === "KeyS") {
      paddle.vel.y = slow;
    }
  });
}

function walls() {
  let w = 30
  wallLH = new Sprite(0, height / 2, w, height, 'k');
  wallLH.shapeColor = color("white");
  wallTop = new Sprite(0, 0, width * 2, w, 'k');
  wallTop.shapeColor = color("white");
  wallBot = new Sprite(width, height, width * 2, w, 'k');
  wallBot.shapeColor = color("white");
  wallRH = new Sprite(width, (height / 2) - 15, w, height, 'k');
  wallRH.shapeColor = color("black");
  wallRH.stroke = color("black")
  wallGroup.add(wallLH);
  wallGroup.add(wallTop);
  wallGroup.add(wallBot);
}

//HS STUFF **************************************************************************
function HS_TABLE_DISPLAY_PONG() {
  textSize(30);
  //first
  text(HSList_pong[4], 17, 200);
  text(HSList_pong[5], 67, 200);
  //second
  text(HSList_pong[2], 17, 235);
  text(HSList_pong[3], 67, 235);
  //third
  text(HSList_pong[0], 17, 270);
  text(HSList_pong[1], 67, 270);
}

function resetGame_PONG() {
  console.log("restart")
  score = 0;
  ball.pos.x = windowWidth / 4
  ball.pos.y = random(50, windowHeight - 50)
  HSList_pong = []
  ball.vel.x = 5;
  ball.vel.y = 2.5;
  highScoreTable_PONG();
  HS_TABLE_DISPLAY_PONG();
  loop();
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
