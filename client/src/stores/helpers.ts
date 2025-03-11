import { Edge, Node, GraphStore } from "./types";

// Helper function to recursively update downstream nodes and edges
export const updateDownstreamNodes = (
  nodeId: string,
  emissionsDelta: number,
  updatedNodesMap: Map<string, Node>,
  updatedEdgesMap: Map<string, Edge>,
  state: GraphStore
) => {
  const node =
    updatedNodesMap.get(nodeId) || state.nodes.find((n) => n.id === nodeId)!;
  const updatedNode = {
    ...node,
    emissions: node.emissions + emissionsDelta,
  };
  updatedNodesMap.set(nodeId, updatedNode);

  // Find all outgoing edges from this node
  const outgoingEdges = state.edges.filter((e) => e.source === nodeId);
  outgoingEdges.forEach((outEdge) => {
    // FIXED FORMULA: node's weight / edge weight * node's emissions
    const newEdgeEmissions =
      (updatedNode.weight / outEdge.weight) * updatedNode.emissions;
    const updatedEdge = {
      ...outEdge,
      emissions: newEdgeEmissions,
    };
    updatedEdgesMap.set(outEdge.id, updatedEdge);

    updateDownstreamNodes(
      outEdge.target,
      newEdgeEmissions - outEdge.emissions,
      updatedNodesMap,
      updatedEdgesMap,
      state
    );
  });
};

// Check for cycles using DFS starting from the target node
export const hasCycle = (edge: Edge, state: GraphStore) => {
  const visited = new Set<string>();
  const stack = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    if (nodeId === edge.source) return true; // Would create a cycle
    if (stack.has(nodeId)) return false;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    stack.add(nodeId);

    const outgoingEdges = state.edges.filter((e) => e.source === nodeId);
    for (const outEdge of outgoingEdges) {
      if (dfs(outEdge.target)) return true;
    }

    stack.delete(nodeId);
    return false;
  };

  // Start DFS from the target node
  return dfs(edge.target);
};
