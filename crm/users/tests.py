exp = "12* 123"
stack = []
def add(a,b):
    return float(a)+float(b)
def mul(a,b):
    return float(a)*float(b)
def div(a,b):
    return float(a)/float(b)
def eval(item):
    temp = 0
    mul_indices = [i for i, x in enumerate(item) if x == "*"]

    # for index,i in enumerate(mul_indices):
    #     temp = mul(item[i - 1], item[i + 1])
    #     if index > 0:
    #         if mul_indices[index] - mul_indices[index-1] == 2:
    #             temp = mul(temp, item[idx + 1])
    #         else:
    #             temp = mul(item[i - 1], item[i + 1])

    for idx,i in enumerate(item):
        if i == "*":
            if temp:
                temp = mul(temp, item[idx + 1])
            else:
                temp = mul(item[idx - 1], item[idx + 1])
        if i == "+":
            if temp:
                temp = add(temp, item[idx + 1])
            else:
                temp = add(item[idx - 1], item[idx + 1])
        if i == "/":
            if temp:
                temp = div(temp, item[idx + 1])
            else:
                temp = div(item[idx - 1], item[idx + 1])
    return temp

result = 0
expression = []
temp=""
for idx,i in enumerate(exp):
    operator = ["*","/","+","-"]
    if i in operator:
        expression.append(temp)
        expression.append(i)
        temp=""
    else:
        if(i != " "):
            temp +=i
expression.append(temp)
for i in expression:
    if i == ")":
        result = eval(stack)
        stack = []
        if i != " ":
            stack.append(result)
    else:
        if i != "(":
            stack.append(i)
print(eval(stack))


