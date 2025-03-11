import { create } from "zustand";
import { useDialogStore } from "./useDialogStore";
import { GraphStore, Edge, Node } from "./types";
import { hasCycle, updateDownstreamNodes } from "./helpers";

export const useGraphStore = create<GraphStore>((set, get) => ({
  id: "",
  name: "",
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  actions: {
    setGraphName: (name) => set((state) => ({ ...state, name })),
    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

    // Delete a node and its associated edges
    deleteNode: (id) =>
      set((state) => {
        // Find all outgoing edges from the node being deleted
        const outgoingEdges = state.edges.filter((e) => e.source === id);

        // Create maps to store updated nodes and edges
        const updatedNodesMap = new Map<string, Node>();
        const updatedEdgesMap = new Map<string, Edge>();

        // Update all downstream nodes for each outgoing edge
        outgoingEdges.forEach((edge) => {
          updateDownstreamNodes(
            edge.target,
            -edge.emissions, // Negative emissions since we're removing the edge
            updatedNodesMap,
            updatedEdgesMap,
            state
          );
        });

        // Convert the maps back to arrays and combine with unaffected nodes/edges
        const updatedNodes = state.nodes.map((node) =>
          updatedNodesMap.has(node.id) ? updatedNodesMap.get(node.id)! : node
        );
        const updatedEdges = state.edges.map((edge) =>
          updatedEdgesMap.has(edge.id) ? updatedEdgesMap.get(edge.id)! : edge
        );

        return {
          nodes: updatedNodes.filter((n) => n.id !== id),
          edges: updatedEdges.filter((e) => e.source !== id && e.target !== id),
        };
      }),

    // Add a new edge and update downstream nodes
    addEdge: (edge) =>
      set((state) => {
        const sourceNode = state.nodes.find((n) => n.id === edge.source)!;
        const targetNode = state.nodes.find((n) => n.id === edge.target)!;

        if (hasCycle(edge, state)) {
          useDialogStore.getState().showAlert({
            title: "Invalid Operation",
            message: "Adding this edge would create a cycle!",
            type: "warning",
          });
          return state;
        }

        // Check if total outbound edge weights exceed the node's weight
        const totalOutboundWeight = state.edges
          .filter((e) => e.source === edge.source)
          .reduce((sum, e) => sum + e.weight, 0);

        if (totalOutboundWeight + edge.weight > sourceNode.weight) {
          useDialogStore.getState().showAlert({
            title: "Invalid Operation",
            message: "Total outbound edge weights exceed the node's weight!",
            type: "warning",
          });
          return state;
        }

        // Calculate initial edge emissions - FIXED FORMULA
        const edgeEmissions =
          (sourceNode.weight / edge.weight) * sourceNode.emissions;
        const newEdge = { ...edge, emissions: edgeEmissions };

        // Create maps to store updated nodes and edges
        const updatedNodesMap = new Map<string, Node>();
        const updatedEdgesMap = new Map<string, Edge>();

        // Start the downstream updates from the target node
        updateDownstreamNodes(
          edge.target,
          edgeEmissions,
          updatedNodesMap,
          updatedEdgesMap,
          state
        );

        // Convert maps back to arrays and combine with unaffected nodes/edges
        const finalNodes = state.nodes.map((node) =>
          updatedNodesMap.has(node.id) ? updatedNodesMap.get(node.id)! : node
        );

        return {
          nodes: finalNodes,
          edges: [...state.edges, newEdge],
        };
      }),

    // Delete an edge and update downstream nodes
    deleteEdge: (id) =>
      set((state) => {
        const edge = state.edges.find((e) => e.id === id)!;

        // Create maps to store updated nodes and edges
        const updatedNodesMap = new Map<string, Node>();
        const updatedEdgesMap = new Map<string, Edge>();

        // Start the downstream updates from the target node
        updateDownstreamNodes(
          edge.target,
          -edge.emissions,
          updatedNodesMap,
          updatedEdgesMap,
          state
        );

        // Convert maps back to arrays and combine with unaffected nodes/edges
        const finalNodes = state.nodes.map((node) =>
          updatedNodesMap.has(node.id) ? updatedNodesMap.get(node.id)! : node
        );
        const finalEdges = state.edges.map((e) =>
          updatedEdgesMap.has(e.id) ? updatedEdgesMap.get(e.id)! : e
        );

        return {
          nodes: finalNodes,
          edges: finalEdges.filter((e) => e.id !== id),
        };
      }),

    // Update a node's properties and propagate changes to outgoing edges
    updateNode: (id, props) =>
      set((state) => {
        // If we're only updating position, just update the node
        if (
          Object.keys(props).every((key) => ["position", "name"].includes(key))
        ) {
          return {
            ...state,
            nodes: state.nodes.map((node) =>
              node.id === id ? { ...node, ...props } : node
            ),
          };
        }

        // Calculate total incoming emissions from edges
        const totalIncomingEmissions = state.edges
          .filter((e) => e.target === id)
          .reduce((sum, e) => sum + e.emissions, 0);

        // If the new emissions value is less than the total incoming emissions, alert and prevent the update
        if (
          props.emissions !== undefined &&
          props.emissions < totalIncomingEmissions
        ) {
          useDialogStore.getState().showAlert({
            title: "Invalid Operation",
            message:
              "Emissions cannot be set below the total incoming emissions from edges.",
            type: "warning",
          });
          return state;
        }

        // Check if total outbound edge weights exceed the node's weight
        const totalOutboundWeight = state.edges
          .filter((e) => e.source === id)
          .reduce((sum, e) => sum + e.weight, 0);

        if (totalOutboundWeight > (props.weight ?? totalOutboundWeight)) {
          useDialogStore.getState().showAlert({
            title: "Invalid Operation",
            message: "Total outbound edge weights exceed the node's weight!",
            type: "warning",
          });
          return state;
        }

        // Create maps to store updated nodes and edges
        const updatedNodesMap = new Map<string, Node>();
        const updatedEdgesMap = new Map<string, Edge>();

        // First update the initial node
        const originalNode = state.nodes.find((n) => n.id === id)!;
        const updatedNode = { ...originalNode, ...props };
        updatedNodesMap.set(id, updatedNode);

        // Find all outgoing edges from the updated node
        const outgoingEdges = state.edges.filter((e) => e.source === id);
        outgoingEdges.forEach((outEdge) => {
          // Calculate new edge emissions based on the updated node
          const newEdgeEmissions =
            (updatedNode.weight / outEdge.weight) * updatedNode.emissions;
          const updatedEdge = {
            ...outEdge,
            emissions: newEdgeEmissions,
          };
          updatedEdgesMap.set(outEdge.id, updatedEdge);

          // Update downstream nodes
          updateDownstreamNodes(
            outEdge.target,
            newEdgeEmissions - outEdge.emissions,
            updatedNodesMap,
            updatedEdgesMap,
            state
          );
        });

        // Convert maps back to arrays and combine with unaffected nodes/edges
        const finalNodes = state.nodes.map((node) =>
          updatedNodesMap.has(node.id) ? updatedNodesMap.get(node.id)! : node
        );
        const finalEdges = state.edges.map((edge) =>
          updatedEdgesMap.has(edge.id) ? updatedEdgesMap.get(edge.id)! : edge
        );

        return {
          nodes: finalNodes,
          edges: finalEdges,
        };
      }),

    // Update an edge and propagate changes downstream
    updateEdge: (id, props) =>
      set((state) => {
        const edge = state.edges.find((e) => e.id === id)!;
        const sourceNode = state.nodes.find((n) => n.id === edge.source)!;

        if (hasCycle(edge, state)) {
          useDialogStore.getState().showAlert({
            title: "Invalid Operation",
            message: "This change would create a cycle!",
            type: "warning",
          });
          return state;
        }

        // Check if total outbound edge weights exceed the node's weight
        const totalOutboundWeightMinusCurrent = state.edges
          .filter((e) => e.source === edge.source && e.id !== edge.id)
          .reduce((sum, e) => sum + e.weight, 0);

        if (
          totalOutboundWeightMinusCurrent + (props.weight ?? edge.weight) >
          sourceNode.weight
        ) {
          useDialogStore.getState().showAlert({
            title: "Invalid Operation",
            message: "Total outbound edge weights exceed the node's weight!",
            type: "warning",
          });
          return state;
        }

        // Calculate new emissions - FIXED FORMULA
        const newEmissions =
          props.weight !== undefined
            ? (sourceNode.weight / props.weight) * sourceNode.emissions
            : edge.emissions;

        // Create maps to store updated nodes and edges
        const updatedNodesMap = new Map<string, Node>();
        const updatedEdgesMap = new Map<string, Edge>();

        // Update the edge first
        const updatedEdge = { ...edge, ...props, emissions: newEmissions };
        updatedEdgesMap.set(id, updatedEdge);

        // Start the downstream updates from the target node
        updateDownstreamNodes(
          edge.target,
          newEmissions - edge.emissions,
          updatedNodesMap,
          updatedEdgesMap,
          state
        );

        // Convert maps back to arrays and combine with unaffected nodes/edges
        const finalNodes = state.nodes.map((node) =>
          updatedNodesMap.has(node.id) ? updatedNodesMap.get(node.id)! : node
        );
        const finalEdges = state.edges.map((e) =>
          updatedEdgesMap.has(e.id) ? updatedEdgesMap.get(e.id)! : e
        );

        return {
          nodes: finalNodes,
          edges: finalEdges,
        };
      }),

    // Set the selected node
    setSelectedNode: (id) => set({ selectedNode: id }),

    // Set the selected edge
    setSelectedEdge: (id) => set({ selectedEdge: id }),

    // Set the graph ID
    setGraphId: (id) => set((state) => ({ ...state, id })),

    // Set nodes directly
    setNodes: (nodes) => set({ nodes }),

    // Set edges directly
    setEdges: (edges) => set({ edges }),
  },
}));
