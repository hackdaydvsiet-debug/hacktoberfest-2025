#include <iostream>
#include <stack>
using namespace std;

class MinStack {
private:
    stack<int> s;        // main stack
    stack<int> minStack; // stack to keep track of minimum elements

public:
    // Initialize the stack object
    MinStack() {}

    // Push element onto stack
    void push(int val) {
        s.push(val);
        // If minStack is empty or val <= current min, push onto minStack
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        }
    }

    // Remove the element on top of stack
    void pop() {
        if (s.empty()) return;
        int topVal = s.top();
        s.pop();
        // If the popped value is the current minimum, pop from minStack too
        if (!minStack.empty() && topVal == minStack.top()) {
            minStack.pop();
        }
    }

    // Get the top element
    int top() {
        if (s.empty()) {
            throw runtime_error("Stack is empty");
        }
        return s.top();
    }

    // Retrieve the minimum element in the stack
    int getMin() {
        if (minStack.empty()) {
            throw runtime_error("Stack is empty");
        }
        return minStack.top();
    }
};

// Driver code
int main() {
    MinStack st;
    st.push(-2);
    st.push(0);
    st.push(-3);
    cout << "Current minimum: " << st.getMin() << endl; // Output: -3
    st.pop();
    cout << "Top element: " << st.top() << endl;        // Output: 0
    cout << "Current minimum: " << st.getMin() << endl; // Output: -2
    return 0;
}
