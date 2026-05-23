import { Ship, runLab5 } from '../src/lab5';

describe('Лабораторная работа №5', () => {
  let ship: Ship;

  beforeEach(() => {
    ship = new Ship("Титаник", 269, 52310);
  });

  test('Создание корабля', () => {
    expect(ship.getName()).toBe("Титаник");
    expect(ship.getLength()).toBe(269);
    expect(ship.getDisplacement()).toBe(52310);
  });

  test('Изменение имени корабля', () => {
    ship.setName("Аврора");
    expect(ship.getName()).toBe("Аврора");
  });

  test('Изменение длины корабля', () => {
    ship.setLength(275);
    expect(ship.getLength()).toBe(275);
  });

  test('Изменение водоизмещения корабля', () => {
    ship.setDisplacement(53000);
    expect(ship.getDisplacement()).toBe(53000);
  });

  test('Создание корабля с отрицательными значениями', () => {
    const negativeShip = new Ship("Тест", -100, -5000);
    expect(negativeShip.getLength()).toBe(-100);
    expect(negativeShip.getDisplacement()).toBe(-5000);
  });

  test('Запуск runLab5 не выбрасывает ошибку', () => {
    expect(() => runLab5()).not.toThrow();
  });
});