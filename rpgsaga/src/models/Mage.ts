import { Hero } from './Hero';
import { Logger } from '../utils/Logger';

export class Mage extends Hero {
  private static charmedTargets: Set<Hero> = new Set();

  attack(target: Hero, turn: number): void {
    const useAbility = Math.random() < 0.5;
    
    if (useAbility) {
      if (target instanceof Mage) {
        Logger.log(`${this.getName()} (Маг) пытается заворожить ${target.getName()}, но маг невосприимчив к заворожению`);
        const damage = this.strength;
        target.takeDamage(damage, this);
      } else {
        Logger.log(`${this.getName()} (Маг) использует (Заворожение) - ${target.getName()} пропускает ход`);
        Mage.charmedTargets.add(target);
      }
    } else {
      const damage = this.strength;
      Logger.log(`${this.getName()} (Маг) наносит урон ${damage} противнику ${target.getName()}`);
      target.takeDamage(damage, this);
    }
  }

  static shouldSkipTurn(hero: Hero): boolean {
    if (Mage.charmedTargets.has(hero)) {
      Logger.log(`${hero.getName()} пропускает ход из-за заворожения`);
      Mage.charmedTargets.delete(hero);
      return true;
    }
    return false;
  }

  getType(): string { 
    return 'Маг'; 
  }
}