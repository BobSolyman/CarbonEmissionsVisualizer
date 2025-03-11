// client/src/components/NodeEditPanel.tsx
import React, { useState, useEffect } from "react";
import { useGraphStore } from "../stores/useGraphStore";
import { TextField, Button, Box } from "@mui/material";

const NodeEditPanel = () => {
  const { nodes, actions, selectedNode } = useGraphStore();
  const node = nodes.find((n) => n.id === selectedNode);

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
      actions.deleteNode(selectedNode);
      actions.setSelectedNode(null); // Clear selection
    }
  };

  const validateInput = (value: number) => {
    return Math.max(0, value); // Ensure value is not negative
  };

  if (!selectedNode) return null;

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(validateInput(Number(e.target.value)))}
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Emissions"
        type="number"
        value={emissions}
        onChange={(e) => setEmissions(validateInput(Number(e.target.value)))}
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }}
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
        Delete Node
      </Button>
    </Box>
  );
};

export default NodeEditPanel;
