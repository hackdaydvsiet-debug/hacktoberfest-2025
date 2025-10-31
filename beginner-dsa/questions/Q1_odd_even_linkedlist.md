# Original list
mylist = [1, 2, 3, 4, 5]

# Lists to hold odd and even-positioned elements
odd_node = []
even_node = []

# Loop through the list with index starting from 1
for index, value in enumerate(mylist, start=1):
    if index % 2 != 0:
        odd_node.append(value)  # odd-positioned
    else:
        even_node.append(value)  # even-positioned

# Merge odd and even lists
merged_list = odd_node + even_node

# Print the result
for val in merged_list:
    print(f"{val}->", end="")
print("NULL")
