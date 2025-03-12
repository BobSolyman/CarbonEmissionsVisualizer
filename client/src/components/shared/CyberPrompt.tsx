import React, { useState } from "react";
import CyberDialog from "./CyberDialog";
import CyberInput from "./CyberInput";
import CyberButton from "./CyberButton";

interface CyberPromptProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: (value: string) => void;
  type?: "text" | "number";
}

const CyberPrompt = ({
  open,
  onClose,
  title,
  message,
  onConfirm,
  type = "text",
}: CyberPromptProps) => {
  const [value, setValue] = useState("");

  const handleConfirm = () => {
    onConfirm(value);
    setValue("");
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
            variant="primary"
            disabled={!value}
          >
            Confirm
          </CyberButton>
        </>
      }
    >
      <CyberInput
        // @ts-ignore
        label={message}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        type={type}
        autoFocus
      />
    </CyberDialog>
  );
};

export default CyberPrompt;
