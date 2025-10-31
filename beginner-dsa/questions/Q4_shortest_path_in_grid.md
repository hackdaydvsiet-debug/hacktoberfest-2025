from collections import deque

def shortest_path_in_grid(grid, start, end):
    m, n = len(grid), len(grid[0])
    queue = deque()
    visited = [[False]*n for _ in range(m)]
    queue.append((start[0], start[1], 0))  # (row, col, steps)
    visited[start[0]][start[1]] = True

    directions = [(-1,0), (1,0), (0,-1), (0,1)]
    while queue:
        r, c, steps = queue.popleft()
        if (r, c) == end:
            return steps
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc] and grid[nr][nc] != 1:
                visited[nr][nc] = True
                queue.append((nr, nc, steps+1))
    return -1
