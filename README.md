# Some backend

REST API сервер на Node.js, Express та TypeScript.

## Встановлення та запуск

Потрібен Node.js `>=20` та npm.

```bash
npm install
npm run dev
```

Сервер запускається на `http://localhost:3000` (або на порту з `PORT`). Для production-запуску виконайте `npm run build`, потім `npm start`.

## API подій

Події зберігаються у `data/events.json`. Кожна подія має `id`, `title` та `date`.

| Метод | Шлях | Дія |
| --- | --- | --- |
| GET | `/api/events` | Список подій |
| GET | `/api/events/:id` | Одна подія |
| POST | `/api/events` | Створення події; потрібні `title` та `date` |
| PATCH | `/api/events/:id` | Часткове оновлення `title` та/або `date` |
| DELETE | `/api/events/:id` | Видалення події |
| GET | `/api/events/error/test` | Тест глобального обробника помилок |

Кожна відповідь містить заголовок `X-Request-Id`. Невідомий маршрут відповідає `404` з JSON `statusCode`, `message` та `requestId`. Необроблена помилка відповідає `500` у такому ж форматі.

## Порядок middleware

1. `requestId` створює ідентифікатор до маршрутизації, щоб його могли використовувати всі обробники та відповіді про помилки.
2. `logger` також підключений перед маршрутами, щоб спостерігати завершення кожного запиту, включно з 404 та помилками, і виводити метод, адресу, статус, тривалість та requestId.
3. Router перевіряє маршрути подій. Якщо жоден маршрут не відповів, Express продовжує ланцюжок.
4. `notFound` стоїть після маршрутів, щоб не перехоплювати запити, які вони обробляють.
5. `errorHandler` стоїть останнім: Express передає помилки до middleware з чотирма параметрами, а цей обробник отримує помилки з усіх попередніх middleware та маршрутів.

Під час розробки в консолі також видно повідомлення з номерами кроків, коли виконуються відповідні middleware.

## Приклади запитів

```bash
curl -i http://localhost:3000/api/events
curl -i http://localhost:3000/api/events/1
curl -i -X POST http://localhost:3000/api/events -H "Content-Type: application/json" -d '{"title":"Node.js Workshop","date":"2026-11-15"}'
curl -i -X PATCH http://localhost:3000/api/events/1 -H "Content-Type: application/json" -d '{"title":"Updated Event"}'
curl -i -X DELETE http://localhost:3000/api/events/1
curl -i http://localhost:3000/api/unknown
```

Щоб перевірити глобальний error handler:

```bash
curl -i http://localhost:3000/api/events/error/test
```
