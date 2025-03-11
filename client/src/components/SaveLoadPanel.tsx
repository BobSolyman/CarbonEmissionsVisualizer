// client/src/components/SaveLoadPanel.tsx
import React, { useState } from "react";
import { useGraphStore } from "../stores/useGraphStore";
import { Button, Box, TextField } from "@mui/material";

const SaveLoadPanel = () => {
  const { actions } = useGraphStore();
  const [name, setName] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [emissions, setEmissions] = useState<number | "">("");

  const handleAddNode = () => {
    if (!name || weight === "") {
      alert("Name and Weight are required!");
      return;
    }

    const newNode = {
      id: `node-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      name,
      weight: Number(weight),
      emissions: emissions === "" ? 0 : Number(emissions), // Default to 0 if empty
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
    };
    actions.addNode(newNode);

    // Reset form fields
    setName("");
    setWeight("");
    setEmissions("");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Weight"
        type="number"
        value={weight}
        inputProps={{ min: 0 }}
        onChange={(e) =>
          setWeight(e.target.value === "" ? "" : Number(e.target.value))
        }
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Emissions (optional)"
        type="number"
        value={emissions}
        inputProps={{ min: 0 }}
        onChange={(e) =>
          setEmissions(e.target.value === "" ? "" : Number(e.target.value))
        }
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddNode}>
        Add Node
      </Button>
    </Box>
  );
};

export default SaveLoadPanel;
