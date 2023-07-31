var score=0;
function Particle(x, y, length, maxSize, colour) {
  var speed = 1;
  this.history = [];

  let c = [color(252, 166, 18), color(255, 190, 11), color(255, 0, 110), color(131, 56, 236), color(58, 134, 255)];
  this.x = x;
  this.y = y;
  this.length = length;
  this.maxSize=maxSize;
  this.size = maxSize;

  this.goalX = x;
  this.goalY = y;
  this.d = map(dist(this.x, this.y, mouseX, mouseY), 0, 30, 0, 255);
  this.c = c[colour % c.length];

  this.update = function () {

    var v = createVector(this.x, this.y);
    this.history.push(v);
    if (this.history.length > this.length) {
      this.history.splice(0, 1)
    }
  }

  this.show = function () {

    //trail 
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var r = map(i, 0, this.history.length, 4, this.size);
      this.alpha = map(i, 0, this.history.length, 0, 255);
      fill(this.c);
      // fill(252, 166, 18,this.alpha);
      ellipse(pos.x, pos.y, r, r);
    }

    // for (var i = 0; i < 20; i++)
    // { 
    //   var r2= i*this.maxSize;

    //   this.alpha=map(i, 0, 10, 10, 0);
    //   fill(252, 166, 18,this.alpha);
    //   ellipse(this.x, this.y, r2, r2);
    // }


  }

  this.follow = function () {

    //     this.goalX=mouseX;
    //     this.goalY=mouseY;
    //     let d = map(dist(this.x, this.y, this.goalX, this.goalY), 1, 100, 0.02, 0.025);

    //     if(this.fc==null){
    //       this.fc=60;
    //     }
    //     if(this.diffX==null || (frameCount%this.fc<1 && d<20)){
    //       this.diffX=randomGaussian(0,40);
    //       this.diffY=randomGaussian(0,40);
    //       this.fc=random(60,120);
    //     }
    //     this.goalX=this.diffX+mouseX;
    //     this.goalY=this.diffY+mouseY;

    //      d = map(dist(this.x, this.y, this.goalX, this.goalY), 1, 100, 0.02, 0.025);
    let d = map(dist(this.x, this.y, mouseX, mouseY), 1, 100, 0.02, 0.1);

    this.x = lerp(this.x, mouseX, d);
    this.y = lerp(this.y, mouseY, d);
  }



  this.wander = function () {

    let d = dist(this.x, this.y, this.goalX, this.goalY);
    //let dspeed = map(d, 0, width/2, 0.01, .02);

    this.x = lerp(this.x, this.goalX, 0.01);
    this.y = lerp(this.y, this.goalY, 0.01);

    if (d < 20) {
      this.goalX = this.x + (random(-75, 75) * 2);
      this.goalY = this.y + (random(-75, 75) * 2);
    }


    let dn = dist(this.x, this.y, nemo.x, nemo.y);

    if (dn < this.size*1.5) {
      this.goalX = this.x + random(-150, 150);
      this.goalY = this.y + random(-150, 150);
      nemo.c = this.c;
      nemo.size += 0.6;
      this.reBirth();
      score++;
    }
    if(this.x<0 || this.goalX<0){
      this.goalX=random(100);
    }
    if(this.y<0 || this.goalY<0){
      this.goalY=random(100);
    }
    if(this.x>windowWidth || this.goalX>windowWidth){
      this.goalX=windowWidth-random(100);
    }
    if(this.y>windowHeight || this.goalY>windowHeight){
      this.goalY=windowHeight-random(100);
    }
    this.grow();
  }

  this.reBirth = function () {
    this.size = 0;
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.goalX = this.x ;
    this.goalY = this.y ;
    
  }

  this.grow = function () {
    if (this.size < this.maxSize ) {
      this.size +=0.1;
    }
  }
}