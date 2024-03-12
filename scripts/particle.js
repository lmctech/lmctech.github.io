var score = 0;
var wordCounter=0;

function Particle(x, y, length, maxSize, colour) {
  this.velocity = createVector(random(-.1, .1), random(-.1, .1));
  this.acceleration = createVector(random(-.1, .1), random(-.1, .1));
  this.maxSpeed = 4;
  this.history = [];
  this.pos = createVector(x, y);

  this.colours = [color(252, 166, 18), color(255, 190, 11), color(255, 0, 110), color(131, 56, 236), color(58, 134, 255)];
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

  this.word = words[wordCounter % words.length];
  this.textC = 255;
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

    for (var i = 0; i < this.history.length; i++) {

      var pos = this.history[i];
      var r = map(i, 0, this.history.length, 4, this.size);

      this.alpha = map(i, 0, this.history.length, 0, 255);
      fill(this.c);

      stroke(this.c);
      ellipse(pos.x, pos.y, r, r);
      noStroke();
      if (i == this.history.length - 1) {
        fill(this.textC);
        textSize(14);
        textAlign(CENTER, CENTER);
        textWrap(WORD);
        rectMode(CENTER);
        text(this.word, pos.x, pos.y, this.textmaxSize - 10, this.textmaxSize - 10);

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

    if (dn < this.size * 1.5) {
      this.goalX = this.pos.x + random(-150, 150);
      this.goalY = this.pos.y + random(-150, 150);
      nemo.cIndex = this.cIndex;
      nemo.size += 0.6;
      this.reBirth();
      score++;
      if (!trackedWords.includes(this.word)) {
        addToBrain(this.word, this.cIndex);
        trackedWords.push(this.word);
      }
    }
    if (this.pos.x < 0 || this.goalX < 0) {
      this.goalX = random(100);
    }
    if (this.pos.y < 0 || this.goalY < 0) {
      this.goalY = random(100);
    }
    if (this.pos.x > windowWidth || this.goalX > windowWidth) {
      this.goalX = windowWidth - random(100);
    }
    if (this.pos.y > windowHeight || this.goalY > windowHeight) {
      this.goalY = windowHeight - random(100);
    }
    this.grow();
  }

  this.cluster = function () {

    let d = dist(this.pos.x, this.pos.y, mazeX, mazeY);
    this.goalX = lerp(this.goalX, mazeX, 0.02);
    this.goalY = lerp(this.goalY, mazeY, 0.02);

    this.pos.x = lerp(this.pos.x, this.goalX, 0.05);
    this.pos.y = lerp(this.pos.y, this.goalY, 0.05);
    if (d < 150) {
      this.pos.x += sin((t * 0.02) + this.wIndex);
      this.pos.y += sin((-t * 0.02) + this.wIndex);
    }

  }
  this.jiggle = function () {

    let d = dist(this.pos.x, this.pos.y, nemo.pos.x, nemo.pos.y);
    if (d <= this.size * 1.5) {
      this.goalX += random(-20, 20);
      this.goalY += random(-20, 20);
    }
  }

  this.reBirth = function () {
    this.size = 0;
    this.pos.x = random(windowWidth);
    this.pos.y = random(windowHeight);
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
    } else if (this.pos.x + this.radius > windowWidth) {
      this.pos.x = width - this.radius; // Prevent from leaving the canvas from the right side
      this.velocity.x *= -1;
    }

    if (this.pos.y - this.radius < 0) {
      this.pos.y = this.radius; // Prevent from leaving the canvas from the top
      this.velocity.y *= -1;
    } else if (this.pos.y + this.radius > windowHeight) {
      this.pos.y = height - this.radius; // Prevent from leaving the canvas from the bottom
      this.velocity.y *= -1;
    }
  }

  this.checkCollision = function () {
    for (let other of brain_bits) {
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        let minDistance = this.radius + other.radius;


        if (distance <= minDistance) {
          // Calculate collision response
          let normal = p5.Vector.sub(other.pos, this.pos).normalize();
          let relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);
          let impulse = p5.Vector.mult(normal, 2 * p5.Vector.dot(relativeVelocity, normal) / (1 + 1));

          // Apply repulsion force to prevent sticking
          let repulsion = p5.Vector.mult(normal, minDistance - distance);

          // Update velocities
          this.velocity.add(p5.Vector.div(impulse, 2));
          other.velocity.sub(p5.Vector.div(impulse, 2));

          // Apply repulsion force
          this.pos.sub(p5.Vector.div(repulsion, 2));
          other.pos.add(p5.Vector.div(repulsion, 2));

        }
      }
    }
  }
}