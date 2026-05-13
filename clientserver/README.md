# clientserver

Монорепозиторий **npm workspaces**: пакет **`client/`** (React + Vite) и **`server/`** (Express + TypeScript).

Подробные инструкции по каждой части — в **[`client/README.md`](client/README.md)** и **[`server/README.md`](server/README.md)**.

## Перед запуском

1. Установите **[Node.js](https://nodejs.org/)** (рекомендуется LTS, например 20.x).
2. В этой папке (`clientserver/`) выполните:

```bash
npm install
```

## Запуск и проверки

| Команда              | Назначение                                                                 |
| -------------------- | -------------------------------------------------------------------------- |
| `npm run client:dev` | Dev-сервер фронтенда (Vite), пакет `client`                                |
| `npm run server:dev` | Dev-сервер API с перезапуском, пакет `server`                              |
| `npm test`           | Тесты сервера (Vitest), из корня вызывается workspace `server`             |
| `npm run lint`       | ESLint во всех workspaces, где объявлен скрипт `lint`                    |
| `npm run format`     | Prettier во всех workspaces                                                |
| `npm run format:check` | Проверка форматирования Prettier без записи                            |

Обычно в разработке в **двух терминалах** параллельно: `npm run server:dev` и `npm run client:dev`.

## Как работать в проекте

- В **VS Code / Cursor** можно открыть **`clientserver.code-workspace`** для удобной работы с обоими пакетами.
- Скрипты вида `build`, `lint`, `test` для конкретного пакета запускайте из каталога `client/` или `server/` (см. их README) либо через `npm run <script> -w client` / `-w server`.
