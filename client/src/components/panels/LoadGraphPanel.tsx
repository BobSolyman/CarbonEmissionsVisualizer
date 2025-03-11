import { useEffect, useState } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Stack,
} from "@mui/material";
import CyberButton from "../shared/CyberButton";
import axios from "axios";

type GraphData = {
  _id: string;
  name: string;
  nodes: any[];
  edges: any[];
};

const LoadGraphPanel = () => {
  const { actions } = useGraphStore();
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [selectedGraphId, setSelectedGraphId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGraphs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/graph/list");
      setGraphs(response.data);
    } catch (error) {
      console.error("Error fetching graphs:", error);
      setError("Failed to load graphs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphs();
  }, []);

  const handleLoadGraph = async () => {
    if (!selectedGraphId) {
      setError("Please select a graph to load.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/graph/load/${selectedGraphId}`
      );
      const graphData = response.data;
      actions.setGraphId(graphData._id);
      actions.setGraphName(graphData.name);
      actions.setNodes(graphData.nodes);
      actions.setEdges(graphData.edges);
    } catch (error) {
      console.error("Error loading graph:", error);
      setError("Failed to load the selected graph. Please try again.");
    } finally {
      setLoading(false);
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
        Load Graph
      </Typography>

      {error && (
        <Typography
          sx={{
            color: "#ff0000",
            mb: 2,
            fontSize: "0.875rem",
            textShadow: "0 0 5px rgba(255, 0, 0, 0.5)",
          }}
        >
          {error}
        </Typography>
      )}

      <FormControl fullWidth variant="standard" sx={{ mb: 3 }}>
        <Select
          value={selectedGraphId}
          onChange={(e) => setSelectedGraphId(e.target.value as string)}
          displayEmpty
          sx={{
            color: "#00ffff",
            ".MuiSelect-select": {
              border: "1px solid rgba(0, 255, 255, 0.2)",
              borderRadius: "4px",
              padding: "8px 12px",
            },
            "&:before": { borderBottom: "none" },
            "&:after": { borderBottom: "none" },
            "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
          }}
        >
          <MenuItem value="" disabled>
            Select a Graph
          </MenuItem>
          {graphs.map((graph) => (
            <MenuItem
              key={graph._id}
              value={graph._id}
              sx={{
                color: "#00ffff",
                "&:hover": {
                  background: "rgba(0, 255, 255, 0.1)",
                },
                "&.Mui-selected": {
                  background: "rgba(0, 255, 255, 0.2)",
                },
              }}
            >
              {graph.name || "Untitled Graph"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2}>
        <CyberButton
          onClick={handleLoadGraph}
          loading={loading}
          disabled={!selectedGraphId}
          icon="📂"
          fullWidth
        >
          Load Graph
        </CyberButton>
        <CyberButton
          onClick={fetchGraphs}
          variant="primary"
          icon="🔄"
          disabled={loading}
        >
          Refresh
        </CyberButton>
      </Stack>
    </Box>
  );
};

export default LoadGraphPanel;
