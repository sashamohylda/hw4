# HW4 — Announcements API with JWT Auth

## Запуск

```bash
# Встановити залежності
npm install

# Створити .env файл
cp .env .env.local  # або редагуй .env напряму

# Виконати міграцію БД
npm run prisma:migrate

# Запустити сервер
npm run dev
```

## API Endpoints

### Auth
| Метод | URL | Опис | Auth |
|-------|-----|------|------|
| POST | `/auth/register` | Реєстрація | ❌ |
| POST | `/auth/login` | Вхід | ❌ |
| POST | `/auth/refresh` | Оновити токен | ❌ |
| POST | `/auth/logout` | Вихід | ✅ |
| GET | `/auth/me` | Профіль | ✅ |

### Announcements
| Метод | URL | Опис | Auth |
|-------|-----|------|------|
| GET | `/announcements` | Всі оголошення | ❌ |
| GET | `/announcements/:id` | Одне оголошення | ❌ |
| POST | `/announcements` | Створити | ✅ |
| PATCH | `/announcements/:id` | Оновити (тільки своє) | ✅ |
| DELETE | `/announcements/:id` | Видалити (тільки своє) | ✅ |

## Swagger
http://localhost:3000/api-docs
