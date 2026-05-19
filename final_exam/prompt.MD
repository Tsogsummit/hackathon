You are a senior full-stack developer. Build a complete final exam system for grades 6, 7, 8, 9, 11, and 12.

Project context:
The student data is located at:

/Users/tsogboldbaatar/Desktop/Organized/Tselmeg_Projects/tselmeg_day_2/parent_teacher_day/data

Use the existing student data from that folder to generate accounts for every student.

Main goal:
Create a final exam platform where teachers can create and manage exams, students can log in with generated usernames/passwords, take their assigned exam once, and receive automatically graded results.

Important:
6th grade exam details will be added later, so prepare the system to support grade 6 but do not hardcode its exam content yet.

General requirements:
1. Generate a username and password for each student.
2. Username should be simple and unique.
3. Password should be random but easy to type.
   Example style:
   - bat1234
   - nomi5821
   - code9472
   Avoid confusing characters like O/0, I/l/1.
4. Save generated credentials in a file that the teacher can export.
5. Each student can submit the exam only one time.
6. If the student refreshes the page, their selected/written answers must be saved automatically.
7. Teacher can set:
   - exam title
   - exam duration/time limit
   - grade/class
   - exam start/end availability if needed
8. Teacher can edit student scores after autograding.
9. Teacher can view:
   - submitted students
   - not submitted students
   - score per student
   - detailed answers
   - autograder result
   - manually edited score history if possible
10. Add a clean admin/teacher dashboard.
11. Add student login page.
12. Add exam taking page.
13. Add result/score page for teacher.
14. Add export to CSV/Excel for:
   - credentials
   - results
   - submissions

Authentication:
Create two roles:
1. Teacher/Admin
2. Student

Student:
- Can only see their own assigned exam.
- Can only submit once.
- Can continue if page refreshes before final submission.
- Cannot view answer keys.

Teacher/Admin:
- Can create/edit exams.
- Can edit questions.
- Can generate random exams for students.
- Can edit scores.
- Can export credentials and results.
- Can reset a student submission only if needed.

Question randomization:
Each student should receive a randomized version of the exam.
The system should select questions from question banks according to the rules below.
Question order and answer choices should be shuffled where possible.
Make sure the answer choices are professional and not obvious.
Do not make the longest answer always correct.
Do not make patterns like A, B, C, D predictable.
Distractors should be realistic and based on common student mistakes.

Grades 11 and 12 exam:
Topic:
Python CS50-style programming exam.

Topics:
1. List
2. Dictionary
3. Function
4. Library
5. Unit test

Question bank:
For each topic, create:
- 10 multiple-choice/test questions
- 10 write-code questions

Total question bank:
- List: 10 test + 10 write-code
- Dictionary: 10 test + 10 write-code
- Function: 10 test + 10 write-code
- Library: 10 test + 10 write-code
- Unit test: 10 test + 10 write-code

Total: 100 questions.

Per-student exam selection:
Each student gets:
- 2 random test questions from List
- 2 random write-code questions from List
- 2 random test questions from Dictionary
- 2 random write-code questions from Dictionary
- 2 random test questions from Function
- 2 random write-code questions from Function
- 2 random test questions from Library
- 2 random write-code questions from Library
- 2 random test questions from Unit Test
- 2 random write-code questions from Unit Test

So each grade 11/12 student receives:
- 10 test questions
- 10 write-code questions
- 20 total questions

Scoring for grades 11 and 12:
- Each test question = 1 point
- Each write-code question = 2 points
- Total = 30 points

Write-code grading for grades 11 and 12:
- Full correct answer: 2 points
- Partially correct answer: 1 point
- Incorrect/no meaningful attempt: 0 points
Teacher can manually edit the score.

Grades 7, 8, and 9 exam:
Topic:
Python programming exam.

Topics:
1. Input/output
2. Variable
3. If/elif/else
4. For loop
5. While loop

Question bank:
Create total 100 questions:
- 80 multiple-choice/test questions
- 20 write-code questions

Each topic should have enough questions to support randomization fairly.

Recommended bank structure:
For each topic:
- 16 test questions
- 4 write-code questions

Total:
- Input/output: 16 test + 4 write-code
- Variable: 16 test + 4 write-code
- If/elif/else: 16 test + 4 write-code
- For loop: 16 test + 4 write-code
- While loop: 16 test + 4 write-code

Per-student exam selection:
Each student gets:
- 15 test questions total
  - 3 test questions from each topic
- 5 write-code questions total
  - 1 write-code question from each topic

So each grade 7/8/9 student receives:
- 15 test questions
- 5 write-code questions
- 20 total questions

Scoring for grades 7, 8, and 9:
- Each test question = 1 point
- Each write-code question = 3 points
- Total = 30 points

Write-code grading for grades 7, 8, and 9:
- Fully correct answer: 3 points
- Mostly correct answer with small issue: 2 points
- Partially correct answer: 1 point
- Incorrect/no meaningful attempt: 0 points
Teacher can manually edit the score.

Autograder:
Build an autograder for write-code questions.

For multiple-choice:
- Grade by comparing selected answer with the correct answer.

For write-code:
- Run the submitted Python code safely.
- Compare output with expected output.
- Support multiple test cases for each problem.
- Give partial score based on passed test cases.
- Store:
  - submitted code
  - test case results
  - stdout
  - stderr/error message
  - score
- Add timeout protection.
- Prevent dangerous code execution as much as possible.
- Block or restrict unsafe imports and filesystem/network access if possible.

Autograder scoring:
For grade 11/12 write-code questions:
- 2 points if all tests pass
- 1 point if some tests pass or logic is partially correct
- 0 points if no tests pass or code does not run

For grade 7/8/9 write-code questions:
- 3 points if all tests pass
- 2 points if most tests pass
- 1 point if some tests pass
- 0 points if no tests pass or code does not run

Teacher score editing:
Teacher must be able to:
- Open a student's submission
- See autograder score
- See submitted code
- See test results
- Change score manually
- Add teacher comment
- Save edited score

Submission behavior:
1. Student logs in.
2. Student sees assigned exam.
3. Student starts exam.
4. Timer begins.
5. Answers are autosaved.
6. Student can refresh and continue.
7. Student submits.
8. After submit, student cannot edit again.
9. If timer ends, auto-submit current saved answers.

Data model:
Create models/tables for:
- users
- students
- teachers
- classes
- exams
- question_banks
- questions
- choices
- student_exam_instances
- answers
- submissions
- autograder_results
- manual_score_edits
- credentials

Question fields:
- id
- grade_group
- topic
- type: multiple_choice or write_code
- question_text
- choices
- correct_answer
- explanation
- difficulty
- points
- test_cases for write-code
- starter_code if needed
- hidden_tests if supported

Student exam instance:
- student_id
- exam_id
- selected_question_ids
- randomized_choice_order
- started_at
- submitted_at
- autosaved_answers
- final_score
- status: not_started, in_progress, submitted, auto_submitted

UI requirements:
Teacher dashboard:
- Login
- View classes
- View students
- Generate credentials
- Create exam
- Set title/time
- View question banks
- Edit questions
- View submissions
- Edit scores
- Export results

Student interface:
- Login with username/password
- See exam title and time
- Start exam
- Answer multiple-choice questions
- Write Python code answers
- Autosave indicator
- Timer
- Submit button
- Confirmation before submit

Question generation quality:
Generate professional teacher-level questions.
Avoid obvious answers.
For multiple-choice:
- 4 choices per question
- exactly 1 correct answer
- distractors should be realistic
- avoid silly answers
- avoid “all of the above” unless educationally useful
- avoid predictable answer patterns
- explanations should be included for teacher review

For write-code:
Each problem should include:
- clear task
- input format if needed
- output format if needed
- examples
- constraints suitable for the grade
- test cases
- expected output
- scoring logic

Difficulty:
Grades 7/8/9:
- Beginner to lower-intermediate Python
- Use simple input/output and basic logic
- Avoid advanced syntax
- Problems should be solvable with topics listed only

Grades 11/12:
- CS50-style Python
- Intermediate level
- Include lists, dictionaries, functions, libraries, and unit testing
- Problems should test actual understanding, not memorization only

Implementation requirements:
- First inspect the existing project structure.
- Reuse existing style, framework, and database if already present.
- Do not destroy existing files.
- Make incremental changes.
- Add clear README instructions.
- Add seed script to generate question banks.
- Add script to generate student credentials from the data folder.
- Add tests for important logic.
- Make sure the system can run locally.

Required scripts:
1. generate_credentials
   - Reads students from data folder
   - Creates username/password for each student
   - Saves credentials
   - Links credentials to student accounts

2. seed_exam_questions
   - Creates question banks for grades 7/8/9
   - Creates question banks for grades 11/12

3. assign_random_exam
   - Assigns randomized questions to each student according to grade rules

4. autograde_submission
   - Grades multiple-choice and write-code answers

Security:
- Hash passwords before saving.
- Do not store plain passwords except in one teacher-exportable credentials file generated at creation time.
- Protect teacher routes.
- Students must not access other students' exams.
- Students must not see answer keys.
- Prevent multiple submissions.
- Prevent editing after submit.

Deliverables:
1. Working exam system.
2. Generated usernames and passwords for all students found in the data folder.
3. Teacher dashboard.
4. Student login and exam page.
5. Question banks:
   - 100 questions for grade 11/12
   - 100 questions for grade 7/8/9
6. Autograder for write-code questions.
7. Autosave functionality.
8. One-time submission lock.
9. Manual score editing.
10. Export credentials and results.
11. README explaining how to run, seed, generate credentials, and use the system.

Before coding:
Inspect the project folder and explain:
- current framework
- current database/storage method
- where student data is stored
- what files need to be changed
- implementation plan

Then implement the system step by step.

Random seed requirement:
For every student exam instance, generate and store a unique random seed.

Purpose:
- The same student should always receive the same selected questions after the exam instance is created.
- If the page refreshes, server restarts, or teacher reopens the submission, the question set must not change.
- If debugging is needed, the teacher/developer should be able to recreate the exact same question selection and answer choice order using the saved seed.

Implementation:
- Store random_seed in student_exam_instances.
- Use this seed when selecting random questions.
- Use this seed when shuffling question order.
- Use this seed when shuffling multiple-choice answer choices.
- Do not regenerate questions after the exam instance already exists.
- If a student has an existing student_exam_instance, load it instead of creating a new one.

Student exam instance fields should include:
- student_id
- exam_id
- selected_question_ids
- randomized_choice_order
- random_seed
- started_at
- submitted_at
- autosaved_answers
- final_score
- status: not_started, in_progress, submitted, auto_submitted