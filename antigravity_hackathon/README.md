# EduSmart - Smart Dashboard

EduSmart нь FastAPI (Backend), PostgreSQL + Redis (Docker), Vite + React (Frontend) архитектуртай.

---

## Run Guide

### 1) Database + Redis асаах

Docker Desktop ажиллаж байгаа үед:

```bash
cd backend
docker-compose up -d
```

- PostgreSQL: `localhost:5433`
- Redis: `localhost:6380`

### 2) Backend асаах

```bash
cd backend
source .venv_311/bin/activate
uvicorn app.main:app --port 8080 --reload --reload-dir app --reload-exclude ".venv*"
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/docs`

### 3) Frontend асаах

```bash
cd frontend
# эхний удаа бол:
# npm install
npm run dev
```

- App: `http://localhost:3000`

---

## Автомат тест дата (startup дээр)

Backend эхлэх үед `AUTO_SEED_TEST_DATA=true` байвал demo дата автоматаар оруулна:

- багш/сурагч/эцэг эх хэрэглэгчид
- анги, хичээл, timetable
- туршилтын attendance/grade/attention өгөгдөл

Demo account:

- `teacher1@test.mn`
- `student1@test.mn`
- `parent1@test.mn`
- `admin@school.mn`
- Password: `123456`

Auto seed-г унтраах:

```env
AUTO_SEED_TEST_DATA=false
```

---

## Сервисүүдийг унтраах

1. Frontend/Backend terminal дээр `Ctrl + C`
2. Docker stack:

```bash
cd backend
docker-compose down
```
