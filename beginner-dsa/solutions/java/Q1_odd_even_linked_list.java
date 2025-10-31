class ListNode {
    int val;
    ListNode next;
    ListNode(int val) {
        this.val = val;
    }
}

public class OddEvenLinkedList{
    public static ListNode oddEvenList(ListNode head) {
        if (head == null || head.next == null) return head;

        ListNode odd = head;
        ListNode even = head.next;
        ListNode evenHead = even; 

        while (even != null && even.next != null) {
            odd.next = even.next;   
            odd = odd.next;         
            even.next = odd.next;   
            even = even.next;       
        }

        odd.next = evenHead;       
        return head;
    }

    public static void printList(ListNode head) {
    while (head != null) {
        System.out.print(head.val + " -> ");
        head = head.next;
    }
    System.out.println("NULL");
}

   
    public static void main(String[] args) {
      
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        System.out.println("Original list:");
        printList(head);

        head = oddEvenList(head);

        System.out.println("After grouping odd and even nodes:");
        printList(head);
    }
}
