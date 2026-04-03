import turtle
import random
from time import sleep

sc = turtle.Screen()
sc.title("Snake Game")
sc.bgcolor("black")
sc.setup(620, 620)
sc.tracer(0)

head = turtle.Turtle()
head.shape("square")
head.color("lime")
head.speed(0)
head.penup()
head.goto(0, 0)


def go_up():
    head.setheading(90)


def go_down():
    head.setheading(270)


def go_left():
    head.setheading(180)


def go_right():
    head.setheading(0)


sc.listen()
sc.onkeypress(go_up, "Up")
sc.onkeypress(go_down, "Down")
sc.onkeypress(go_left, "Left")
sc.onkeypress(go_right, "Right")

food = turtle.Turtle()
food.shape("circle")
food.color("red")
food.speed(0)
food.penup()
food.goto(100, 100)

pen = turtle.Turtle()
pen.hideturtle()
pen.penup()
pen.goto(0, 280)
pen.color("white")

score = 0
segments = []


def reset_game():
    global score, segments
    sleep(1)
    head.goto(0, 0)
    head.setheading(0)
    for seg in segments:
        seg.hideturtle()
    segments.clear()
    score = 0


while True:
    sc.update()
    sleep(0.1)

    for i in range(len(segments) - 1, 0, -1):
        x = segments[i - 1].xcor()
        y = segments[i - 1].ycor()
        segments[i].goto(x, y)
    if segments:
        segments[0].goto(head.xcor(), head.ycor())

    head.forward(20)

    if head.distance(food) < 20:
        x = random.randint(-13, 13) * 20
        y = random.randint(-13, 13) * 20
        food.goto(x, y)
        seg = turtle.Turtle()
        seg.shape("square")
        seg.color("green")
        seg.speed(0)
        seg.penup()
        segments.append(seg)
        score += 1
        pen.clear()
        pen.write(
            "Оноо: " + str(score),
            align="center",
            font=("Arial", 18, "bold"),
        )

    if abs(head.xcor()) > 300 or abs(head.ycor()) > 300:
        reset_game()

    for seg in segments:
        if head.distance(seg) < 20:
            reset_game()
