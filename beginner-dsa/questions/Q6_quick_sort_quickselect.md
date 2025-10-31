def quick_sort(arr):
    if len(arr) <= 1:
        return arr  # Base case: already sorted
    
    pivot = arr[len(arr) // 2]  # Choose middle element as pivot
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)


# Example usage
if __name__ == "__main__":
    arr = [10, 7, 8, 9, 1, 5]
    print("Original array:", arr)
    sorted_arr = quick_sort(arr)
    print("Sorted array (ascending):", sorted_arr)
