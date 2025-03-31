import React, { useState, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useGraphStore } from "../../stores/useGraphStore";

const Header = () => {
  const { name, actions } = useGraphStore();
  const [graphName, setGraphName] = useState(name);

  useEffect(() => {
    setGraphName(name);
  }, [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setGraphName(newName);
    actions.setGraphName(newName);
  };

  return (
    <Box
      sx={{
        background: "rgba(16, 24, 39, 0.95)",
        borderBottom: "1px solid rgba(0, 255, 255, 0.1)",
        padding: "16px 24px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left side - Title */}
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: "2.5rem",
            fontFamily: "'Inter', monospace",
            fontWeight: 600,
            color: "#fff",
            textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            "&::before": {
              content: '"⚡"',
              animation: "pulse 2s infinite",
            },
          }}
        >
          CARBON<span style={{ color: "#00ffff" }}>VISION</span>
        </Typography>

        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.9rem",
            letterSpacing: "0.2em",
            marginTop: "4px",
            fontFamily: "'Inter', monospace",
            textTransform: "uppercase",
          }}
        >
          Emission Flow CyberPunk themed Visualizer
        </Typography>
      </Box>

      {/* Right side - Graph Name Input */}
      <Box
        sx={{
          position: "relative",
          minWidth: "300px",
          "&::before": {
            content: '"PROJECT:"',
            position: "absolute",
            top: "-20px",
            left: "0",
            color: "rgba(0, 255, 255, 0.5)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            fontFamily: "'Inter', monospace",
          },
        }}
      >
        <TextField
          value={graphName}
          onChange={handleNameChange}
          variant="standard"
          sx={{
            width: "100%",
            "& .MuiInput-root": {
              color: "#00ffff",
              fontSize: "1.5rem",
              fontFamily: "'Inter', monospace",
              "&::before": {
                borderColor: "rgba(0, 255, 255, 0.2)",
              },
              "&::after": {
                borderColor: "#00ffff",
              },
              "&:hover:not(.Mui-disabled)::before": {
                borderColor: "rgba(0, 255, 255, 0.5)",
              },
            },
            "& .MuiInput-input": {
              padding: "4px 8px",
              background: "rgba(0, 255, 255, 0.05)",
              borderRadius: "4px",
              "&::placeholder": {
                color: "rgba(0, 255, 255, 0.3)",
              },
            },
          }}
          placeholder="Enter Project Name"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-2px",
            left: "0",
            right: "0",
            height: "2px",
            background: "linear-gradient(90deg, #00ffff, transparent)",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.3 },
              "50%": { opacity: 0.7 },
            },
          }}
        />
      </Box>

      {/* Scan line animation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #00ffff, transparent)",
          animation: "scan 3s linear infinite",
          "@keyframes scan": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        }}
      />
    </Box>
  );
};

export default Header;
