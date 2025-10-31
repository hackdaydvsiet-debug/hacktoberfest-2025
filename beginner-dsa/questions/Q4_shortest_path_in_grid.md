# -----------------------------------------------------

# Shortest Path in a Grid

# Hacktoberfest 2025 / Beginner DSA

# -----------------------------------------------------

def shortest_path_dfs(grid, start, end):
"""
Find the shortest path in a grid using DFS (Depth-First Search).

```
Parameters:
    grid  (List[List[int]]): 2D grid (0 = open space, 1 = wall)
    start (tuple): (row, col) start position
    end   (tuple): (row, col) destination position

Returns:
    int: Shortest path length or -1 if no valid path exists.
"""

m, n = len(grid), len(grid[0])
(sr, sc) = start
(er, ec) = end

# Track visited cells
visited = [[False for _ in range(n)] for _ in range(m)]

# Stor
```
