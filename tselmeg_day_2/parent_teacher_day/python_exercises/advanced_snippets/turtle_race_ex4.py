import turtle
from random import randint
from time import sleep

sc = turtle.Screen()
sc.title("5 Race Championship")
sc.bgcolor("#0a0a14")
sc.setup(700, 400)

colors = ["red", "cyan", "yellow", "lime"]
y_pos = [120, 40, -40, -120]
scores = {"red": 0, "cyan": 0, "yellow": 0, "lime": 0}

turtles = []
for i in range(4):
    t = turtle.Turtle()
    t.shape("turtle")
    t.color(colors[i])
    t.shapesize(1.5, 1.5, 1)
    t.speed(0)
    t.penup()
    t.goto(-300, y_pos[i])
    t.pendown()
    turtles.append(t)

for round_num in range(5):
    for i, t in enumerate(turtles):
        t.penup()
        t.goto(-300, y_pos[i])
        t.pendown()

    winner = None
    while winner is None:
        for t in turtles:
            t.forward(randint(1, 20))
            if t.xcor() >= 300:
                winner = t.pencolor()
                scores[winner] += 1
                break
        sleep(0.03)

    print("Уралдаан " + str(round_num + 1) + ": " + winner + " яллаа")
    sleep(1)

champion = "red"
for k in scores:
    if scores[k] > scores[champion]:
        champion = k
writer = turtle.Turtle()
writer.hideturtle()
writer.color("white")
writer.write(
    "Champion: " + champion + " (" + str(scores[champion]) + "/5)",
    font=("Arial", 18, "bold"),
)
