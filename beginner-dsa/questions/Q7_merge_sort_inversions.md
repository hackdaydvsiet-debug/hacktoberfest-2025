def merge_sort_and_count(arr):
    # Base case: A single element has no inversions
    if len(arr) <= 1:
        return arr, 0

    # Split array into halves
    mid = len(arr) // 2
    left, inv_left = merge_sort_and_count(arr[:mid])
    right, inv_right = merge_sort_and_count(arr[mid:])

    # Merge both halves and count split inversions
    merged, inv_split = merge_and_count(left, right)

    # Total inversions = left + right + split
    total_inversions = inv_left + inv_right + inv_split

    return merged, total_inversions


def merge_and_count(left, right):
    merged = []
    i = j = inversions = 0

    # Merge with inversion counting
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            # All remaining elements in left[i:] are greater than right[j]
            inversions += len(left) - i

    # Append remaining elements
    merged += left[i:]
    merged += right[j:]

    return merged, inversions


# Example usage
arr = [2, 4, 1, 3, 5]
sorted_arr, inversion_count = merge_sort_and_count(arr)

print("Sorted array:", sorted_arr)
print("Number of inversions:", inversion_coun_
