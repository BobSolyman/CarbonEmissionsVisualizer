import React from "react";
import CyberDialog from "./CyberDialog";
import CyberButton from "./CyberButton";

interface CyberConfirmProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  type?: "warning" | "error" | "info";
}

const CyberConfirm = ({
  open,
  onClose,
  title,
  message,
  onConfirm,
  type = "warning",
}: CyberConfirmProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <CyberDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <CyberButton onClick={onClose} variant="primary">
            Cancel
          </CyberButton>
          <CyberButton
            onClick={handleConfirm}
            variant={type === "error" ? "danger" : "primary"}
          >
            Confirm
          </CyberButton>
        </>
      }
    >
      {message}
    </CyberDialog>
  );
};

export default CyberConfirm;
