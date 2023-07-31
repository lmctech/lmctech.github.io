//trailing followers

var x, y;
var find;

var nemo;

var npcs = [];

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('background');
  
  x = 200;
  y = 200;

  noStroke();
  frameRate(60);
  find = false;

  nemo = new Particle(300, 300,16,18,0)
  for (var i = 0; i < 15; i++) {
    npcs[i] = new Particle(random(windowWidth), random(windowHeight), 16,10, i)
  }
  frameRate(60);
}

function draw() {

  background(255);
 
  nemo.follow();
  nemo.update();
  nemo.show();

  textSize(20);
  for (var i = 0; i < npcs.length; i++) {

    npcs[i].wander();
    npcs[i].update();
    npcs[i].show();
  }
  if(score<5){

    
    fill(0,map(score,1,5,0,100));
    text('Score:'+score,50,windowHeight-50);
  }
  if(score>=5){

    fill(0,100);
    text('Score:'+score,50,windowHeight-50);
  }
  if(score==69){

    fill(0,50);
    text('Score:'+score+' (nice)',50,windowHeight-50);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}