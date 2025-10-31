def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        # Base cases: out of bounds or water
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
            return
        # Mark as visited
        grid[r][c] = '0'
        # Visit all 4 adjacent cells
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)

    return count

# Example usage:
grid1 = [
    list("11110"),
    list("11010"),
    list("11000"),
    list("00000")
]

grid2 = [
    list("11000"),
    list("11000"),
    list("00100"),
    list("00011")
]

print("Number of islands in grid1:", numIslands(grid1))  # Output: 1
print("Number of islands in grid2:", numIslands(grid2))  # Output: 3
