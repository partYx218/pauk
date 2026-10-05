numbers = []
for i in range(5):
    num = int(input())
    numbers.append(num)
print( numbers)
maximum = numbers[0]
minimum = numbers[0]
for num in numbers:
    if num > maximum:
        maximum = num
    if num < minimum:
        minimum = num
print("Максимальное число:", maximum)
print("Минимальное число:", minimum)