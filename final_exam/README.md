# Tselmeg Final Exam System

Local final exam platform for grades 6, 7, 8, 9, 11, and 12.

## Current Project Shape

- Framework: dependency-free Node.js HTTP server with a browser UI in `public/`.
- Storage: JSON database at `data/db.json`, plus CSV exports in `exports/`.
- Student data source: `/Users/tsogboldbaatar/Desktop/Organized/Tselmeg_Projects/tselmeg_day_2/parent_teacher_day/data`.
- Main files: `server.js`, `src/`, `scripts/`, `public/`, `tests/`.

Grade 6 is supported as an exam/class/account target, but its question content is intentionally pending.

## Run

```bash
npm run seed
npm start
```

Open `http://localhost:3001`.

Teacher login:

```text
admin / admin-tselmeg-2026
```

## Required Scripts

```bash
npm run seed_exam_questions
npm run generate_credentials
npm run assign_random_exam
npm run autograde_submission
npm test
```

`generate_credentials` reads the roster JSON files, creates hashed student accounts, and writes the one-time teacher export with plain passwords to:

```text
exports/student_credentials.csv
```

The app only stores hashed passwords in `data/db.json`.

## Features

- Teacher dashboard with classes, exams, students, submissions, question banks, CSV exports, score edits, and submission reset.
- Student login, assigned exam view, deterministic randomized questions, autosave, timer, submit lock, and score display after grading.
- 100 generated questions for grades 7/8/9 and 100 generated questions for grades 11/12.
- Per-student `random_seed` stored in each exam instance, used for question selection, question order, and choice order.
- Python write-code autograding with timeout and basic unsafe-code blocking.

## Notes

This is a local exam system. The Python grader uses a restricted subprocess and blocks common dangerous patterns, but it is not a hardened production sandbox. For internet-facing deployment, run code grading inside a locked-down container or separate worker VM.
