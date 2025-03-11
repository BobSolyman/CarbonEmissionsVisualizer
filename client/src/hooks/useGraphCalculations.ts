import { useGraphStore } from "stores/useGraphStore";

export const useGraphCalculations = () => {
  const { nodes, edges, actions } = useGraphStore();

  const recalculateEmissions = (nodeId: string) => {
    // Traverse graph and update emissions
    const outgoingEdges = edges.filter((e) => e.source === nodeId);
    const totalEdgeWeight = outgoingEdges.reduce((sum, e) => sum + e.weight, 0);

    if (totalEdgeWeight > nodes.find((n) => n.id === nodeId)!.weight) {
      alert("Total outbound edge weight exceeds node weight!");
      return;
    }

    outgoingEdges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)!;
      const newEmissions =
        (sourceNode.weight / edge.weight) * sourceNode.emissions;
      actions.updateEdge(edge.id, { emissions: newEmissions });

      // Update target node
      const targetNode = nodes.find((n) => n.id === edge.target)!;
      actions.updateNode(edge.target, {
        emissions: targetNode.emissions + newEmissions,
      });
    });
  };

  return { recalculateEmissions };
};
