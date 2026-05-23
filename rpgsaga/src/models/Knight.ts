import { Hero } from "./Hero";
import { Logger } from '../utils/Logger';

export class Knight extends Hero {
  private readonly VENGEANCE_BONUS = 0.3;

  attack(target: Hero, turn: number): void {
    const useAbility = Math.random() < 0.5;
    
    if (useAbility) {
      const damage = Math.floor(this.strength * (1 + this.VENGEANCE_BONUS));
      Logger.log(`${this.getName()} (Рыцарь) использует (Удар возмездия) и наносит урон ${damage} противнику ${target.getName()}`);
      target.takeDamage(damage, this);
    } else {
      const damage = this.strength;
      Logger.log(`${this.getName()} (Рыцарь) наносит урон ${damage} противнику ${target.getName()}`);
      target.takeDamage(damage, this);
    }
  }

  getType(): string { 
    return 'Рыцарь'; 
  }
}