class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        bracket_map = {')': '(', '}': '{', ']': '['}

        for char in s:
            if char in bracket_map.values():  # Opening brackets
                stack.append(char)
            elif char in bracket_map:  # Closing brackets
                if not stack or stack[-1] != bracket_map[char]:
                    return False
                stack.pop()
            else:
                # Ignore invalid characters (if any)
                return False

        return not stack  # Valid if stack is empty


# Example usage
if __name__ == "__main__":
    sol = Solution()

    test_cases = ["()", "()[]{}", "(]", "([)]", "{[]}"]

    for s in test_cases:
        print(f"{s} -> {sol.isValid(s)}")
