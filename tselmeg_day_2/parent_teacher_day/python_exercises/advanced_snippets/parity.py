def is_even(n):
    return n % 2 == 0


def main():
    x = int(input("Тоо оруул: "))
    if is_even(x):
        print("Энэ бол тэгш тоо.")
    else:
        print("Энэ бол сондгой тоо.")


if __name__ == "__main__":
    main()
