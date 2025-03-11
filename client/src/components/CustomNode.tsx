// client/src/components/CustomNode.tsx
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useGraphStore } from "../stores/useGraphStore";

type CustomNodeProps = {
  id: string;
  data: {
    name: string;
    weight: number;
    emissions: number;
  };
};

const CustomNode = ({ id, data }: CustomNodeProps) => {
  const { selectedNode } = useGraphStore();
  const { name, weight, emissions } = data;

  const isSelected = selectedNode === id;

  return (
    <div
      style={{
        padding: "10px",
        border: `2px solid ${isSelected ? "#ff0072" : "#ccc"}`,
        borderRadius: "5px",
        backgroundColor: "#fff",
      }}
    >
      <div>
        <strong>Name:</strong> {name}
      </div>
      <div>
        <strong>Weight:</strong> {weight}
      </div>
      <div>
        <strong>Emissions:</strong> {emissions}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-source`}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-target`}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default CustomNode;
