import java.util.Stack;

public class Q2_min_stack {

    // Inner MinStack class
    static class MinStack {
        private Stack<Integer> stack;
        private Stack<Integer> minStack;

        // Constructor initializes both stacks
        public MinStack() {
            stack = new Stack<>();
            minStack = new Stack<>();
        }

        // Pushes element onto the stack
        public void push(int val) {
            stack.push(val);
            if (minStack.isEmpty() || val <= minStack.peek()) {
                minStack.push(val);
            }
        }

        // Removes top element
        public void pop() {
            if (stack.isEmpty()) return;
            int removed = stack.pop();
            if (removed == minStack.peek()) {
                minStack.pop();
            }
        }

        // Returns top element
        public int top() {
            if (stack.isEmpty()) throw new RuntimeException("Stack is empty");
            return stack.peek();
        }

        // Returns minimum element
        public int getMin() {
            if (minStack.isEmpty()) throw new RuntimeException("Stack is empty");
            return minStack.peek();
        }
    }

    // Main method to test the MinStack
    public static void main(String[] args) {
        MinStack minStack = new MinStack();
        minStack.push(-2);
        minStack.push(0);
        minStack.push(-3);
        System.out.println("Minimum: " + minStack.getMin()); // Output: -3
        minStack.pop();
        System.out.println("Top: " + minStack.top());         // Output: 0
        System.out.println("Minimum: " + minStack.getMin());  // Output: -2
    }
}
