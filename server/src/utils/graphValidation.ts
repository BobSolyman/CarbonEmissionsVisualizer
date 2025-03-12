import { GraphInput } from "./validation";

interface ValidationError {
  message: string;
  type: "weight" | "emissions" | "cycle" | "schema";
}

export function validateGraphData(data: GraphInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for cycles
  if (hasCycles(data.edges)) {
    errors.push({
      message: "Graph contains cycles which are not allowed",
      type: "cycle",
    });
  }

  // Validate node weights and emissions
  data.nodes.forEach((node) => {
    const outgoingEdges = data.edges.filter((e) => e.source === node.id);
    const totalOutboundWeight = outgoingEdges.reduce(
      (sum, e) => sum + e.weight,
      0
    );

    if (totalOutboundWeight > node.weight) {
      errors.push({
        message: `Node ${node.name} (${node.id}): Total outbound edge weights exceed node weight`,
        type: "weight",
      });
    }

    const incomingEdges = data.edges.filter((e) => e.target === node.id);
    const totalIncomingEmissions = incomingEdges.reduce(
      (sum, e) => sum + e.emissions,
      0
    );

    if (node.emissions < totalIncomingEmissions) {
      errors.push({
        message: `Node ${node.name} (${node.id}): Node emissions cannot be less than total incoming emissions`,
        type: "emissions",
      });
    }
  });

  return errors;
}

export function verifyEmissionsCalculations(
  data: GraphInput
): ValidationError[] {
  const errors: ValidationError[] = [];

  data.edges.forEach((edge) => {
    const sourceNode = data.nodes.find((n) => n.id === edge.source);
    if (!sourceNode) return;

    // Calculate expected emissions using the formula
    const expectedEmissions =
      (sourceNode.weight / edge.weight) * sourceNode.emissions;
    const tolerance = 0.0001; // Allow for small floating-point differences

    if (Math.abs(edge.emissions - expectedEmissions) > tolerance) {
      errors.push({
        message: `Edge ${edge.id}: Emissions calculation mismatch. Expected: ${expectedEmissions}, Got: ${edge.emissions}`,
        type: "emissions",
      });
    }
  });

  return errors;
}

function hasCycles(edges: GraphInput["edges"]): boolean {
  const graph = new Map<string, string[]>();

  // Build adjacency list
  edges.forEach((edge) => {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)!.push(edge.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string): boolean {
    if (recursionStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recursionStack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    recursionStack.delete(node);
    return false;
  }

  for (const node of graph.keys()) {
    if (dfs(node)) return true;
  }

  return false;
}
