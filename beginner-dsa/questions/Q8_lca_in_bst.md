# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


class Solution:
    def lowestCommonAncestor(self, root, p, q):
        # Traverse the BST
        while root:
            if p.val < root.val and q.val < root.val:
                # Both nodes are in the left subtree
                root = root.left
            elif p.val > root.val and q.val > root.val:
                # Both nodes are in the right subtree
                root = root.right
            else:
                # Split occurs — root is the LCA
                return root
        return None


# Helper function to insert nodes in BST
def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root


# Example usage
if __name__ == "__main__":
    # Construct the given BST
    vals = [6, 2, 8, 0, 4, 7, 9, 3, 5]
    root = None
    for v in vals:
        root = insert(root, v)

    p = root.left        # Node with value 2
    q = root.right       # Node with value 8
    sol = Solution()
    lca = sol.lowestCommonAncestor(root, p, q)
    print("LCA of nodes 2 and 8 is:", lca.val)

    p = root.left        # Node with value 2
    q = root.left.right  # Node with value 4
    lca = sol.lowestCommonAncestor(root, p, q)
    print("LCA of nodes 2 and 4 is:", lca.val)
