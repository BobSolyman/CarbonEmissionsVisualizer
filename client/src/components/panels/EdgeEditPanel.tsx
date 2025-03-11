import { useState, useEffect } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import { Box, Button, Stack, Typography } from "@mui/material";
import CyberInput from "../shared/CyberInput";
import CyberConfirm from "../shared/CyberConfirm";

const EdgeEditPanel = () => {
  const { edges, actions, selectedEdge } = useGraphStore();
  const edge = edges.find((e) => e.id === selectedEdge);

  const [weight, setWeight] = useState(edge?.weight || 0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Sync form fields with selected edge
  useEffect(() => {
    if (edge) {
      setWeight(edge.weight);
    }
  }, [edge]);

  const handleSave = () => {
    if (selectedEdge) {
      const sourceNode = useGraphStore
        .getState()
        .nodes.find((n) => n.id === edge?.source)!;
      const emissions = (sourceNode.weight / weight) * sourceNode.emissions;
      actions.updateEdge(selectedEdge, { weight, emissions });
    }
  };

  const handleDelete = () => {
    if (selectedEdge) {
      setConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    actions.deleteEdge(selectedEdge);
    actions.setSelectedEdge(null);
  };

  if (!selectedEdge) return null;

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
        Edit Edge
      </Typography>

      <Stack spacing={2}>
        <CyberInput
          label="Weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
          icon="⚡"
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
            Delete Edge
          </Button>
        </Stack>
      </Stack>
      <CyberConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Edge"
        type="error"
        message="Are you sure you want to delete this edge?"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default EdgeEditPanel;
