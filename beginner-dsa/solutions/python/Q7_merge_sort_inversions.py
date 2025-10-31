# Placeholder for solution# Merge Sort with Inversion Counting
# ----------------------------------
# An inversion is a pair (i, j) such that i < j and arr[i] > arr[j].
# Merge Sort helps count inversions efficiently in O(n log n) time.

def merge_sort(arr):
    """
    Main merge sort function that returns both:
    - The sorted array
    - The count of inversions in the array
    """
    if len(arr) <= 1:
        return arr, 0  # Base case: no inversions in a single-element array
    
    # Split the array into two halves
    mid = len(arr) // 2
    left, left_inv = merge_sort(arr[:mid])    # Sort left half and count inversions
    right, right_inv = merge_sort(arr[mid:])  # Sort right half and count inversions
    
    # Merge the two sorted halves and count cross inversions
    merged, cross_inv = merge(left, right)
    
    # Total inversions = left + right + cross
    total_inversions = left_inv + right_inv + cross_inv
    return merged, total_inversions


def merge(left, right):
    """
    Merge two sorted arrays while counting cross inversions.
    Cross inversion occurs when an element in 'left' is greater than an element in 'right'.
    """
    merged = []
    i = j = 0
    inversions = 0
    
    # Merge the two halves
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            # No inversion, add smaller element
            merged.append(left[i])
            i += 1
        else:
            # Found inversions: all remaining elements in 'left' are greater than right[j]
            merged.append(right[j])
            j += 1
            inversions += (len(left) - i)
    
    # Append remaining elements
    merged.extend(left[i:])
    merged.extend(right[j:])
    
    return merged, inversions


# Example usage
if __name__ == "__main__":
    arr = [8, 4, 2, 1]
    sorted_arr, inversion_count = merge_sort(arr)
    print("Original array:", arr)
    print("Sorted array:", sorted_arr)
    print("Number of inversions:", inversion_count)
