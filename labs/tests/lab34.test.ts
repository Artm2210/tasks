import { calculate, task1, task2 } from '../src/lab34';

describe('Лабораторная работа №4', () => {
  test('calculate возвращает корректное значение', () => {
    const result = calculate(2.5, 4.6, 1.1);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  test('calculate работает с нулевыми параметрами', () => {
    const result = calculate(0, 0, 1);
    expect(result).toBeDefined();
    expect(isNaN(result)).toBe(false);
  });

  test('calculate работает с отрицательным x', () => {
    const result = calculate(1, 1, -1);
    expect(result).toBeDefined();
  });

  test('task1 не выбрасывает ошибку', () => {
    expect(() => task1(2.5, 4.6, 1.1, 3.6, 0.5)).not.toThrow();
  });

  test('task2 не выбрасывает ошибку', () => {
    expect(() => task2(2.5, 4.6, [1.28, 1.36, 1.46, 2.35])).not.toThrow();
  });
});