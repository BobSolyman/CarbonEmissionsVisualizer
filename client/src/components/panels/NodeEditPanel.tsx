import { useState, useEffect } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import { Box, Button, Stack, Typography } from "@mui/material";
import CyberInput from "../shared/CyberInput";
import CyberConfirm from "../shared/CyberConfirm";

const NodeEditPanel = () => {
  const { nodes, actions, selectedNode } = useGraphStore();
  const node = nodes.find((n) => n.id === selectedNode);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [name, setName] = useState(node?.name || "");
  const [weight, setWeight] = useState(node?.weight || 0);
  const [emissions, setEmissions] = useState(node?.emissions || 0);

  // Sync form fields with selected node
  useEffect(() => {
    if (node) {
      setName(node.name);
      setWeight(node.weight);
      setEmissions(node.emissions);
    }
  }, [node]);

  const handleSave = () => {
    if (selectedNode) {
      actions.updateNode(selectedNode, { name, weight, emissions });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      setConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    actions.deleteNode(selectedNode ?? "");
    actions.setSelectedNode(null);
  };

  const validateInput = (value: number) => {
    return Math.max(0, value); // Ensure value is not negative
  };

  if (!selectedNode) return null;

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: "#00ffff",
          fontFamily: "'Inter', monospace",
          mb: 3,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
        }}
      >
        Edit Node
      </Typography>

      <Stack spacing={2}>
        <CyberInput
          // @ts-ignore
          label="Node Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          icon="📍"
        />
        <CyberInput
          // @ts-ignore
          label="Weight"
          type="number"
          value={weight}
          onChange={(e: any) => setWeight(Math.max(0, Number(e.target.value)))}
          icon="⚖️"
          inputProps={{ min: 0 }}
        />
        <CyberInput
          // @ts-ignore
          label="Emissions"
          type="number"
          value={emissions}
          onChange={(e: any) =>
            setEmissions(Math.max(0, Number(e.target.value)))
          }
          icon="🌡️"
          inputProps={{ min: 0 }}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: "rgba(0, 255, 255, 0.1)",
              border: "1px solid rgba(0, 255, 255, 0.2)",
              color: "#00ffff",
              fontFamily: "'Inter', monospace",
              "&:hover": {
                background: "rgba(0, 255, 255, 0.2)",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
              },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              background: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.2)",
              color: "#ff0000",
              fontFamily: "'Inter', monospace",
              "&:hover": {
                background: "rgba(255, 0, 0, 0.2)",
                boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
              },
            }}
          >
            Delete Node
          </Button>
        </Stack>
      </Stack>
      <CyberConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Node"
        type="error"
        message="Are you sure you want to delete this node?"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default NodeEditPanel;
