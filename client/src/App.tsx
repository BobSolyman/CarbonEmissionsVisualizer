import GraphCanvas from "@components/layout/GraphCanvas";
import { Box, Paper, Stack, Divider } from "@mui/material";
import LoadGraphPanel from "@components/panels/LoadGraphPanel";
import SaveGraphPanel from "@components/panels/SaveGraphPanel";
import Header from "@components/layout/Header";
import EditPanels from "@components/layout/EditPanels";
import CyberAlert from "@components/shared/CyberAlert";
import { useDialogStore } from "./stores/useDialogStore";

const App = () => {
  const { alertOpen, alertTitle, alertMessage, alertType, closeAlert } =
    useDialogStore();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0A0F1E",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          gap: 3,
          p: 3,
          height: "calc(100vh - 100px)",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 3,
            borderRadius: 2,
            overflow: "hidden",
            background: "rgba(16, 24, 39, 0.95)",
            border: "1px solid rgba(0, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <GraphCanvas />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2,
            background: "rgba(16, 24, 39, 0.95)",
            border: "1px solid rgba(0, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            maxWidth: "360px",
            height: "fit-content",
          }}
        >
          <Stack
            spacing={2}
            divider={<Divider sx={{ borderColor: "rgba(0, 255, 255, 0.1)" }} />}
            sx={{ p: 3 }}
          >
            <LoadGraphPanel />
            <EditPanels />
            <SaveGraphPanel />
          </Stack>
        </Paper>
      </Box>
      <CyberAlert
        open={alertOpen}
        onClose={closeAlert}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
      />
    </Box>
  );
};

export default App;
