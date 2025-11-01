#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

class Graph {
    int V; // Number of vertices
    vector<vector<pair<int, int>>> adj; // adjacency list: (neighbor, weight)

public:
    Graph(int vertices) {
        V = vertices;
        adj.resize(V);
    }

    // Add edge to the graph
    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w}); // Remove this line if the graph is directed
    }

    // Dijkstra's Algorithm
    void dijkstra(int src) {
        vector<int> dist(V, INT_MAX); // Distance from source to each vertex
        dist[src] = 0;

        // Min-heap: (distance, vertex)
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        pq.push({0, src});

        while (!pq.empty()) {
            int u = pq.top().second;
            int d = pq.top().first;
            pq.pop();

            // Skip if this distance is not the latest
            if (d > dist[u]) continue;

            // Traverse neighbors
            for (auto &edge : adj[u]) {
                int v = edge.first;
                int weight = edge.second;

                // Relaxation step
                if (dist[v] > dist[u] + weight) {
                    dist[v] = dist[u] + weight;
                    pq.push({dist[v], v});
                }
            }
        }

        // Print shortest distances
        cout << "Vertex\tDistance from Source (" << src << ")\n";
        for (int i = 0; i < V; ++i) {
            cout << i << "\t" << dist[i] << "\n";
        }
    }
};

// Driver code
int main() {
    int V = 5; // Number of vertices
    Graph g(V);

    // Add edges (u, v, weight)
    g.addEdge(0, 1, 9);
    g.addEdge(0, 2, 6);
    g.addEdge(0, 3, 5);
    g.addEdge(0, 4, 3);
    g.addEdge(2, 1, 2);
    g.addEdge(2, 3, 4);

    int source = 0;
    g.dijkstra(source);

    return 0;
}
