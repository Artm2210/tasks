import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app';

describe('Ship API Tests', () => {
  let server: any;
  let port = 3002;

  beforeAll(() => {
    const app = createApp();
    server = app.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  test('GET /api/ships возвращает массив кораблей', async () => {
    const response = await fetch(`http://localhost:${port}/api/ships`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('POST /api/ships создает новый корабль', async () => {
    const newShip = {
      id: 'TEST-001',
      name: 'Тестовый корабль',
      type: 'Тестовый',
      captain: 'Тестовый капитан',
      crew: 100,
      year: 2024
    };

    const response = await fetch(`http://localhost:${port}/api/ships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newShip)
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.id).toBe('TEST-001');
    expect(data.name).toBe('Тестовый корабль');
  });

  test('GET /api/ships/:id возвращает корабль по id', async () => {
    const response = await fetch(`http://localhost:${port}/api/ships/SHIP-001`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.id).toBe('SHIP-001');
    expect(data.name).toBe('Титаник');
  });

  test('PATCH /api/ships/:id обновляет корабль', async () => {
    const response = await fetch(`http://localhost:${port}/api/ships/SHIP-001`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Обновленный Титаник', crew: 1000 })
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.name).toBe('Обновленный Титаник');
    expect(data.crew).toBe(1000);
  });

  test('DELETE /api/ships/:id удаляет корабль', async () => {
    const response = await fetch(`http://localhost:${port}/api/ships/SHIP-002`, {
      method: 'DELETE'
    });
    
    expect(response.status).toBe(200);
    
    const checkResponse = await fetch(`http://localhost:${port}/api/ships/SHIP-002`);
    expect(checkResponse.status).toBe(404);
  });

  test('GET /api/ships с фильтром поиска', async () => {
    const response = await fetch(`http://localhost:${port}/api/ships?filter=Титаник`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data[0].name).toContain('Титаник');
  });

  test('GET /api/ships с пагинацией', async () => {
    const response = await fetch(`http://localhost:${port}/api/ships?page=1&take=2`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data.length).toBeLessThanOrEqual(2);
    expect(data.page).toBe(1);
    expect(data.take).toBe(2);
  });
});