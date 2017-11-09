import { Rect } from './rect.js';

export class Player extends Rect {
  constructor() {
    super(150, 20)
    this.score = 0;
  }
}
