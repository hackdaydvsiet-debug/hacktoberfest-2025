import heapq

def dijkstra(graph, source):
    # Initialize distances with infinity
    distances = {vertex: float('inf') for vertex in graph}
    distances[source] = 0

    # Priority queue to select the vertex with the smallest distance
    priority_queue = [(0, source)]

    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)

        # If we found a better path before, skip it
        if current_distance > distances[current_vertex]:
            continue

        # Visit each neighbor of the current vertex
        for neighbor, weight in graph[current_vertex].items():
            distance = current_distance + weight

            # Update distance if a shorter path is found
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))

    return distances

# Example graph as adjacency list {vertex: {neighbor: weight, ...}}
graph = {
    'A': {'B': 5, 'C': 1},
    'B': {'A': 5, 'C': 2, 'D': 1},
    'C': {'A': 1, 'B': 2, 'D': 4, 'E': 8},
    'D': {'B': 1, 'C': 4, 'E': 3, 'F': 6},
    'E': {'C': 8, 'D': 3},
    'F': {'D': 6}
}

source_vertex = 'A'
shortest_distances = dijkstra(graph, source_vertex)

print(f"Shortest distances from vertex {source_vertex}:")
for vertex, distance in shortest_distances.items():
    print(f"Distance to {vertex}: {distance}")
