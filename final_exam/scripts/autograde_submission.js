import { readDb, writeDb } from "../src/db.js";
import { autogradeInstance } from "../src/autograder.js";

const instanceId = process.argv[2];
const db = readDb();
const targets = instanceId
  ? db.student_exam_instances.filter((instance) => instance.id === instanceId)
  : db.student_exam_instances.filter((instance) => ["submitted", "auto_submitted"].includes(instance.status));

for (const instance of targets) {
  await autogradeInstance(db, instance);
}
writeDb(db);
console.log(`Autograded ${targets.length} submission(s).`);
