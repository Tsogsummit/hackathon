score_a = 0
score_b = 0

print("Воллейболын оноо тоологч эхэллээ!")
print("A эсвэл B оруулна уу. Гарахыг: Q")


def check_winner(a, b):
    if (a >= 25 or b >= 25) and abs(a - b) >= 2:
        return "A" if a > b else "B"
    return None


while True:
    print(f"A: {score_a}  |  B: {score_b}")
    point = input("Оноо авсан баг (A/B/Q): ").upper()

    if point == "Q":
        print("Тоглоом зогслоо.")
        break
    elif point == "A":
        score_a += 1
    elif point == "B":
        score_b += 1
    else:
        print("Зөвхөн A эсвэл B оруулна уу!")
        continue

    winner = check_winner(score_a, score_b)
    if winner:
        print(f"Баг {winner} яллаа! ({score_a} : {score_b})")
        break
