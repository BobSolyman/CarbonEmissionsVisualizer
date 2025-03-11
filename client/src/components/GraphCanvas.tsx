// client/src/components/GraphCanvas.tsx
import React from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  ConnectionMode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGraphStore } from "../stores/useGraphStore";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  custom: CustomNode,
};

const GraphCanvas = () => {
  const { nodes, edges, actions } = useGraphStore();
  const { addEdges } = useReactFlow();

  const onConnect = (params: any) => {
    const edgeWeight = prompt("Enter edge weight:");
    if (!edgeWeight) return;

    const sourceNode = nodes.find((n) => n.id === params.source)!;
    const emissions =
      (sourceNode.weight / Number(edgeWeight)) * sourceNode.emissions;

    const newEdge = {
      ...params,
      id: `${params.source}-${params.target}`,
      weight: Number(edgeWeight),
      emissions,
    };
    actions.addEdge(newEdge);
  };

  const onEdgeClick = (event: any, edge: any) => {
    actions.setSelectedNode(null);
    actions.setSelectedEdge(edge.id); // Select the clicked edge
  };

  const onNodeClick = (event: any, node: any) => {
    actions.setSelectedEdge(null);
    actions.setSelectedNode(node.id); // Update selected node in the store
  };

  const onPaneClick = () => {
    actions.setSelectedNode(null);
    actions.setSelectedEdge(null);
  };

  return (
    <ReactFlow
      nodes={nodes.map((node) => ({
        ...node,
        type: "custom", // Use the custom node type
        data: {
          name: node.name,
          weight: node.weight,
          emissions: node.emissions,
        },
      }))}
      nodeTypes={nodeTypes} // Pass the custom node types
      edges={edges.map((edge) => ({
        ...edge,
        type: "custom",
        data: {
          weight: edge.weight,
          emissions: edge.emissions,
        },
      }))}
      edgeTypes={edgeTypes}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onPaneClick={onPaneClick}
      onConnect={onConnect}
      onNodesChange={(changes) => {
        // Handle node movement
        changes.forEach((change) => {
          if (change.type === "position" && change.dragging) {
            actions.updateNode(change.id, { position: change.position });
          }
        });
      }}
      connectionMode={ConnectionMode.Loose}
      fitView // Automatically fits the view to the graph
    >
      <Background />
      <Controls /> {/* Adds zoom and pan controls */}
      <MiniMap /> {/* Adds the minimap */}
    </ReactFlow>
  );
};

export default GraphCanvas;
