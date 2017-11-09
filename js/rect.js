import { Vector } from './vector.js';

export class Rect {
  constructor(width = 0, height = 0) {
    this.position = new Vector();
    this.size = new Vector(width, height);
  }

  get leftEdge() {
    return this.position.x - this.size.x / 2;
  }
  get rightEdge() {
    return this.position.x + this.size.x / 2;
  }
  get topEdge() {
    return this.position.y - this.size.y / 2;
  }
  get bottomEdge() {
    return this.position.y + this.size.y / 2;
  }
}
