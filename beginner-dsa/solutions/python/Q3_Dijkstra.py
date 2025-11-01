import heapq

class Graph:
    def __init__(self, vertices):
        self.V = vertices
        # Initialize adjacency list: each vertex maps to list of (neighbor, weight)
        self.adj = {i: [] for i in range(vertices)}

    def add_edge(self, u, v, weight):
        # For undirected graph, add edges both ways
        self.adj[u].append((v, weight))
        self.adj[v].append((u, weight))

    def dijkstra(self, src):
        # Initialize distances array with infinity
        distances = [float('inf')] * self.V
        distances[src] = 0
        
        # Priority queue: elements are tuples (distance, vertex)
        priority_queue = [(0, src)]
        
        while priority_queue:
            current_distance, u = heapq.heappop(priority_queue)
            
            # If this distance is not up to date, skip it
            if current_distance > distances[u]:
                continue
            
            # Explore neighbors
            for neighbor, weight in self.adj[u]:
                distance = current_distance + weight
                
                # If found shorter path to neighbor
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    heapq.heappush(priority_queue, (distance, neighbor))
                    
        return distances


# Example usage:

g = Graph(7)
g.add_edge(3, 0, 4)
g.add_edge(3, 4, 2)
g.add_edge(0, 2, 3)
g.add_edge(0, 4, 4)
g.add_edge(4, 2, 4)
g.add_edge(4, 6, 5)
g.add_edge(2, 5, 5)
g.add_edge(2, 1, 2)
g.add_edge(1, 5, 2)
g.add_edge(6, 5, 5)

source = 3  # vertex D if indexed from 0

distances = g.dijkstra(source)
for vertex in range(g.V):
    print(f"Distance from vertex {source} to vertex {vertex} is {distances[vertex]}")
