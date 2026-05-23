import type {Stats, Effect} from '../types/types';
import { Logger } from '../utils/Logger';

export abstract class Hero {
  protected health: number;
  protected strength: number;
  protected name: string;
  protected effects: Effect[] = [];
  protected currentTurn: number = 0;
  protected alive: boolean = true;

  constructor(stats: Stats) {
    this.health = stats.health;
    this.strength = stats.strength;
    this.name = stats.name;
  }

  getHealth(): number { 
    return this.health; 
  }
  
  getStrength(): number { 
    return this.strength; 
  }
  
  getName(): string { 
    return this.name; 
  }
  
  isAlive(): boolean { 
    return this.alive && this.health > 0; 
  }

  takeDamage(damage: number, attacker: Hero): void {
    this.health -= damage;
    Logger.log(`${attacker.getName()} наносит урон ${damage} противнику ${this.getName()}`);
    
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      Logger.log(`${this.getName()} погибает`);
    }
  }

  applyEffects(turn: number): void {
    this.currentTurn = turn;
    let totalDamage = 0;
    
    this.effects = this.effects.filter(effect => {
      if (turn <= effect.startTurn + effect.duration) {
        totalDamage += effect.damage;
        const effectName = effect.type === 'fire' ? 'огненных' : effect.type === 'ice' ? 'ледяных' : 'отравленных';
        Logger.log(`${this.getName()} получает ${effect.damage} урона от ${effectName} стрел`);
        return true;
      }
      return false;
    });

    if (totalDamage > 0) {
      this.health -= totalDamage;
      if (this.health <= 0) {
        this.health = 0;
        this.alive = false;
        Logger.log(`${this.getName()} погибает от эффектов`);
      }
    }
  }

  addEffect(effect: Effect): void {
    this.effects.push(effect);
  }

  abstract attack(target: Hero, turn: number): void;
  abstract getType(): string;
}