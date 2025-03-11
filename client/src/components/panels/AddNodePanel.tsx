import { useState } from "react";
import { useGraphStore } from "../../stores/useGraphStore";
import { Box, Button, Stack, Typography } from "@mui/material";
import CyberInput from "../shared/CyberInput";
import { useDialogStore } from "../../stores/useDialogStore";

const AddNodePanel = () => {
  const { actions } = useGraphStore();
  const [name, setName] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [emissions, setEmissions] = useState<number | "">("");

  const handleAddNode = () => {
    if (!name || weight === "") {
      useDialogStore.getState().showAlert({
        title: "Invalid Operation",
        message: "Name and Weight are required!",
        type: "warning",
      });
      return;
    }

    const newNode = {
      id: `node-${Math.random().toString(36).substr(2, 9)}`,
      name,
      weight: Number(weight),
      emissions: emissions === "" ? 0 : Number(emissions),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    actions.addNode(newNode);

    setName("");
    setWeight("");
    setEmissions("");
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
        Add New Node
      </Typography>

      <Stack spacing={2}>
        <CyberInput
          label="Node Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon="📍"
          required
        />
        <CyberInput
          label="Weight"
          type="number"
          value={weight}
          onChange={(e) =>
            setWeight(
              e.target.value === "" ? "" : Math.max(0, Number(e.target.value))
            )
          }
          icon="⚖️"
          required
          inputProps={{ min: 0 }}
        />
        <CyberInput
          label="Emissions (optional)"
          type="number"
          value={emissions}
          onChange={(e) =>
            setEmissions(
              e.target.value === "" ? "" : Math.max(0, Number(e.target.value))
            )
          }
          icon="🌡️"
          inputProps={{ min: 0 }}
        />

        <Button
          variant="contained"
          onClick={handleAddNode}
          sx={{
            mt: 2,
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
          Create Node
        </Button>
      </Stack>
    </Box>
  );
};

export default AddNodePanel;
