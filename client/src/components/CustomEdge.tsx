// client/src/components/CustomEdge.tsx
import React from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";

type CustomEdgeProps = EdgeProps & {
  data: {
    weight: number;
    emissions: number;
  };
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: CustomEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{ stroke: "#555", strokeWidth: 2 }}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: "12px", fill: "#333" }}
          startOffset="50%"
          textAnchor="middle"
        >
          {`Weight: ${data.weight}, Emissions: ${data.emissions.toFixed(2)}`}
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
