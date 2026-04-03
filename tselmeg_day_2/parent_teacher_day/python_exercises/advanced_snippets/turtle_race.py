import turtle
from random import randint
from time import sleep

sc = turtle.Screen()
sc.title("Turtle Race")
sc.bgcolor("#0a0a14")
sc.setup(700, 400)

colors = ["red", "cyan", "yellow", "lime"]
y_pos = [120, 40, -40, -120]
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

winner = None
while winner is None:
    for t in turtles:
        t.forward(randint(1, 20))
        if t.xcor() >= 300:
            winner = t.pencolor()
            break
    sleep(0.05)

sleep(1)
writer = turtle.Turtle()
writer.hideturtle()
writer.color("white")
writer.write(winner + " wins!", font=("Arial", 24, "bold"))
