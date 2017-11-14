import { Rect } from './rect.js';
import { Block } from './block.js';
import { Ball } from './ball.js';
import { Vector } from './vector.js';
import { Player } from './player.js';

class BlockDestroyer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.lastTime = 0;
    this.accumulator = 0;
    this.step = 1 / 60;

    this.ball = new Ball(10, 10);

    this.player = new Player();
    this.blocks = [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        let block = new Block();
        block.position.x = 60 + (x * block.size.x);
        block.position.y = 80 + (y * block.size.y);
        block.color = `hsl(${Math.floor(((y + 1) / 8) * 350)}, 90%, 55%)`;
        this.blocks.push(block)
      }
    }

    this.ball.position.x = this.canvas.width / 2;
    this.ball.position.y = this.canvas.height / 2;
    this.player.position.x = this.canvas.width / 2;
    this.player.position.y = this.canvas.height - 40;

    const callback = (ms) => {
      if (this.lastTime) {
        this.update((ms - this.lastTime) / 1000);
        this.draw();
      }
      this.lastTime = ms;
      requestAnimationFrame(callback)
    }
    callback();
  }

  update(dt) {
    this.accumulator += dt;
    while (this.accumulator > this.step) {
      this.simulate(this.step);
      this.accumulator -= this.step;
    }
  }

  start() {
    if (this.ball.velocity.x === 0) {
      this.ball.velocity.x = 300 * (Math.random() * 2 - 1);
      this.ball.velocity.y = 600 * (Math.random() > 0.5 ? 1 : -1);
    }
  }

  playerDie() {
    this.ball.velocity = new Vector();
    this.ball.position.x = this.canvas.width / 2;
    this.ball.position.y = this.canvas.height / 2;
    this.player.lives -= 1;
  }

  drawHeader() {
    this.context.fillStyle = 'rgba(255, 255, 255, 1)';
    this.context.fillRect(0, 40, this.canvas.width, 3);

    this.context.font = '32px sans-serif';
    this.context.fillText(`SCORE: ${this.player.score}`, 20, 30);

    this.context.font = '32px sans-serif';
    this.context.fillText(`LIVES: ${this.player.lives}`, this.canvas.width - 150, 30);
  }

  draw() {
    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawHeader();

    this.context.fillStyle = 'rgba(241, 241, 241, 1)';
    this.context.fillRect(this.player.leftEdge, this.player.topEdge, this.player.size.x, this.player.size.y);

    this.context.fillStyle = 'rgba(241, 241, 241, 1)';
    this.context.fillRect(this.ball.leftEdge, this.ball.topEdge, this.ball.size.x, this.ball.size.x);

    this.blocks.map(block => {
      if (block.alive) {
        this.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        this.context.lineWidth = 1;
        this.context.strokeRect(block.leftEdge, block.topEdge, block.size.x, block.size.y);
        this.context.fillStyle = block.color;
        this.context.fillRect(block.leftEdge, block.topEdge, block.size.x, block.size.y);
      }
    })
  }

  simulate(dt) {
    let lastPosition = new Vector(this.ball.position.x, this.ball.position.y);
    this.ball.position.x += this.ball.velocity.x * dt;
    this.ball.position.y += this.ball.velocity.y * dt;

    // ball wall collision
    if (this.ball.rightEdge > this.canvas.width || this.ball.leftEdge < 0) {
      this.ball.velocity.x = -this.ball.velocity.x;
    } else if (this.ball.topEdge < 0) {
      this.ball.velocity.y = -this.ball.velocity.y;
    } else if (this.ball.bottomEdge > this.canvas.height) {
      // colliding with bottom. ded
      this.playerDie();
    }

    // player collide
    this.collide(this.player, this.ball, lastPosition);

    // block collide
    this.blocks.forEach(block => {
      if (block.alive) {
        this.collide(block, this.ball, lastPosition)
      }
    })
  }

  // Checks if line intersects with another line
  // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
  // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Mathematics
  isIntersecting(p1, p2, p3, p4) {
    const CCW = (_p1, _p2, _p3) => {
      return (_p3.y - _p1.y) * (_p2.x - _p1.x) > (_p2.y - _p1.y) * (_p3.x - _p1.x);
    }
    return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
  }

  collide(rect, ball, lastPosition) {
    let collide = false;
    if (this.isIntersecting(
      { x: rect.topLine.position1.x, y: rect.topLine.position1.y }, { x: rect.topLine.position2.x, y: rect.topLine.position2.y },
      { x: lastPosition.x, y: lastPosition.y }, { x: ball.position.x, y: ball.position.y })) {
      // top
      ball.velocity.y = -ball.velocity.y;
      collide = true;
    } else if (this.isIntersecting(
      { x: rect.rightLine.position1.x, y: rect.rightLine.position1.y }, { x: rect.rightLine.position2.x, y: rect.rightLine.position2.y },
      { x: lastPosition.x, y: lastPosition.y }, { x: ball.position.x, y: ball.position.y })) {
      // rigth
      ball.velocity.x = -ball.velocity.x;
      collide = true;
    } else if (this.isIntersecting(
      { x: rect.bottomLine.position1.x, y: rect.bottomLine.position1.y }, { x: rect.bottomLine.position2.x, y: rect.bottomLine.position2.y },
      { x: lastPosition.x, y: lastPosition.y }, { x: ball.position.x, y: ball.position.y })) {
      // bottom
      ball.velocity.y = -ball.velocity.y;
      collide = true;
    } else if (this.isIntersecting(
      { x: rect.leftLine.position1.x, y: rect.leftLine.position1.y }, { x: rect.leftLine.position2.x, y: rect.leftLine.position2.y },
      { x: lastPosition.x, y: lastPosition.y }, { x: ball.position.x, y: ball.position.y })) {
      // left
      ball.velocity.x = -ball.velocity.x;
      collide = true;
    }

    if (collide) {
      ball.position = lastPosition;

      switch (rect.type) {
        case 'player':
          let diff = Math.abs(rect.position.x - ball.position.x) / (rect.size.x / 2);
          if (rect.position.x - ball.position.x > 0) {
            ball.velocity.x += -(200 * diff);
          } else {
            ball.velocity.x += (200 * diff);
          }

          break;
        case 'block':
          rect.alive = false;
          this.player.score += 1;
          break;
      }
    }
  }
}

const canvas = document.getElementById('blockdestroy');
const blockDestroyer = new BlockDestroyer(canvas);

canvas.addEventListener('mousemove', event => {
  const scale = event.offsetX / event.target.getBoundingClientRect().width;
  blockDestroyer.player.position.x = scale * canvas.width;
});

canvas.addEventListener('click', event => {
  blockDestroyer.start();
})
