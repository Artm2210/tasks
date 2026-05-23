import { HeroFactory } from './factories/HeroFactory';
import { Game } from './game/Game';
import { Logger } from './utils/Logger';

const playerCount = 6;

function startGame() {
  Logger.clear();
  console.log(`Создаем ${playerCount} игроков...\n`);
  
  const heroes = HeroFactory.createRandomHeroes(playerCount);
  const game = new Game(heroes);
  const winner = game.start();
}

startGame();