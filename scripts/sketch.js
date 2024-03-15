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
 var ww, wh;

 var helpTextFill = 0;

 function preload() {
   img = loadImage('images/maze.svg');
   words = loadStrings('scripts/list.txt');
   textFont('Overpass'); 
 }

 var t;


 function setup() {
   let myCanvas = createCanvas(windowWidth, windowHeight);
   ww = windowWidth;
   wh = windowHeight;
   myCanvas.parent('background_canvas');
   placeMaze();
   placeCluster();
   mazeLine = createGraphics(windowWidth, windowHeight, P2D);
   x = 200;
   y = 200;
   var path = window.location.pathname;
   page = path.split("/").pop();

   noStroke();
   find = false;
   let psize = 15;
   if (page == "page_being.html") {
     psize = 40;
   }
   textFont('Overpass'); 

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

   gameUI();

 }

 function gameUI() {

  textSize(18);
  textAlign(LEFT);
  if (millis() >= 3000 && score < 10) {
    if (helpTextFill <= 100) {
      helpTextFill += 2;
    }

  }
  if (helpTextFill > 0 && score > 10) {
    helpTextFill -= 2;;
  }
  fill(0, helpTextFill);
  text('move cursor to play :)', 50, windowHeight - 30);

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

 function showhitbox(hbx, hby, hbs) {
   noFill();
   stroke(150, 150, 0);
   strokeWeight(2);
   ellipse(hbx, hby, hbs, hbs);
   noStroke();
 }

 function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
   placeMaze();
   ww = windowWidth;
   wh = windowHeight;

 }

 function placeMaze() {

   mazeX = (windowWidth * 0.6) + (img.width * .4);
   mazeY = windowHeight / 2;

 }

 function placeCluster() {

   clusterX = (windowWidth * 0.6) + (img.width * .4);
   clusterY = windowHeight / 2;

 }

 function playMaze() {
   let dn = dist(mazeX, mazeY, nemo.pos.x, nemo.pos.y);

   if (dn < img.width / 2) {
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

 function addToBrain(caughtWord, col, pos) {
   brain_bits[braincounter] = new Particle(pos.x, pos.y, 16, 40, col);
   brain_bits[braincounter].word = caughtWord;
   brain_bits[braincounter].w = textWidth(caughtWord);
   brain_bits[braincounter].goalX = clusterX;
   brain_bits[braincounter].goalY = clusterY;

   brain_bits[braincounter].fixTextSize();
   brain_bits[braincounter].wIndex = braincounter;
   braincounter++;
   //clusterX-=5;
 }

 var textInit = "Laura is a Stockholm-based creative technologist.";
 var textCurrent = "Laura is a Stockholm-based creative technologist.";
 var textTarget = ["an interactive artist", "a HCI researcher", "even more than the sum of these parts."];
 let phase = 0;
 let tSpeed = 2;
 let tI = 0;
 var timer = 0;
 var scoreTracker = 0;

 function changeText() {
   var el = select("h1");
   textCurrent = el.elt.textContent;
   var waitTime = 1000;

   if (phase == 0) {
     textCurrent = eraseText(textCurrent, "Laura is", 1, 20);
   }
   if (phase == 1) {
     textCurrent = addText(textCurrent, "Laura is...", '.', 2)
     scoreTracker = score;
   }
   if (phase == 2) {

     if (score >= scoreTracker + 3) {

       textCurrent = addText(textCurrent, concat("Laura is...", textTarget[0]), textTarget[0].charAt(tI), 3);
       timer = millis();
       tI++;
     }
   }
   if (phase == 3) {
     tI = 0;
     if (millis() - timer >= waitTime) {
       textCurrent = eraseText(textCurrent, "Laura is...", 4, 3);
     }
     scoreTracker = score;
   }
   if (phase == 4) {
     if (score >= scoreTracker + 3) {

       textCurrent = addText(textCurrent, concat("Laura is...", textTarget[1]), textTarget[1].charAt(tI), 5);
       timer = millis();
       tI++;
     }
   }
   if (phase == 5) {
     tI = 0;
     if (millis() - timer >= waitTime) {
       textCurrent = eraseText(textCurrent, "Laura is...", 6, 3);
     }
     scoreTracker = score;
   }
   if (phase == 6) {
     if (score >= scoreTracker + 3) {

       textCurrent = addText(textCurrent, concat("Laura is...", textTarget[2]), textTarget[2].charAt(tI), 7);
       tI++;
     }
   }

   el.elt.textContent = textCurrent;
 }

 function eraseText(textCurrent, toText, toPhase, toSpeed) {

   if (textCurrent != toText) {
     textCurrent = textCurrent.slice(0, textCurrent.length - 1);
   } else {
     phase = toPhase;
     tSpeed = toSpeed;
   }
   return textCurrent;
 }

 function addText(textCurrent, toText, textToAdd, toPhase) {
   if (textCurrent != toText) {
     textCurrent = textCurrent.concat(textToAdd);
   } else {
     phase = toPhase;
     tSpeed = 3;
   }
   return textCurrent;
 }