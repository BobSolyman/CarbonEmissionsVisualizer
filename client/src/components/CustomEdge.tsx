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
  selected,
}: CustomEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate emission intensity for color
  const emissionIntensity = (data.emissions / data.weight) * 100;

  // New color palette using cyber blues and teals
  const getEmissionColor = (intensity: number) => {
    if (intensity <= 33) return "#00ffff"; // Cyan
    if (intensity <= 66) return "#4d94ff"; // Blue
    return "#9966ff"; // Purple
  };

  // Updated emoji set
  const getEmissionEmoji = (intensity: number) => {
    if (intensity <= 33) return "💫";
    if (intensity <= 66) return "✨";
    return "⚡";
  };

  // Get pulse animation speed based on emission intensity
  const getPulseSpeed = (intensity: number) => {
    if (intensity <= 33) return "2s";
    if (intensity <= 66) return "1.5s";
    return "1s";
  };

  return (
    <>
      {/* Outer glow effect */}
      <path
        id={`${id}-outer-glow`}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: getEmissionColor(emissionIntensity),
          strokeWidth: selected ? 16 : 12,
          opacity: 0.05,
          filter: `blur(${selected ? 10 : 6}px)`,
        }}
      />

      {/* Inner glow effect */}
      <path
        id={`${id}-inner-glow`}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: getEmissionColor(emissionIntensity),
          strokeWidth: selected ? 8 : 6,
          opacity: 0.1,
          filter: `blur(${selected ? 6 : 4}px)`,
          animation: `pulse ${getPulseSpeed(emissionIntensity)} infinite`,
        }}
      />

      {/* Animated flow path */}
      <path
        id={`${id}-flow`}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: getEmissionColor(emissionIntensity),
          strokeWidth: 2,
          strokeDasharray: "6,4",
          opacity: 0.6,
          animation: `flowAnimation ${getPulseSpeed(
            emissionIntensity
          )} linear infinite`,
        }}
      />

      {/* Main edge path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: getEmissionColor(emissionIntensity),
          strokeWidth: selected ? 3 : 2,
          filter: `drop-shadow(0 0 ${selected ? 4 : 2}px ${getEmissionColor(
            emissionIntensity
          )})`,
        }}
      />

      {/* Data Labels Container */}
      <g>
        {/* Weight Label */}
        <text>
          <textPath
            href={`#${id}`}
            style={{
              fontSize: "12px",
              fill: "#ffffff",
              fontFamily: "'Inter', monospace",
              textShadow: `0 0 5px ${getEmissionColor(emissionIntensity)}`,
            }}
            startOffset="25%"
            textAnchor="middle"
            dominantBaseline="text-after-edge"
          >
            {`⚖️ ${data.weight.toLocaleString()}`}
          </textPath>
        </text>

        {/* Emissions Label */}
        <text>
          <textPath
            href={`#${id}`}
            style={{
              fontSize: "12px",
              fill: "#ffffff",
              fontFamily: "'Inter', monospace",
              textShadow: `0 0 5px ${getEmissionColor(emissionIntensity)}`,
            }}
            startOffset="75%"
            textAnchor="middle"
            dominantBaseline="text-before-edge"
          >
            {`${getEmissionEmoji(
              emissionIntensity
            )} ${data.emissions.toLocaleString()}`}
          </textPath>
        </text>
      </g>

      {/* Animations */}
      <defs>
        <style>
          {`
            @keyframes flowAnimation {
              from {
                stroke-dashoffset: 10;
              }
              to {
                stroke-dashoffset: 0;
              }
            }

            @keyframes pulse {
              0% {
                opacity: 0.1;
              }
              50% {
                opacity: 0.3;
              }
              100% {
                opacity: 0.1;
              }
            }
          `}
        </style>
      </defs>
    </>
  );
};

export default CustomEdge;
