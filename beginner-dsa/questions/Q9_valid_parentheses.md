# Q9: Valid Parentheses

Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.

An input string is valid if:

1.  Open brackets must be closed by the same type of brackets.
2.  Open brackets must be closed in the correct order.

**Example 1:**

**Input:** s = "()"
**Output:** true

**Example 2:**

**Input:** s = "()[]{}"
**Output:** true

**Example 3:**

**Input:** s = "(]"
**Output:** false

SOLUTION(PYTHON)
def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    
    return len(stack) == 0


print(isValid("()"))
print(isValid("()[]{}"))
print(isValid("(]"))

EXPLANATION
This solution uses a stack data structure to track opening brackets. We iterate through each character in the string. When we encounter an opening bracket, we push it onto the stack. When we encounter a closing bracket, we check if the stack is empty or if the top of the stack doesn't match the corresponding opening bracket - if either condition is true, the string is invalid. If it matches, we pop the opening bracket from the stack. Finally, after processing all characters, a valid string should have an empty stack.

COMPLEXITY ANALYSIS
Time Complexity: O(n) - We traverse the string once, where n is the length of the string.
Space Complexity: O(n) - In the worst case, all characters are opening brackets and get pushed onto the stack.

EXAMPLES
Input: s = "()"
Output: True
Input: s = "()[]{}"
Output: True
Input: s = "(["
Output: False
Input: s = "([)]"
Output: False
Input: s = "{[]}"
Output: TrueRetry