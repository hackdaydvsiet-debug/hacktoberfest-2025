from collections import deque

def shortest_path(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    visited = [[False]*cols for _ in range(rows)]
    queue = deque()

    # Directions: up, right, down, left
    directions = [(-1,0), (0,1), (1,0), (0,-1)]

    sx, sy = start
    ex, ey = end

    if grid[sx][sy] == 1 or grid[ex][ey] == 1:
        return -1  # Start or end is a wall

    queue.append((sx, sy, 0))  # (x, y, distance)
    visited[sx][sy] = True

    while queue:
        x, y, dist = queue.popleft()

        if (x, y) == (ex, ey):
            return dist

        for dx, dy in directions:
            nx, ny = x + dx, y + dy

            if 0 <= nx < rows and 0 <= ny < cols:
                if not visited[nx][ny] and grid[nx][ny] == 0:  # 0 means open space
                    visited[nx][ny] = True
                    queue.append((nx, ny, dist + 1))

    return -1  # No path found

# Example usage: 0=open, 1=wall
grid = [
    [0, 0, 0, 1],
    [1, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
]

start = (0, 0)
end = (4, 3)

print("Shortest path length:", shortest_path(grid, start, end))
