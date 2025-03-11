import { Handle, Position } from "@xyflow/react";
import { useGraphStore } from "../stores/useGraphStore";
import { Box, Typography, LinearProgress } from "@mui/material";

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

  // Calculate emission intensity (emissions per unit of weight)
  const emissionIntensity = (emissions / weight) * 100;

  // Get emoji based on emission intensity
  const getEmissionEmoji = (intensity: number) => {
    if (intensity <= 33) return "🌱";
    if (intensity <= 66) return "⚠️";
    return "🏭";
  };

  // Get color based on emission intensity
  const getEmissionColor = (intensity: number) => {
    if (intensity <= 33) return "#00ff00";
    if (intensity <= 66) return "#ffff00";
    return "#ff0000";
  };

  return (
    <Box
      sx={{
        position: "relative",
        background: "rgba(16, 24, 39, 0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid",
        borderColor: isSelected ? "#00ff00" : "rgba(0, 255, 0, 0.2)",
        borderRadius: "12px",
        padding: "16px",
        minWidth: "240px",
        boxShadow: isSelected
          ? "0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 0 25px rgba(0, 255, 0, 0.2)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Matrix-style scanning line animation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #00ff00, transparent)",
          animation: "scan 2s linear infinite",
          "@keyframes scan": {
            "0%": { transform: "translateY(0)" },
            "100%": { transform: "translateY(100px)" },
          },
          opacity: 0.3,
        }}
      />

      {/* Node Title */}
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontWeight: "600",
          fontSize: "1.1rem",
          textShadow: "0 0 10px rgba(0, 255, 0, 0.3)",
          mb: 2,
          fontFamily: "'Inter', monospace",
          display: "flex",
          alignItems: "center",
          gap: 1,
          "&::before": {
            content: '"🔋"',
            fontSize: "1.2em",
          },
        }}
      >
        {name}
      </Typography>

      {/* Metrics Container */}
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gap: 2,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, transparent, rgba(0, 255, 0, 0.05))",
            pointerEvents: "none",
          },
        }}
      >
        {/* Weight Metric */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "rgba(0, 255, 0, 0.05)",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <Typography
            sx={{
              color: "#00ff00",
              fontFamily: "'Inter', monospace",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ⚖️ WEIGHT
          </Typography>
          <Typography
            sx={{
              color: "#fff",
              fontFamily: "'Inter', monospace",
              fontSize: "1.2rem",
              fontWeight: "500",
              ml: "auto",
              letterSpacing: "0.1em",
            }}
          >
            {weight.toLocaleString()}
          </Typography>
        </Box>

        {/* Emissions Metric */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "rgba(0, 255, 0, 0.05)",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <Typography
            sx={{
              color: "#00ff00",
              fontFamily: "'Inter', monospace",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {getEmissionEmoji(emissionIntensity)} EMISSIONS
          </Typography>
          <Typography
            sx={{
              color: getEmissionColor(emissionIntensity),
              fontFamily: "'Inter', monospace",
              fontSize: "1.2rem",
              fontWeight: "500",
              ml: "auto",
              letterSpacing: "0.1em",
              textShadow: `0 0 10px ${getEmissionColor(emissionIntensity)}`,
            }}
          >
            {emissions.toLocaleString()}
          </Typography>
        </Box>

        {/* Emissions Intensity Bar */}
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(emissionIntensity, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: getEmissionColor(emissionIntensity),
                transition: "transform 0.4s ease",
              },
            }}
          />
        </Box>
      </Box>

      {/* Connection Handles */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#00ff00",
          width: "10px",
          height: "10px",
          border: "2px solid #001a00",
          boxShadow: "0 0 10px #00ff00",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#00ff00",
          width: "10px",
          height: "10px",
          border: "2px solid #001a00",
          boxShadow: "0 0 10px #00ff00",
        }}
      />
    </Box>
  );
};

export default CustomNode;
