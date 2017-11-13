import { Vector } from './vector.js';
import { Rect } from './rect.js';

export class Block extends Rect {
  constructor() {
    super(75, 10, 'block');
    this.color = '';
    this.isBlock = true;
    this.alive = true;
  }
}
