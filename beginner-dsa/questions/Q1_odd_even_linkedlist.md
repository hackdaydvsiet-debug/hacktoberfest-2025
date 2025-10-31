#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> mylist = {1, 2, 3, 4, 5};  // Input list
    list<int> odd_node;
    list<int> even_node;

    int index = 1;
    for (auto it = mylist.begin(); it != mylist.end(); ++it, ++index) {
        if (index % 2 != 0) {
            odd_node.push_back(*it);  // odd-positioned node
        } else {
            even_node.push_back(*it); // even-positioned node
        }
    }

    // Combine odd and even lists
    odd_node.insert(odd_node.end(), even_node.begin(), even_node.end());

    // Print result
    for (int val : odd_node) {
        cout << val << "->";
    }
    cout << "NULL" << endl;

    return 0;
}
