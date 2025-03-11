import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import CyberButton from "./CyberButton";

interface CyberDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const CyberDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
}: CyberDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "#000",
          border: "1px solid #00ffff",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          minWidth: "320px",
        },
      }}
    >
      <DialogTitle>
        <Typography
          sx={{
            color: "#00ffff",
            fontFamily: "'Inter', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ color: "#fff" }}>{children}</Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>{actions}</DialogActions>
    </Dialog>
  );
};

export default CyberDialog;
