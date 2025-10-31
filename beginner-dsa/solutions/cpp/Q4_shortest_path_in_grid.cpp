#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Structure to represent a cell in the grid
struct Cell {
    int row, col, dist;
};

// Function to check if a cell is valid to move into
bool isValid(int r, int c, int m, int n, vector<vector<int>>& grid, vector<vector<bool>>& visited) {
    return (r >= 0 && r < m && c >= 0 && c < n && grid[r][c] == 0 && !visited[r][c]);
}

// Function to find the shortest path in the grid using BFS
int shortestPathInGrid(vector<vector<int>>& grid, pair<int, int> start, pair<int, int> end) {
    int m = grid.size();
    int n = grid[0].size();

    // If start or end is blocked
    if (grid[start.first][start.second] == 1 || grid[end.first][end.second] == 1)
        return -1;

    // Directions: up, down, left, right
    vector<pair<int, int>> directions = {{-1,0}, {1,0}, {0,-1}, {0,1}};

    vector<vector<bool>> visited(m, vector<bool>(n, false));
    queue<Cell> q;

    // Start BFS
    q.push({start.first, start.second, 0});
    visited[start.first][start.second] = true;

    while (!q.empty()) {
        Cell curr = q.front();
        q.pop();

        // If we reached the destination
        if (curr.row == end.first && curr.col == end.second)
            return curr.dist;

        // Explore all four directions
        for (auto& dir : directions) {
            int newRow = curr.row + dir.first;
            int newCol = curr.col + dir.second;

            if (isValid(newRow, newCol, m, n, grid, visited)) {
                visited[newRow][newCol] = true;
                q.push({newRow, newCol, curr.dist + 1});
            }
        }
    }

    // If no path found
    return -1;
}

// Driver code
int main() {
    vector<vector<int>> grid = {
        {0, 0, 1, 0},
        {1, 0, 1, 0},
        {0, 0, 0, 0},
        {0, 1, 1, 0}
    };

    pair<int, int> start = {0, 0};
    pair<int, int> end = {3, 3};

    int result = shortestPathInGrid(grid, start, end);
    if (result != -1)
        cout << "Shortest path length: " << result << endl;
    else
        cout << "No path exists." << endl;

    return 0;
}
