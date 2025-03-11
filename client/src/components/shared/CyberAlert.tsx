import React from "react";
import CyberDialog from "./CyberDialog";
import CyberButton from "./CyberButton";

interface CyberAlertProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "warning" | "error" | "info";
}

const CyberAlert = ({
  open,
  onClose,
  title,
  message,
  type = "info",
}: CyberAlertProps) => {
  return (
    <CyberDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <CyberButton
          onClick={onClose}
          variant={type === "error" ? "danger" : "primary"}
          autoFocus
        >
          Close
        </CyberButton>
      }
    >
      {message}
    </CyberDialog>
  );
};

export default CyberAlert;
