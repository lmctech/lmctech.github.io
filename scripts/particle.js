var score = 0;
var wordCounter=0;

function Particle(x, y, length, maxSize, colour) {
  this.velocity = createVector(random(-.1, .1), random(-.1, .1));
  this.acceleration = createVector(random(-.1, .1), random(-.1, .1));
  this.maxSpeed = 1;
  this.history = [];
  this.pos = createVector(x, y);

  this.colours = [color(252, 166, 18), color(255, 190, 11), color(255, 0, 110), color(131, 56, 236), color(58, 134, 255)]; 
  this.wcolours = [ color(170,75, 0), color(199, 0, 0), color(255, 168, 206), color(226, 208, 251),color(189,214, 255)];
  this.pos.x = x;
  this.pos.y = y;
  this.length = length;
  this.maxSize = maxSize;
  this.size = maxSize;

  this.textmaxSize = 80;
  this.goalX = x;
  this.goalY = y;
  this.d = map(dist(this.pos.x, this.pos.y, mouseX, mouseY), 0, 30, 0, 255);
  this.cIndex = colour;
  this.wIndex = 0;
  this.c = this.colours[this.cIndex % this.colours.length];
  this.control = 1;
  this.fontSize=14;

  this.word = words[wordCounter % words.length];
  this.textC = this.wcolours[this.cIndex % this.wcolours.length];
  this.w = 0;
  
  if (page == "page_being.html") {
    wordCounter++;
  }


  this.radius = this.size / 2;
  this.update = function () {
    this.c = this.colours[this.cIndex % this.colours.length];
    var v = createVector(this.pos.x, this.pos.y);
    this.history.push(v);
    if (this.history.length > this.length) {
      this.history.splice(0, 1)
    }
  }

  this.fixTextSize = function () {

    if (page == "page_being.html") {

      this.w = textWidth(this.word);

      if (this.w > this.size) {

        if (this.w < this.textmaxSize) {
          this.size = this.w + 4;
        } else {
     this.fontSize=10;
    this.size = this.textmaxSize;
        }
      }

    }
  }
  this.show = function () {

    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var r = map(i, 0, this.history.length, 4, this.size);
      this.alpha = map(i, 0, this.history.length, 0, 255);
      fill(this.c);
      ellipse(pos.x, pos.y, r, r);

    }

  }
  this.showWords = function () {
    
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    noStroke();
    for (var i = 0; i < this.history.length; i++) {

      var pos = this.history[i];
      var r = map(i, 0, this.history.length, 4, this.size);
      this.alpha = map(i, 0, this.history.length, 0, 255);
      fill(this.c);
      ellipse(pos.x, pos.y, r, r);
      if (i == this.history.length - 1) {
        //textWrap(WORD);
        textSize(this.fontSize);
        fill(this.textC);
        text(this.word, pos.x, pos.y);
      }
    }
  }

  this.follow = function () {

    let d = map(dist(this.pos.x, this.pos.y, mouseX, mouseY), 1, 100, 0.02, 0.1);
    d *= this.control;

    this.pos.x = lerp(this.pos.x, mouseX, d);
    this.pos.y = lerp(this.pos.y, mouseY, d);
  }
 



  this.wander = function () {

    let d = dist(this.pos.x, this.pos.y, this.goalX, this.goalY);

    this.pos.x = lerp(this.pos.x, this.goalX, 0.01);
    this.pos.y = lerp(this.pos.y, this.goalY, 0.01);

    if (d < 20) {
      this.goalX = this.pos.x + (random(-75, 75) * 2);
      this.goalY = this.pos.y + (random(-75, 75) * 2);
    }


    let dn = dist(this.pos.x, this.pos.y, nemo.pos.x, nemo.pos.y);

    if (dn < ((nemo.size*0.5) + (this.size*0.5))) 
    {if (!trackedWords.includes(this.word)) {
      addToBrain(this.word, this.cIndex, this.pos);
      trackedWords.push(this.word);
    }
      this.goalX = this.pos.x + random(-150, 150);
      this.goalY = this.pos.y + random(-150, 150);
      nemo.cIndex = this.cIndex;
      nemo.size += 0.6;
      
      this.reBirth();
      score++;
    }
    if (this.pos.x < 0 || this.goalX < 0) {
      this.goalX = random(100);
    }
    if (this.pos.y < 0 || this.goalY < 0) {
      this.goalY = random(100);
    }
    if (this.pos.x > ww || this.goalX > ww) {
      this.goalX = ww - random(100);
    }
    if (this.pos.y > wh || this.goalY > wh) {
      this.goalY = wh - random(100);
    }
    this.grow();
  }

  this.cluster = function () {

    //let d = dist(this.pos.x, this.pos.y, clusterX, clusterY);
    this.goalX = lerp(this.goalX, clusterX, 0.02);
    this.goalY = lerp(this.goalY, clusterY, 0.02);

    this.pos.x = lerp(this.pos.x, this.goalX, 0.05);
    this.pos.y = lerp(this.pos.y, this.goalY, 0.05);
    // if (d < 150 && t % this.wIndex ==0) {
    //   this.pos.x -= 1;
    //   this.pos.y -= 1;
    // }

  }
  this.jiggle = function () {

    let d = dist(this.pos.x, this.pos.y, nemo.pos.x, nemo.pos.y);
    if (d <=  ((nemo.size*0.5) + (this.size*0.5))) {
      this.goalX += random(-20, 20);
      this.goalY += random(-20, 20);
    }
  }

  this.reBirth = function () {
    this.size = 0;
    this.pos.x = random(ww);
    this.pos.y = random(wh);
    this.goalX = this.pos.x;
    this.goalY = this.pos.y;
    if (page == "page_being.html") {
      this.word = words[wordCounter % words.length];
      wordCounter++;
      this.fixTextSize();
    }

  }

  this.grow = function () {
    if (this.size < this.maxSize) {
      this.size += 0.1;
    }
  }


  // collision code adapted from https://www.gorillasun.de/blog/an-algorithm-for-particle-systems-with-collisions/

  this.updateState = function (newPos) {


    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed); // Limit the particle's speed
    this.pos.add(this.velocity);
  }

  this.checkEdges = function () {


    this.radius = this.size / 2;

    if (this.pos.x - this.radius < 0) {
      this.pos.x = this.radius; // Prevent from leaving the canvas from the left side
      this.velocity.x *= -1;
    } else if (this.pos.x + this.radius > ww) {
      this.pos.x = width - this.radius; // Prevent from leaving the canvas from the right side
      this.velocity.x *= -1;
    }

    if (this.pos.y - this.radius < 0) {
      this.pos.y = this.radius; // Prevent from leaving the canvas from the top
      this.velocity.y *= -1;
    } else if (this.pos.y + this.radius > wh) {
      this.pos.y = height - this.radius; // Prevent from leaving the canvas from the bottom
      this.velocity.y *= -1;
    }
  }

  this.checkCollision = function () {

    var thisindex=brain_bits.indexOf(this);
      // for(var j=0;j<brain_bits.length;j++){
      //   var pB=brain_bits[j];
        
      //   let distance = this.pos.dist(other.pos);
      //   let minDistance = this.radius + other.radius;
      // }
    
    for (let other of brain_bits.slice(thisindex,brain_bits.length)) {
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        let minDistance =  ((other.size*0.5) + (this.size*0.5));
 
        if (distance <= minDistance) {
          // Calculate collision response
          let normal = p5.Vector.sub(other.pos, this.pos).normalize();
          let relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);
          let impulse = p5.Vector.mult(normal, 2 * p5.Vector.dot(relativeVelocity, normal) / (2 + 1));

          // Apply repulsion force to prevent sticking
          let repulsion = p5.Vector.mult(normal, minDistance - distance);

          // Update velocities
          this.velocity.add(p5.Vector.div(impulse,3));
          other.velocity.sub(p5.Vector.div(impulse,3));

          // Apply repulsion force
          this.pos.sub(p5.Vector.div(repulsion, 2));
          other.pos.add(p5.Vector.div(repulsion,2));

        }
      }
    }
  }
}