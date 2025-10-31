def knapSack(W, wt, val, n):
    # Create a 2D DP table of size (n+1) x (W+1)
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

    # Build table dp[][] in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                # Include the item or exclude it
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]],
                               dp[i - 1][w])
            else:
                # Cannot include the item
                dp[i][w] = dp[i - 1][w]

    # The last cell of dp contains the result
    return dp[n][W]


# Example usage
val = [60, 100, 120]
wt = [10, 20, 30]
W = 50
n = len(val)

print("Maximum value in Knapsack =", knapSack(W, wt, val, n))
