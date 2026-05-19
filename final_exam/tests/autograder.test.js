import test from "node:test";
import assert from "node:assert/strict";
import { gradeCodeQuestion } from "../src/autograder.js";

test("autograder gives full credit for matching output", async () => {
  const question = {
    id: "q1",
    test_cases: [{ input: "2\n3\n", expected_output: "5\n" }]
  };
  const result = await gradeCodeQuestion(question, "a=int(input())\nb=int(input())\nprint(a+b)\n", 3);
  assert.equal(result.score, 3);
  assert.equal(result.tests[0].passed, true);
});

test("autograder blocks unsafe filesystem code", async () => {
  const question = {
    id: "q2",
    test_cases: [{ input: "", expected_output: "" }]
  };
  const result = await gradeCodeQuestion(question, "print(open('/etc/passwd').read())", 2);
  assert.equal(result.score, 0);
  assert.match(result.stderr, /Blocked unsafe/);
});
