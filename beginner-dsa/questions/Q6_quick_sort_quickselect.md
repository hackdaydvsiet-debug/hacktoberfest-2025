# -----------------------------
# Quick Sort & Quickselect
# Hacktoberfest Contribution 💻
# -----------------------------

import random

def quick_sort(arr):
    """Sorts an array in ascending order using the Quick Sort algorithm."""
    if len(arr) <= 1:
        return arr  # Base case: already sorted

    pivot = random.choice(arr)  # Choose a random pivot for better performance
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    # Recursively sort and combine
    return quick_sort(left) + mi_
