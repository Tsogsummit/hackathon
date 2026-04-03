import turtle

sc = turtle.Screen()
sc.setup(660, 660)
sc.title("XO Тоглоом")
sc.bgcolor("#0a0f18")

draw_t = turtle.Turtle()
draw_t.hideturtle()
draw_t.speed(0)
draw_t.penup()
msg_t = turtle.Turtle()
msg_t.hideturtle()
msg_t.speed(0)
msg_t.penup()

board = [""] * 9
player = "X"
game_on = True
scores = {"X": 0, "O": 0}

CELLS = [
    (-200, 200),
    (0, 200),
    (200, 200),
    (-200, 0),
    (0, 0),
    (200, 0),
    (-200, -200),
    (0, -200),
    (200, -200),
]
WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]


def draw_grid():
    draw_t.pensize(4)
    draw_t.pencolor("#334155")
    for x in [-100, 100]:
        draw_t.goto(x, -300)
        draw_t.pendown()
        draw_t.goto(x, 300)
        draw_t.penup()
    for y in [-100, 100]:
        draw_t.goto(-300, y)
        draw_t.pendown()
        draw_t.goto(300, y)
        draw_t.penup()


def draw_x(cx, cy):
    draw_t.pensize(5)
    draw_t.pencolor("#f472b6")
    draw_t.goto(cx - 50, cy + 50)
    draw_t.pendown()
    draw_t.goto(cx + 50, cy - 50)
    draw_t.penup()
    draw_t.goto(cx + 50, cy + 50)
    draw_t.pendown()
    draw_t.goto(cx - 50, cy - 50)
    draw_t.penup()


def draw_o(cx, cy):
    draw_t.pensize(5)
    draw_t.pencolor("#38bdf8")
    draw_t.goto(cx, cy - 50)
    draw_t.pendown()
    draw_t.circle(50)
    draw_t.penup()


def show_msg(text, color="white"):
    msg_t.clear()
    msg_t.color(color)
    msg_t.goto(0, -310)
    msg_t.write(text, align="center", font=("Arial", 20, "bold"))


def check_winner():
    global game_on
    for combo in WINS:
        a, b, c = combo[0], combo[1], combo[2]
        if board[a] == board[b] == board[c] and board[a] != "":
            game_on = False
            scores[board[a]] += 1
            show_msg(board[a] + " яллаа!")
            return
    if "" not in board:
        game_on = False
        show_msg("Тэнцлээ!")


def handle_click(x, y):
    global player, board, game_on
    if not game_on:
        board = [""] * 9
        draw_t.clear()
        msg_t.clear()
        game_on = True
        player = "X"
        draw_grid()
        return
    for i, (cx, cy) in enumerate(CELLS):
        if abs(x - cx) < 100 and abs(y - cy) < 100 and not board[i]:
            board[i] = player
            if player == "X":
                draw_x(cx, cy)
            else:
                draw_o(cx, cy)
            check_winner()
            if not game_on:
                return
            player = "O" if player == "X" else "X"
            break


draw_grid()
sc.onclick(handle_click)
