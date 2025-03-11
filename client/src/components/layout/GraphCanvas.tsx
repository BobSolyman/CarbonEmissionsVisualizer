import { useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  ConnectionMode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGraphStore } from "../../stores/useGraphStore";
import CustomNode from "../graph/CustomNode";
import CustomEdge from "../graph/CustomEdge";
import CyberPrompt from "../shared/CyberPrompt";

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  custom: CustomNode,
};

const GraphCanvas = () => {
  const { nodes, edges, actions } = useGraphStore();
  const [promptOpen, setPromptOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<any>(null);

  const onConnect = (params: any) => {
    setPendingConnection(params);
    setPromptOpen(true);
  };

  const handlePromptConfirm = (value: string) => {
    if (!pendingConnection || !value) return;

    const sourceNode = nodes.find((n) => n.id === pendingConnection.source)!;
    const emissions =
      (sourceNode.weight / Number(value)) * sourceNode.emissions;

    const newEdge = {
      ...pendingConnection,
      id: `${pendingConnection.source}-${pendingConnection.target}`,
      weight: Number(value),
      emissions,
    };
    actions.addEdge(newEdge);
  };

  const onEdgeClick = (event: any, edge: any) => {
    actions.setSelectedNode(null);
    actions.setSelectedEdge(edge.id);
  };

  const onNodeClick = (event: any, node: any) => {
    actions.setSelectedEdge(null);
    actions.setSelectedNode(node.id);
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
      maxZoom={1.5}
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
      fitView
    >
      <Background />
      <MiniMap
        nodeColor="rgba(0, 255, 255, 0.5)"
        maskColor="rgba(0, 255, 255, 0.1)"
        style={{
          backgroundColor: "rgba(16, 24, 39, 0.95)",
          border: "1px solid rgba(0, 255, 255, 0.1)",
        }}
      />
      <Controls style={{ color: "#162439" }} />
      <CyberPrompt
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
        title="New Connection"
        message="Enter edge weight"
        onConfirm={handlePromptConfirm}
        type="number"
      />
    </ReactFlow>
  );
};

export default GraphCanvas;
