import { readDb, writeDb } from "../src/db.js";
import { assignAll } from "../src/assignments.js";

const db = readDb();
assignAll(db);
writeDb(db);

console.log(`Assigned or loaded ${db.student_exam_instances.length} student exam instances.`);
