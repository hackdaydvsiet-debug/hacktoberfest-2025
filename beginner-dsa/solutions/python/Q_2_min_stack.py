class MinStack:
    def __init__(self):
        self.stack = []      # Main stack to store values
        self.min_stack = [float('inf')]  # Min stack initialized with infinity as sentinel

    def push(self, val: int) -> None:
        self.stack.append(val)
        # Push current minimum between val and last min onto min_stack
        current_min = min(val, self.min_stack[-1])
        self.min_stack.append(current_min)

    def pop(self) -> None:
        if self.stack:
            self.stack.pop()
            self.min_stack.pop()

    def top(self) -> int:
        if self.stack:
            return self.stack[-1]
        return None

    def getMin(self) -> int:
        # The last element in min_stack is current minimum
        if self.min_stack:
            return self.min_stack[-1]
        return None

# Example usage:
min_stack = MinStack()
min_stack.push(-2)
min_stack.push(0)
min_stack.push(-3)

print(min_stack.getMin())  # Returns -3
min_stack.pop()
print(min_stack.top())     # Returns 0
print(min_stack.getMin())  # Returns -2
