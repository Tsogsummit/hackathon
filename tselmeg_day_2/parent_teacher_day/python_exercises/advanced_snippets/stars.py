import turtle
import random

t = turtle.Turtle()
t.speed(0)
colors = ["red", "blue", "yellow", "green", "purple", "orange"]


def draw_star(size):
    for i in range(5):
        t.forward(size)
        t.right(144)


for i in range(10):
    x = random.randint(-200, 200)
    y = random.randint(-200, 200)
    s = random.randint(20, 100)

    t.penup()
    t.goto(x, y)
    t.pendown()
    t.color(random.choice(colors))
    draw_star(s)
