//*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
// Written by dHRUV
//3:01pm wed 7 june works
//7:50pm thrus 8 june works
//8.29pm thrus 8 june works
//12:30pm fri 9 june works
//11:54pm fri 9 june works
//*******************************************************/
const TASKNAME = "t01_create_sprite";

//*******************************************************/
//****************************IMG***************************/
function preload() {
  img = loadImage('/images/freezePU.png');
  img1 = loadImage('/images/healthPU.png');
}
//****************************IMG***************************/

//****************************setup()***************************/
let score = 0;
let alienSpeed = 4;
const DISTANCE_THRESHOLD = 200; //radius of cir to not spawn kill
let secLeft = 6;
let health = 5;
let button;
// let freeze;
let alienAmmount = 5;
let fb_shooterHS;
let userName_ThatWillBeDisplayed;
let userHS_ThatWillBeDisplayed;
let HSList_struggle = [];
var coolNumber = 0

function setup() {
  
  highScoreReader();
  highScoreTable();
  
  console.log("setup: bob");
  cnv = new Canvas(windowWidth, windowHeight);
  //player
  cir = new Sprite(windowWidth / 2, windowHeight / 2, 75, 'd');
  cir.rotationSpeed = 0;
  cir.color = color("red");
  cir.stroke = color("red");
  //player

  //** IMG **/
  //cir.addImage(img);
  //img.resize(150, 150)
  //** IMG **/

  //functions
  movement();
  wallGroup = new Group();
  walls();
  alienGroup = new Group();
  setInterval(alien, 5000);
  bullet = new Sprite(cir.x, cir.y, 10, 'd');
  bullet.remove();
  timer();
  slowGroup = new Group();
  setInterval(slow, random(30000, 60000));
  healthGroup = new Group();
  setInterval(healthBoost, random(30000, 60000));
  bulletGroup = new Group();
  //slow();
  //functions

  //reset game button
  button = createButton('reset');
  button.position(0, 0);
  button.mousePressed(resetGame);
  //reset game button
  


}
// ***********************************************************************************************************************HS STUFF
function highScoreReader() {
  console.log("Readig highscores");
  firebase.database().ref(USERS_GAME1 + userObject.userID + '/shooterScoreHS/').once('value', function(snapshot) {
    console.log(snapshot.val());
    fb_shooterHS = snapshot.val();
    snapshot.forEach(savesHighScoreInfo);
  }, fb_error);
}


function highScoreTable() {
  console.log("Readig highscores");
  firebase.database().ref(USERS_GAME1).orderByChild('shooterScoreHS').limitToLast(3).once('value', function(snapshot) {
    //console.log(snapshot.val());
    // fb_shooterHS = snapshot.val();
    snapshot.forEach(savesHighScoreInfo);
  }, fb_error);
}

//3:01pm works

// saves firebase highscore items to variable
function savesHighScoreInfo(child) {
  //console.log(child.val());
  fb_data = child.val();
  HSList_struggle.push(fb_data.shooterScoreHS);
  HSList_struggle.push(fb_data.username);
  userName_ThatWillBeDisplayed = fb_data.username
  userHS_ThatWillBeDisplayed = fb_data.shooterScoreHS

}
// ***********************************************************************************************************************HS STUFF






//****************************setup()***************************/
// ***********************************************************************************************************************HS STUFF
function HS_TABLE_DISPLAY() {
  textSize(30);
  text(HSList_struggle[4], 17, 200);
  text(HSList_struggle[5], 67, 200);
  text(HSList_struggle[2], 17, 235);
  text(HSList_struggle[3], 67, 235);
  text(HSList_struggle[0], 17, 270);
  text(HSList_struggle[1], 67, 270);
}

function resetGame() {
  console.log("restart")
  //coolNumber = 6;
  //
  
  score = 0;
  health = 5;
  alienSpeed = 4;
  alienAmmount = 5;
  secLeft = 6;
  alienGroup.remove();
  slowGroup.remove();
  healthGroup.remove();
  bulletGroup.remove();
  HSList_struggle = []
  highScoreTable();
  HS_TABLE_DISPLAY();
  loop();
  
}
//****************************draw()***************************/
function draw() {
  //setHighScoreToZERO();
  background('#ceddf5');
  cir.collides(wallGroup, bounceWall);
  cir.collides(slowGroup, freezer); //when cir collides with freeze
  cir.collides(healthGroup, healthBooster); //when cir collides with healthPU
  cir.collides(alienGroup, healthy);
  cir.rotateTo(mouse, 50);
  bullet.collides(wallGroup, delBullet)
  bullet.collides(alienGroup, delAlien)

  for (const alien of alienGroup) {
    alien.moveTo(cir.x, cir.y);
    alien.speed = alienSpeed;
  }
  noFill();
  circle(mouseX, mouseY, 25);
  line(mouseX, mouseY, cir.x, cir.y);
  fill('black');
  textSize(30);
  text("Score: " + score, 17, 40);

  
  if (fb_shooterHS > 0) {
    //fb_shooterHS = readScoresInDB
    text("Highscore: " + fb_shooterHS, 17, 110);
  }
  if (score > 20) {
    alienAmmount = 12;
  }
  if (secLeft === 0) {
    endGame();
    text("lost becasue you camped", windowWidth / 4, windowHeight / 2 - 100);
  }
  //display timer
  text("campTimer: " + secLeft, width - 205, 60)
  if (health === 0) {
    endGame();
  }

  //players health
  textSize(30);
  text("Health: " + health, 17, 75);
  HS_TABLE_DISPLAY();


}
//****************************draw()***************************/

//timer
function timer() {
  window.setInterval(runTimer, 1000);
}
function runTimer() {
  secLeft = secLeft - 1;
  if (secLeft === 0) {
    endGame();
  }
}


//****************************colliding functions***************************/
function bounceWall(cir, wall) {
  cir.vel.x = 0;
  cir.vel.y = 0;
}
function healthy(cir, alienGroup) {
  cir.color = color("white");
  cir.stroke = color("white");
  const hit = () => cir.color = color("red");
  const hitOutline = () => cir.stroke = color("red");
  health--;
  alienGroup.remove();
  setTimeout(hit, 100);
  setTimeout(hitOutline, 100)

}
// **************************************************************************************************** endgame
function endGame(cir, alienGroup) {
  //cir.remove();

  textSize(80);
  text("YOU LOSE: " + score, windowWidth / 4, windowHeight / 2);
  // ***********************************************************************************************************************HS STUFF
  console.log(score > fb_shooterHS)
  firebase.database().ref(USERS_GAME1 + userObject.userID + "/shooterScore/").set(score);
  if (score > fb_shooterHS) {
    firebase.database().ref(USERS_GAME1 + userObject.userID + "/shooterScoreHS/").set(score);
    
    fb_shooterHS = score;
  }
  // ***********************************************************************************************************************HS STUFF
  
  noLoop();
  button.mousePressed(resetGame);
}
function delBullet(wallGroup, bullet) {
  wallGroup.remove();
}
function delAlien(alienGroup, bullet) {
  bullet.remove();
  alienGroup.remove();
  score++
}

//calls this when cir hits freeze(the powerup)
function freezer(cir, freeze) {
  alienSpeed = 0.5;
  const normalSpeed = () => alienSpeed = 4;
  setTimeout(normalSpeed, 7000);
  freeze.remove();
}
//calls this when cir hits healthPU
function healthBooster(cir, healthPU) {
  health = 5;
  healthPU.remove();
}
//****************************colliding functions***************************


//****************************FUNDEMENTALS***************************/
//player move
function movement() {
  let speed = 20;
  let slow = 0;
  document.addEventListener("keydown", function(event) {
    secLeft = 6;
    if (event.code === "KeyA") {
      cir.vel.x = -speed;
    } else if (event.code === "KeyD") {
      cir.vel.x = speed;
    } else if (event.code === "KeyW") {
      cir.vel.y = -speed;
    } else if (event.code === "KeyS") {
      cir.vel.y = speed;
    }
  });
  document.addEventListener("keyup", function(event) {
    if (event.code === "KeyA") {
      cir.vel.x = slow;
    } else if (event.code === "KeyD") {
      cir.vel.x = slow;
    } else if (event.code === "KeyW") {
      cir.vel.y = slow;
    } else if (event.code === "KeyS") {
      cir.vel.y = slow;
    }
  });
}
//player move

//aliens
function alien() {
  for (i = 0; i < alienAmmount; i++) {

    //cir to not spawn kill
    let xPosition = random(1, windowWidth);
    let yPosition = random(1, windowHeight);

    while (dist(cir.x, cir.y, xPosition, yPosition) < DISTANCE_THRESHOLD) {
      xPosition = random(1, windowWidth);
      yPosition = random(1, windowHeight);
    }
    //cir to not spawn kill  

    alien = new Sprite(xPosition, yPosition, 50, 50, 'd');
    alien.color = color("black");
    //alien.vel.x = random(1, 10);
    //alien.vel.y = random(1, 10);
    alien.bounciness = 0;

    alienGroup.add(alien);
  }
}
//aliens

//walls
function walls() {
  let w = 30
  wallLH = new Sprite(0, height / 2, w, height, 'k');
  wallLH.color = color("black");
  wallRH = new Sprite(width, height / 2, w, height, 'k');
  wallRH.color = color("black");
  wallTop = new Sprite(0, 0, width * 2, w, 'k');
  wallTop.color = color("black");
  wallBot = new Sprite(width, height, width * 2, w, 'k');
  wallBot.color = color("black");
  wallGroup.add(wallLH);
  wallGroup.add(wallRH);
  wallGroup.add(wallTop);
  wallGroup.add(wallBot);
}
//walls

//shooting mech
function mouseClicked() {
  // Create the bullet sprite
  bullet = new Sprite(cir.x, cir.y, 10, 'd');
  bullet.color = color("red");
  // Move the bullet to the edge of the gun and set it's rotation
  setBulletPosition(cir, bullet)
  // Fire the bullet!
  bullet.speed = 20;
  //debug(bullet.direction);
  bullet.moveTowards(mouseX, mouseY, 500 * (0.1 / dist(cir.x, cir.y, mouse.x, mouse.y)));
  bulletGroup.add(bullet);
}
function setBulletPosition(_gun, _round) {
  // Set the rotation of the _round to the same as the _gun
  _round.rotation = _gun.rotation
  _round.direction = _gun.direction

  // Calculate the offset to the edge of the gun (plus the width of the bullet)
  deg = _gun.rotation;
  rads = deg * Math.PI / 180;  // Convert degrees to radians

  h = _gun.w / 2 + _round.w / 2 + 10; // h is the distance from the center of the _gun to the center of the _round
  offsetX = h * Math.cos(rads);
  offsetY = h * Math.sin(rads);

  // Move the _round to the edge of the gun
  _round.x = _gun.x + offsetX;
  _round.y = _gun.y + offsetY;
}
//shooting mech
//****************************FUNDEMENTALS***************************/


//** *************************POWER UPS ************************* **/
//powerup slows down the aliens\
//function only for looks
function slow() {
  freeze = new Sprite(random(1, windowWidth), random(1, windowHeight), 75, 'k');
  freeze.color = color("blue");
  freeze.stroke = color("blue")
  slowGroup.add(freeze);
  freeze.addImage(img);
  img.resize(75, 75);
  freeze.addImage(img);
  img.resize(75, 75);
}
function healthBoost() {
  healthPU = new Sprite(random(1, windowWidth), random(1, windowHeight), 75, 'k');
  healthPU.color = color("blue");
  healthPU.stroke = color("blue")
  healthGroup.add(healthPU);
  healthPU.addImage(img);
  img.resize(75, 75);
  healthPU.addImage(img1);
  img1.resize(75, 75);
}


//** *************************POWER UPS ************************* **/




//** *************************FIREBASE ************************* **/



//*******************************************************/
//  END OF APP
//*******************************************************/