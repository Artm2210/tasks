import { describe, test, expect, beforeEach } from 'vitest';
import { HeroFactory } from '../src/factories/HeroFactory';
import { Game } from '../src/game/Game';
import { Logger } from '../src/utils/Logger';

describe('RPG Saga Tests', () => {
  beforeEach(() => {
    Logger.clear();
  });

  test('Создание героев через фабрику', () => {
    const knight = HeroFactory.createSpecificHero('Рыцарь', 'Тест', 100, 20);
    expect(knight.getType()).toBe('Рыцарь');
    expect(knight.getHealth()).toBe(100);
  });

  test('Рыцарь наносит урон', () => {
    const knight = HeroFactory.createSpecificHero('Рыцарь', 'Артур', 100, 20);
    const target = HeroFactory.createSpecificHero('Маг', 'Враг', 50, 10);
    
    const initialHealth = target.getHealth();
    knight.attack(target, 0);
    expect(target.getHealth()).toBeLessThan(initialHealth);
  });

  test('Маг может использовать заворожение', () => {
    const mage = HeroFactory.createSpecificHero('Маг', 'Гэндальф', 100, 20);
    const target = HeroFactory.createSpecificHero('Рыцарь', 'Враг', 100, 20);
    
    let charmUsed = false;
    for (let i = 0; i < 20; i++) {
      Logger.clear();
      mage.attack(target, 0);
      if (Logger.getLogs().some(log => log.includes('Заворожение'))) {
        charmUsed = true;
        break;
      }
    }
    
    expect(charmUsed).toBe(true);
  });

  test('Лучник может использовать огненные стрелы', () => {
    const archer = HeroFactory.createSpecificHero('Лучник', 'Леголас', 100, 20);
    const target = HeroFactory.createSpecificHero('Рыцарь', 'Враг', 100, 20);
    
    let fireArrowsUsed = false;
    for (let i = 0; i < 20; i++) {
      Logger.clear();
      archer.attack(target, 0);
      if (Logger.getLogs().some(log => log.includes('Огненные стрелы'))) {
        fireArrowsUsed = true;
        break;
      }
    }
    
    expect(fireArrowsUsed).toBe(true);
  });

  test('Игра с четным количеством игроков', () => {
    const heroes = HeroFactory.createRandomHeroes(4);
    expect(() => new Game(heroes)).not.toThrow();
  });

  test('Игра с нечетным количеством игроков выбрасывает ошибку', () => {
    const heroes = HeroFactory.createRandomHeroes(3);
    expect(() => new Game(heroes)).toThrow('Количество игроков должно быть четным');
  });

  test('Полный цикл игры', () => {
    const heroes = HeroFactory.createRandomHeroes(4);
    const game = new Game(heroes);
    const winner = game.start();
    
    expect(winner).toBeDefined();
    expect(winner.isAlive()).toBe(true);
    expect(Logger.getLogs().length).toBeGreaterThan(0);
  });
});