import React from "react";
import { TextField, TextFieldProps, Box, Typography } from "@mui/material";

// @ts-ignore
interface CyberInputProps extends TextFieldProps {
  icon?: string;
}

const CyberInput = ({ icon, ...props }: CyberInputProps) => {
  return (
    <Box sx={{ position: "relative", mb: 2 }}>
      {icon && (
        <Typography
          sx={{
            position: "absolute",
            left: "-25px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(0, 255, 255, 0.7)",
            fontSize: "1.2rem",
          }}
        >
          {icon}
        </Typography>
      )}
      <TextField
        {...props}
        variant="standard"
        sx={{
          width: "100%",
          "& .MuiInput-root": {
            color: "#00ffff",
            fontFamily: "'Inter', monospace",
            "&::before": {
              borderColor: "rgba(0, 255, 255, 0.2)",
            },
            "&::after": {
              borderColor: "#00ffff",
            },
            "&:hover:not(.Mui-disabled)::before": {
              borderColor: "rgba(0, 255, 255, 0.5)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 255, 255, 0.7)",
            fontFamily: "'Inter', monospace",
            "&.Mui-focused": {
              color: "#00ffff",
            },
          },
          "& .MuiInput-input": {
            padding: "8px 12px",
            background: "rgba(0, 255, 255, 0.05)",
            borderRadius: "4px",
            transition: "all 0.3s ease",
            "&:focus": {
              background: "rgba(0, 255, 255, 0.1)",
              boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)",
            },
          },
          // @ts-ignore
          ...props.sx,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, #00ffff, transparent)",
          opacity: 0.5,
        }}
      />
    </Box>
  );
};

export default CyberInput;
