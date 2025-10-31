# -----------------------------------------------------------
# Dijkstra's Algorithm - Hacktoberfest 2025 (Beginner DSA)
# File: hacktoberfest-2025/beginner-dsa/questions/Q3_dijkstra.md
# -----------------------------------------------------------

import heapq

def dijkstra(graph, source):
    """
    Finds the shortest path from a source vertex to all other vertices
    in a graph using Dijkstra's algorithm.

    Parameters:
        graph  (dict): Adjacency list representation of the graph.
                       Example: {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
        source (int): The starting vertex.

    Returns:
        dict: Shortest distances from source to each vertex.
    """

    # Initialize distances with infinity
    distances = {vertex: float('inf') for vertex
