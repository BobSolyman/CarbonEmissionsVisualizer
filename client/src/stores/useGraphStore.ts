import { create } from "zustand";
import { useDialogStore } from "./useDialogStore";

type Node = {
  id: string;
  name: string;
  weight: number;
  emissions: number;
  position: { x: number; y: number };
};

type Edge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  emissions: number;
};

export type GraphStore = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  actions: {
    setGraphName: (name: string) => void;
    addNode: (node: Node) => void;
    updateNode: (id: string, props: Partial<Node>) => void;
    deleteNode: (id: string) => void;
    addEdge: (edge: Edge) => void;
    updateEdge: (id: string, props: Partial<Edge>) => void;
    deleteEdge: (id: string) => void;
    setSelectedNode: (id: string | null) => void;
    setSelectedEdge: (id: string | null) => void;
    setGraphId: (id: string) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
  };
};

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
        // Helper function to recursively update downstream nodes and edges
        const updateDownstreamNodes = (
          nodeId: string,
          emissionsDelta: number,
          updatedNodesMap: Map<string, Node>,
          updatedEdgesMap: Map<string, Edge>
        ) => {
          const node =
            updatedNodesMap.get(nodeId) ||
            state.nodes.find((n) => n.id === nodeId)!;
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

            // Continue updating downstream nodes
            updateDownstreamNodes(
              outEdge.target,
              newEdgeEmissions - outEdge.emissions,
              updatedNodesMap,
              updatedEdgesMap
            );
          });
        };

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
            updatedEdgesMap
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

        // Check for cycles using DFS starting from the target node
        const hasCycle = (() => {
          const visited = new Set<string>();
          const stack = new Set<string>();

          const dfs = (nodeId: string): boolean => {
            if (nodeId === edge.source) return true; // Would create a cycle
            if (stack.has(nodeId)) return false;
            if (visited.has(nodeId)) return false;

            visited.add(nodeId);
            stack.add(nodeId);

            const outgoingEdges = state.edges.filter(
              (e) => e.source === nodeId
            );
            for (const outEdge of outgoingEdges) {
              if (dfs(outEdge.target)) return true;
            }

            stack.delete(nodeId);
            return false;
          };

          // Start DFS from the target node
          return dfs(edge.target);
        })();

        if (hasCycle) {
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

        // Helper function to recursively update downstream nodes and edges
        const updateDownstreamNodes = (
          nodeId: string,
          emissionsDelta: number,
          updatedNodesMap: Map<string, Node>,
          updatedEdgesMap: Map<string, Edge>
        ) => {
          const node =
            updatedNodesMap.get(nodeId) ||
            state.nodes.find((n) => n.id === nodeId)!;
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
              updatedEdgesMap
            );
          });
        };

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
          updatedEdgesMap
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

        // Helper function to recursively update downstream nodes and edges
        const updateDownstreamNodes = (
          nodeId: string,
          emissionsDelta: number,
          updatedNodesMap: Map<string, Node>,
          updatedEdgesMap: Map<string, Edge>
        ) => {
          const node =
            updatedNodesMap.get(nodeId) ||
            state.nodes.find((n) => n.id === nodeId)!;
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
              updatedEdgesMap
            );
          });
        };

        // Create maps to store updated nodes and edges
        const updatedNodesMap = new Map<string, Node>();
        const updatedEdgesMap = new Map<string, Edge>();

        // Start the downstream updates from the target node
        updateDownstreamNodes(
          edge.target,
          -edge.emissions,
          updatedNodesMap,
          updatedEdgesMap
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

        // Helper function to recursively update downstream nodes and edges
        const updateDownstreamNodes = (
          nodeId: string,
          emissionsDelta: number,
          updatedNodesMap: Map<string, Node>,
          updatedEdgesMap: Map<string, Edge>
        ) => {
          const node =
            updatedNodesMap.get(nodeId) ||
            state.nodes.find((n) => n.id === nodeId)!;
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

            // Continue updating downstream nodes
            updateDownstreamNodes(
              outEdge.target,
              newEdgeEmissions - outEdge.emissions,
              updatedNodesMap,
              updatedEdgesMap
            );
          });
        };

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
            updatedEdgesMap
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

        // Check for cycles using DFS starting from the target node
        const hasCycle = (() => {
          // If we're not changing the target, no need to check for cycles
          if (!props.target || props.target === edge.target) return false;

          const visited = new Set<string>();
          const stack = new Set<string>();

          const dfs = (nodeId: string): boolean => {
            if (nodeId === edge.source) return true; // Would create a cycle
            if (stack.has(nodeId)) return false;
            if (visited.has(nodeId)) return false;

            visited.add(nodeId);
            stack.add(nodeId);

            // Look at all outgoing edges except the current edge being updated
            const outgoingEdges = state.edges.filter(
              (e) => e.source === nodeId && e.id !== edge.id
            );
            for (const outEdge of outgoingEdges) {
              if (dfs(outEdge.target)) return true;
            }

            stack.delete(nodeId);
            return false;
          };

          // Start DFS from the new target node
          return dfs(props.target);
        })();

        if (hasCycle) {
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

        // Helper function to recursively update downstream nodes and edges
        const updateDownstreamNodes = (
          nodeId: string,
          emissionsDelta: number,
          updatedNodesMap: Map<string, Node>,
          updatedEdgesMap: Map<string, Edge>
        ) => {
          const node =
            updatedNodesMap.get(nodeId) ||
            state.nodes.find((n) => n.id === nodeId)!;
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
              updatedEdgesMap
            );
          });
        };

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
          updatedEdgesMap
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
