import turtle

t = turtle.Turtle()
t.shape("turtle")
t.color("blue")
t.speed(5)

n = int(input("Хэдэн өнцөгт зурах вэ? "))
angle = 360 / n

for i in range(n):
    t.forward(100)
    t.left(angle)
