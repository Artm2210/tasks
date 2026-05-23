import { Hero } from './Hero';
import { Logger } from '../utils/Logger';

export class Archer extends Hero {
  private fireArrowsUsed: boolean = false;
  private iceArrowsCount: number = 0;

  attack(target: Hero, turn: number): void {
    const random = Math.random();
    
    if (!this.fireArrowsUsed && random < 0.33) {
      this.useFireArrows(target, turn);
    } else if (this.iceArrowsCount < 2 && random < 0.66) {
      this.useIceArrows(target, turn);
    } else {
      this.normalAttack(target);
    }
  }

  private useFireArrows(target: Hero, turn: number): void {
    this.fireArrowsUsed = true;
    Logger.log(`${this.getName()} (Лучник) использует (Огненные стрелы) - ${target.getName()} загорается`);
    target.addEffect({
      type: 'fire',
      damage: 2,
      duration: Infinity,
      startTurn: turn
    });
  }

  private useIceArrows(target: Hero, turn: number): void {
    this.iceArrowsCount++;
    Logger.log(`${this.getName()} (Лучник) использует (Ледяные стрелы) - ${target.getName()} заморожен`);
    target.addEffect({
      type: 'ice',
      damage: 3,
      duration: 3,
      startTurn: turn
    });
  }

  private normalAttack(target: Hero): void {
    const damage = this.strength;
    Logger.log(`${this.getName()} (Лучник) наносит урон ${damage} противнику ${target.getName()}`);
    target.takeDamage(damage, this);
  }

  getType(): string { 
    return 'Лучник'; 
  }
}