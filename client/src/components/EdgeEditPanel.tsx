// client/src/components/EdgeEditPanel.tsx
import React, { useState, useEffect } from "react";
import { useGraphStore } from "../stores/useGraphStore";
import { TextField, Button, Box } from "@mui/material";

const EdgeEditPanel = () => {
  const { edges, actions, selectedEdge } = useGraphStore();
  const edge = edges.find((e) => e.id === selectedEdge);

  const [weight, setWeight] = useState(edge?.weight || 0);

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
      actions.deleteEdge(selectedEdge);
      actions.setSelectedEdge(null); // Clear selection
    }
  };

  const validateInput = (value: number) => {
    return Math.max(0, value); // Ensure value is not negative
  };

  if (!selectedEdge) return null;

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(validateInput(Number(e.target.value)))}
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }} // Enforce non-negative input
      />
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDelete}
        sx={{ marginLeft: 2 }}
      >
        Delete Edge
      </Button>
    </Box>
  );
};

export default EdgeEditPanel;
