def merge_sort_count_inversions(arr):
    if len(arr) <= 1:
        return arr, 0
    
    mid = len(arr) // 2
    left, left_inv = merge_sort_count_inversions(arr[:mid])
    right, right_inv = merge_sort_count_inversions(arr[mid:])
    
    merged, split_inv = merge_count_split_inv(left, right)
    
    total_inversions = left_inv + right_inv + split_inv
    return merged, total_inversions

def merge_count_split_inv(left, right):
    i = j = 0
    merged = []
    inversions = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            inversions += len(left) - i  # Count inversions here

    merged.extend(left[i:])
    merged.extend(right[j:])
    
    return merged, inversions

# Example usage
arr = [2, 4, 1, 3, 5]
sorted_arr, inversion_count = merge_sort_count_inversions(arr)
print("Sorted Array:", sorted_arr)
print("Number of Inversions:", inversion_count)
