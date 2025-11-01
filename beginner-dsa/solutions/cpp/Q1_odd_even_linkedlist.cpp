#include <iostream>
using namespace std;

// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* oddEvenList(ListNode* head) {
    if (!head || !head->next) return head;  // Edge case: 0 or 1 node
    
    ListNode* odd = head;           // Pointer for odd nodes
    ListNode* even = head->next;    // Pointer for even nodes
    ListNode* evenHead = even;      // Store head of even list
    
    while (even && even->next) {
        odd->next = even->next;     // Link odd to the next odd node
        odd = odd->next;            // Move odd pointer
        even->next = odd->next;     // Link even to the next even node
        even = even->next;          // Move even pointer
    }
    
    odd->next = evenHead;           // Connect odd list to even list
    return head;
}

// Helper function to print linked list
void printList(ListNode* head) {
    while (head) {
        cout << head->val;
        if (head->next) cout << "->";
        head = head->next;
    }
    cout << "->NULL" << endl;
}

// Driver code
int main() {
    // Creating linked list: 1->2->3->4->5->NULL
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    head->next->next->next = new ListNode(4);
    head->next->next->next->next = new ListNode(5);

    cout << "Input: ";
    printList(head);
    
    head = oddEvenList(head);

    cout << "Output: ";
    printList(head);

    return 0;
}
