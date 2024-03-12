 
p5.disableFriendlyErrors = true;
var x, y;
var find;

var page;
var bg = 255;
var nemo;
var brain_bits = [];

var npcs = [];
let mazeLine;
let colChange = 0;

var mazeX, mazeY;
 
var words;

function preload() {
  img = loadImage('images/maze.svg');
  words = loadStrings('list.txt');
}

var t;


function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('background');
  placeMaze();
  placeTracker();
  mazeLine = createGraphics(windowWidth, windowHeight, P2D);
  x = 200;
  y = 200;
  var path = window.location.pathname;
  page = path.split("/").pop();

  noStroke();
  frameRate(60);
  find = false;
  let psize = 15;
  if (page == "page_being.html") {
    psize = 40;
  }

  nemo = new Particle(300, 300, 16, 18, 0);
  for (var i = 0; i < 15; i++) {

    npcs[i] = new Particle(random(windowWidth), random(windowHeight), 16, psize, i);
  }
  frameRate(60);
}

function draw() {
  t = frameCount;
  background(bg);


  if (page == "index.html") {
    playMaze();
  }

  if (page == "index.html") {

    imageMode(CORNER);
    image(mazeLine, 0, 0);
  }
  nemo.follow();
  nemo.update();
  nemo.show();
  if (page == "index.html") {

    imageMode(CENTER);
    image(img, mazeX, mazeY);
  }

  textSize(20);
  for (var i = 0; i < npcs.length; i++) {

    npcs[i].wander();
    npcs[i].update();
    //npcs[i].show();
    if (page == "page_being.html") {

      npcs[i].showWords();
    } else {

      npcs[i].show();
    }
  }
  if (page == "page_being.html") {
    showBrain();
    if (t % tSpeed == 0) {
      changeText();
    }
  }

  
  if (score < 5) {


    fill(0, map(score, 1, 5, 0, 100));
    text('Score:' + score, 50, windowHeight - 50);
  }
  if (score >= 5) {

    fill(0, 100);
    text('Score:' + score, 50, windowHeight - 50);
  }
  if (score == 69) {

    fill(0, 50);
    text('Score:' + score + ' (nice)', 50, windowHeight - 50);
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  placeMaze();

}

function placeMaze() {

  mazeX = (windowWidth * 0.6) + (img.width * .4);
  mazeY = windowHeight / 2;

}

function playMaze() {
  let dn = dist(mazeX, mazeY, nemo.pos.x, nemo.pos.y);

  if (dn < img.width / 2) {
    // fill(255,220,220);
    //circle(mazeX ,mazeY, img.width  ); 
    mazeLine.fill(nemo.c);
    mazeLine.noStroke();
    mazeLine.ellipse(nemo.pos.x, nemo.pos.y, 10, 10);
    nemo.control = 2;

    if (mouseIsPressed && millis() - colChange >= 500) {
      nemo.cIndex++;
      colChange = millis();
    }
  } else {
    mazeLine.background(255, 255, 255, 5);
    nemo.control = 1;
  }
}

function placeTracker() {

  trackerX = (windowWidth * 0.6) + (img.width * .4);
  trackerY = windowHeight / 2;

}
var trackedWords = [" "];
var trackedWordsCols = [0];

function showBrain() {

  for (let b of brain_bits) {
    b.update();
    b.checkCollision()
    b.checkEdges();
    b.updateState();
    b.cluster(); 
    b.showWords();
    b.jiggle();
  }
}

var braincounter = 0;

function addToBrain(caughtWord, col) {

    brain_bits[braincounter] = new Particle(random(windowWidth), random(windowHeight), 16, 40, col);
    brain_bits[braincounter].word = caughtWord;
    brain_bits[braincounter].w = textWidth(caughtWord);
    brain_bits[braincounter].goalX = mazeX;
    brain_bits[braincounter].goalY = mazeY;

    brain_bits[braincounter].fixTextSize();
    brain_bits[braincounter].wIndex = braincounter;
  braincounter++;
}

var textInit = "Laura is a Stockholm-based creative technologist.";
var textCurrent = "Laura is a Stockholm-based creative technologist.";
var textTarget = "even more than the sum of these parts.";
let phase = 0;
let tSpeed=2;
let tI=0;

function changeText() {
  var el = select("h1");
  textCurrent = el.elt.textContent;

  if (phase == 0) {
    if (textCurrent != "Laura is") {

      textCurrent = textCurrent.slice(0, textCurrent.length - 1);
      
    }
    else{
      phase=1;
      tSpeed=20;
    }
  }

  if (phase == 1) {
      if (textCurrent != "Laura is...") {
        textCurrent = textCurrent.concat('.');
      }
      else{
        phase=2;
        tSpeed=3;
      }
  }
  if (phase == 2) {
    if(score>4){
      if (textCurrent != "Laura is...even more than the sum of these parts.") {
        textCurrent = textCurrent.concat(textTarget.charAt(tI));
        tI++;
      }
      else{ 
      }
    }
    
}
    el.elt.textContent = textCurrent;

  }