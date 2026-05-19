import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export const ROOT_DIR = root;
export const DATA_DIR = path.join(root, "data");
export const EXPORT_DIR = path.join(root, "exports");
export const TMP_GRADING_DIR = path.join(root, "tmp_grading");
export const STUDENT_DATA_DIR =
  process.env.STUDENT_DATA_DIR ||
  "/Users/tsogboldbaatar/Desktop/Organized/Tselmeg_Projects/tselmeg_day_2/parent_teacher_day/data";

export const DB_FILE = path.join(DATA_DIR, "db.json");
export const PLAIN_CREDENTIALS_FILE = path.join(EXPORT_DIR, "student_credentials.csv");
export const SUPPORTED_GRADES = [6, 7, 8, 9, 11, 12];

export const TEACHER_USER = {
  id: "teacher-admin",
  role: "teacher",
  username: "admin",
  password: "admin-tselmeg-2026",
  name: "Багш админ"
};
