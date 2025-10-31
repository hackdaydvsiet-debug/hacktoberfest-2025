def partition(array, low, high):
    pivot = array[high]  # choose the rightmost element as pivot
    i = low - 1          # pointer for the greater element
    for j in range(low, high):
        if array[j] <= pivot:
            i += 1
            array[i], array[j] = array[j], array[i]  # swap elements
    array[i + 1], array[high] = array[high], array[i + 1]  # swap pivot to correct position
    return i + 1

def quick_sort(array, low, high):
    if low < high:
        pi = partition(array, low, high)  # partition index
        quick_sort(array, low, pi - 1)    # sort left subarray
        quick_sort(array, pi + 1, high)   # sort right subarray

# Example usage:
arr = [8, 7, 2, 1, 0, 9, 6]
quick_sort(arr, 0, len(arr) - 1)
print("Sorted array:", arr)
