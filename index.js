const cvs = document.getElementById("myCanvas");
const ctx = cvs.getContext("2d");

let frames = 0;
const direction = {
  current: 0,
  idle: 0,
  right: 1,
  left: 2,
  up: 3,
  down: 4,
};

document.addEventListener("keydown", function (evt) {
  switch (evt.keyCode) {
    case 37: //left
      if (direction.current != direction.right)
        direction.current = direction.left;
      break;
    case 38: //up
      if (direction.current != direction.down) direction.current = direction.up;
      break;
    case 39: //right
      if (direction.current != direction.left)
        direction.current = direction.right;
      break;
    case 40: //down
      if (direction.current != direction.up) direction.current = direction.down;
      break;
  }
});

const food = {
  x: cvs.width / 4,
  y: cvs.height / 4,
  radius: 10,

  draw: function () {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  },
};

const snake = {
  radius: 10,
  position: [{ x: cvs.width / 2, y: cvs.height / 2 }],

  velocity: 20,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.arc(p.x, p.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  },

  update: function () {
    if (frames % 6 == 0) {
      for (let i = this.position.length - 1; i > 0; i--) {
        //check collision with itself
        if (
          this.position[0].x == this.position[i].x &&
          this.position[0].y == this.position[i].y &&
          this.position.length > 2
        ) {
          this.position.splice(1);
          break;
        }

        this.position[i].x = this.position[i - 1].x;
        this.position[i].y = this.position[i - 1].y;
      }

      //move snake
      if (direction.current == direction.right)
        this.position[0].x += this.velocity;
      if (direction.current == direction.left)
        this.position[0].x -= this.velocity;
      if (direction.current == direction.up)
        this.position[0].y -= this.velocity;
      if (direction.current == direction.down)
        this.position[0].y += this.velocity;

      // collision
      if (
        getDistance(this.position[0].x, this.position[0].y, food.x, food.y) <
        2 * this.radius
      ) {
        // create new food
        food.x = Math.random() * cvs.width;
        food.y = Math.random() * cvs.height;

        // increase snake length
        this.position.push({
          x: this.position[this.position.length - 1].x,
          y: this.position[this.position.length - 1].y,
        });
      }

      if (this.position[0].x < 0) this.position[0].x = cvs.width - this.radius;
      if (this.position[0].x > cvs.width) this.position[0].x = this.radius;
      if (this.position[0].y < 0) this.position[0].y = cvs.height - this.radius;
      if (this.position[0].y > cvs.height) this.position[0].y = this.radius;
    }
  },
};

function getDistance(snakeX, SnakeY, foodX, foodY) {
  let distanceX = foodX - snakeX;
  let distanceY = foodY - SnakeY;

  return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}

function main() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  snake.update();
  snake.draw();
  food.draw();
  frames++;
  requestAnimationFrame(main);
}

requestAnimationFrame(main);
