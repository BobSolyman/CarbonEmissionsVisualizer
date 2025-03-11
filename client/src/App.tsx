// client/src/App.tsx
import React from "react";
import GraphCanvas from "@components/GraphCanvas";
import NodeEditPanel from "@components/NodeEditPanel";
import { Box } from "@mui/material";
import SaveLoadPanel from "@components/SaveLoadPanel";
import EdgeEditPanel from "@components/EdgeEditPanel";

const App = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ flex: 3 }}>
        <GraphCanvas />
      </Box>
      <Box sx={{ flex: 1, padding: 2 }}>
        <NodeEditPanel />
        <EdgeEditPanel />
        <SaveLoadPanel />
      </Box>
    </Box>
  );
};

export default App;
