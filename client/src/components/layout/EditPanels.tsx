import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import NodeEditPanel from "../panels/NodeEditPanel";
import EdgeEditPanel from "../panels/EdgeEditPanel";
import AddNodePanel from "../panels/AddNodePanel";
import { useGraphStore } from "../../stores/useGraphStore";

const EditPanels = () => {
  const { selectedNode, selectedEdge } = useGraphStore();
  const [activePanel, setActivePanel] = React.useState(0);

  // Automatically switch to edit panels when selecting nodes/edges
  React.useEffect(() => {
    if (selectedNode) setActivePanel(1);
    if (selectedEdge) setActivePanel(2);
  }, [selectedNode, selectedEdge]);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activePanel}
        onChange={(_, newValue) => setActivePanel(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: "rgba(0, 255, 255, 0.1)",
          "& .MuiTab-root": {
            color: "rgba(0, 255, 255, 0.7)",
            "&.Mui-selected": {
              color: "#00ffff",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#00ffff",
          },
        }}
      >
        <Tab label="Add Node" />
        <Tab label="Edit Node" disabled={!selectedNode} />
        <Tab label="Edit Edge" disabled={!selectedEdge} />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activePanel === 0 && <AddNodePanel />}
        {activePanel === 1 && <NodeEditPanel />}
        {activePanel === 2 && <EdgeEditPanel />}
      </Box>
    </Box>
  );
};

export default EditPanels;
