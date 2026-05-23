import { Hero } from '../models/Hero';
import type { Stats } from '../types/types';
import { Knight } from '../models/Knight';
import { Mage } from '../models/Mage';
import { Archer } from '../models/Archer';

export class HeroFactory {
  private static readonly NAMES: string[] = [
    'Артур', 'Эльдар', 'Гэндальф', 'Вильямс', 
    'Леголас', 'Арагорн', 'Мерлин', 'Робин',
    'Ланселот', 'Гимли', 'Саруман', 'Трандуил'
  ];

  static createHero(type: string, stats: Stats): Hero {
    switch(type) {
      case 'Рыцарь': 
        return new Knight(stats);
      case 'Маг': 
        return new Mage(stats);
      case 'Лучник': 
        return new Archer(stats);
      default: 
        throw new Error(`Unknown hero type: ${type}`);
    }
  }

  static createRandomHeroes(count: number): Hero[] {
    const heroes: Hero[] = [];
    const types = ['Рыцарь', 'Маг', 'Лучник'];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const stats: Stats = {
        health: Math.floor(Math.random() * 100) + 50,
        strength: Math.floor(Math.random() * 30) + 10,
        name: this.NAMES[Math.floor(Math.random() * this.NAMES.length)]
      };
      heroes.push(this.createHero(type, stats));
    }
    return heroes;
  }

  static createSpecificHero(type: string, name: string, health: number, strength: number): Hero {
    const stats: Stats = { health, strength, name };
    return this.createHero(type, stats);
  }
}