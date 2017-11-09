import { Vector } from './vector.js';
import { Rect } from './rect.js';

export class Ball extends Rect {
  constructor(width = 0, height = 0) {
    super(width, height);
    this.velocity = new Vector;
  }
}
