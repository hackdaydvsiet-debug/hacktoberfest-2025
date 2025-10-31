# -----------------------------------------
# Number of Islands - Hacktoberfest Edition
# -----------------------------------------

from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0
        
        rows, cols = len(grid), len(grid[0])
        island_count = 0

        def dfs(r, c):
            # Base conditions: stop if out of bounds or water
            if r < 0 or r >= rows or c < 0
