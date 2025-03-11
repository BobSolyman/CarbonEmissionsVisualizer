import React, { useState, useEffect } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import { TextField, Box } from "@mui/material";

const GraphNamePanel = () => {
  const { name, actions } = useGraphStore(); // Get the current graph name from the store
  const [graphName, setGraphName] = useState(name); // Local state for the graph name

  // Sync local state with the store's graph name
  useEffect(() => {
    setGraphName(name);
  }, [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setGraphName(newName);
    actions.setGraphName(newName); // Update the graph name in the store
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Graph Name"
        value={graphName}
        onChange={handleNameChange}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

export default GraphNamePanel;
