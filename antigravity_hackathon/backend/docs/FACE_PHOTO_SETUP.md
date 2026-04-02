# Student Face Photo Setup

Use this process to register student photos so your face detection pipeline can map faces to students later.

## 1) Seed demo users/classes first

Log in as admin and call:

- `POST /api/admin/seed-demo`

This creates:

- 1 principal
- 2 teachers
- 24 students
- 24 parents
- class enrollments, parent links, and 2 lessons

Default demo password is `123456`.

## 2) Save photos on disk

Create a folder for student images:

- `backend/data/student_faces/`

Name files consistently (recommended):

- `student_01.jpg`, `student_02.jpg`, ...

You can also use any path you want, but keep stable paths.

## 3) Link each student to their photo path

For each student, call admin endpoint:

- `POST /api/admin/students/face-profile`

Body example:

```json
{
  "student_id": 5,
  "image_path": "data/student_faces/student_01.jpg"
}
```

If a profile already exists, this endpoint updates the path.

## 4) Report low-attention students (<60%)

Teacher endpoint:

- `POST /api/teacher/lessons/{lesson_id}/attention-report`

Body example:

```json
{
  "records": [
    { "student_id": 5, "attention_score": 58.5, "notes": "camera off / distracted" },
    { "student_id": 6, "attention_score": 77.0 },
    { "student_id": 7, "attention_score": 49.0, "notes": "left seat often" }
  ]
}
```

Behavior:

- Saves all records.
- For students with `attention_score < 60`:
  - notifies the teacher
  - notifies school side (`admin` + `principal`)

## 5) Practical tips for good face matching

- Use clear front-face photos.
- Avoid masks/sunglasses in the reference photo.
- Prefer similar lighting to classroom camera conditions.
- Use one photo per student first; add multiple photos later only if needed.
