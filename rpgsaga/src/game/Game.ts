import { Hero } from '../models/Hero';
import { Mage } from '../models/Mage';
import { Logger } from '../utils/Logger';

export class Game {
  private heroes: Hero[];
  private round: number = 0;

  constructor(heroes: Hero[]) {
    this.heroes = heroes.filter(hero => hero !== null && hero !== undefined);
    
    if (this.heroes.length === 0) {
      throw new Error('Нет героев для игры');
    }
    if (this.heroes.length % 2 !== 0) {
      throw new Error('Количество игроков должно быть четным');
    }
    this.logHeroesStats();
  }

  private logHeroesStats(): void {
    Logger.log('=== Начальные характеристики героев ===');
    this.heroes.forEach(hero => {
      if (hero && hero.getType) {
        Logger.log(`${hero.getType()} ${hero.getName()}: Здоровье=${hero.getHealth()}, Сила=${hero.getStrength()}`);
      }
    });
    Logger.log('=====================================\n');
  }

  start(): Hero {
    let turn = 0;
    
    while (this.heroes.length > 1) {
      this.round++;
      Logger.log(`\nКон ${this.round}.`);
      
      const winners = this.fightRound(turn);
      this.heroes = winners.filter(winner => winner && winner.isAlive && winner.isAlive());
      
      if (this.heroes.length === 0) {
        throw new Error('Все герои погибли');
      }
      
      turn++;
    }
    
    const winner = this.heroes[0];
    console.log(`\nПОБЕДИТЕЛЬ ТУРНИРА: ${winner.getType()} ${winner.getName()}`);
    return winner;
  }

  private fightRound(startTurn: number): Hero[] {
    const fights = this.createFights();
    const winners: Hero[] = [];
    
    for (const fight of fights) {
      if (fight && fight.hero1 && fight.hero2) {
        Logger.log(`\n${fight.hero1.getType()} ${fight.hero1.getName()} vs ${fight.hero2.getType()} ${fight.hero2.getName()}`);
        const winner = this.fight(fight.hero1, fight.hero2, startTurn);
        if (winner) {
          winners.push(winner);
        }
      }
    }
    
    return winners;
  }

  private createFights(): Array<{hero1: Hero, hero2: Hero}> {
    const shuffled = [...this.heroes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const fights = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      if (shuffled[i] && shuffled[i + 1]) {
        fights.push({ hero1: shuffled[i], hero2: shuffled[i + 1] });
      }
    }
    return fights;
  }

  private fight(hero1: Hero, hero2: Hero, startTurn: number): Hero {
    let turn = startTurn;
    let turnCount = 0;
    
    while (hero1.isAlive() && hero2.isAlive() && turnCount < 100) {
      turn++;
      turnCount++;
      
      hero1.applyEffects(turn);
      hero2.applyEffects(turn);
      
      if (!hero1.isAlive() || !hero2.isAlive()) break;
      
      if (!Mage.shouldSkipTurn(hero1)) {
        hero1.attack(hero2, turn);
      }
      
      if (!hero2.isAlive()) break;
      
      if (!Mage.shouldSkipTurn(hero2)) {
        hero2.attack(hero1, turn);
      }
    }
    
    const winner = hero1.isAlive() ? hero1 : hero2;
    if (this.heroes.length > 3) {
      Logger.log(`\nПобедитель боя: ${winner.getType()} ${winner.getName()}`);
    }
    return winner;
  }
}