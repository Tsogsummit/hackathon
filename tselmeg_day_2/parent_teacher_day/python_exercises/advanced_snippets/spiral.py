import turtle

t = turtle.Turtle()
t.speed(0)
turtle.bgcolor("black")

colors = ["red", "orange", "yellow", "green", "blue", "purple"]

for x in range(200):
    t.color(colors[x % 6])
    t.forward(x)
    t.left(59)
