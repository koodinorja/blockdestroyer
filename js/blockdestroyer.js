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
    this.step = 1 / 120;

    this.ball = new Ball(10, 10);
    this.ball.velocity.x = 300 * (Math.random() * 2 - 1);
    this.ball.velocity.y = 600 * (Math.random() > 0.5 ? 1 : -1);

    this.player = new Player();
    this.blocks = [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        let block = new Block();
        block.position.x = 60 + (x * block.size.x);
        block.position.y = 20 + (y * block.size.y);
        block.color = `hsl(${Math.floor(((y+1) / 8) * 350)}, 90%, 55%)`;
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

  draw() {
    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = 'rgba(241, 241, 241, 1)';
    this.context.fillRect(this.player.leftEdge, this.player.topEdge, this.player.size.x, this.player.size.y);

    this.context.fillStyle = 'rgba(241, 241, 241, 1)';
    this.context.fillRect(this.ball.leftEdge, this.ball.topEdge, this.ball.size.x, this.ball.size.y);

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
    } else if (this.ball.bottomEdge > this.canvas.height || this.ball.topEdge < 0) {
      this.ball.velocity.y = -this.ball.velocity.y;
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

  collide(rect, ball, lastPosition) {
    if (rect.leftEdge < ball.rightEdge && rect.rightEdge > ball.leftEdge &&
      rect.topEdge < ball.bottomEdge && rect.bottomEdge > ball.topEdge) {

      ball.velocity.y = -ball.velocity.y;
      ball.position = lastPosition;
      if (rect.isBlock) {
        rect.alive = false;
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
