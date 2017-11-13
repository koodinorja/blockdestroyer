import { Vector } from './vector.js';

export class Rect {
  constructor(width = 0, height = 0, type = 'block') {
    this.position = new Vector();
    this.size = new Vector(width, height);
    this.type = type;
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

  get leftLine() {
    return {position1: new Vector(this.leftEdge, this.topEdge), position2: new Vector(this.leftEdge, this.bottomEdge)}
  }

  get topLine() {
    return {position1: new Vector(this.leftEdge, this.topEdge), position2: new Vector(this.rightEdge, this.topEdge)}
  }

  get rightLine() {
    return {position1: new Vector(this.rightEdge, this.topEdge), position2: new Vector(this.rightEdge, this.bottomEdge)}
  }

  get bottomLine() {
    return {position1: new Vector(this.rightEdge, this.bottomEdge), position2: new Vector(this.leftEdge, this.bottomEdge)}
  }
}
