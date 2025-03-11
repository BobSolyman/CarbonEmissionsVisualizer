import { useState } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import { Box, Stack, Typography } from "@mui/material";
import CyberButton from "../shared/CyberButton";
import axios from "axios";
import CyberConfirm from "../shared/CyberConfirm";
import { useDialogStore } from "../../stores/useDialogStore";

const SaveGraphPanel = () => {
  const { id, name, nodes, edges, actions } = useGraphStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Save or update the graph
  const handleSaveOrUpdateGraph = async () => {
    setLoading(true);
    try {
      const response = id
        ? await axios.put(`http://localhost:5000/api/graph/update/${id}`, {
            name,
            nodes,
            edges,
          })
        : await axios.post("http://localhost:5000/api/graph/save", {
            name,
            nodes,
            edges,
          });

      const result = response.data;
      actions.setGraphName(result.name);
      actions.setGraphId(result.id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving/updating graph:", error);
      useDialogStore.getState().showAlert({
        title: "Error",
        message: "Failed to save graph. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear the store and delete the graph from the database (if it exists)
  const handleClearGraph = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClear = async () => {
    try {
      if (id) {
        await axios.delete(`http://localhost:5000/api/graph/delete/${id}`);
      }

      actions.setGraphId("");
      actions.setGraphName("");
      actions.setNodes([]);
      actions.setEdges([]);
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (error) {
      console.error("Error clearing the graph:", error);
      useDialogStore.getState().showAlert({
        title: "Error",
        message: "Failed to delete graph. Please try again.",
        type: "error",
      });
    }
  };

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
        Graph Actions
      </Typography>

      <Stack direction="row" spacing={2}>
        <CyberButton
          onClick={handleSaveOrUpdateGraph}
          loading={loading}
          variant={success ? "success" : "primary"}
          icon="💾"
        >
          {success ? "Saved!" : id ? "Update Graph" : "Save Graph"}
        </CyberButton>
        <CyberButton
          onClick={handleClearGraph}
          variant="danger"
          icon="🗑️"
          disabled={loading}
        >
          {clearSuccess ? "Cleared!" : "Clear Graph"}
        </CyberButton>
      </Stack>
      <CyberConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear Graph"
        message="Are you sure you want to clear the graph? This action cannot be undone."
        onConfirm={handleConfirmClear}
        type="error"
      />
    </Box>
  );
};

export default SaveGraphPanel;
