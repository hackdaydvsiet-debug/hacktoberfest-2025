class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def oddEvenList(head):
    if not head or not head.next:
        return head

    odd = head
    even = head.next
    even_head = even  # Save start of even list

    while even and even.next:
        odd.next = even.next
        odd = odd.next

        even.next = odd.next
        even = even.next

    odd.next = even_head  # Attach even list after odd list
    return head

# Example usage:
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)
head.next.next.next = ListNode(4)
head.next.next.next.next = ListNode(5)

result = oddEvenList(head)

# Print output list
current = result
while current:
    print(current.val, end="->" if current.next else "->NULL\n")
    current = current.next
