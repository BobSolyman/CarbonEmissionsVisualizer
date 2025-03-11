import React from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface CyberButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: string;
  variant?: "primary" | "danger" | "success";
}

const CyberButton = ({
  children,
  loading,
  icon,
  variant = "primary",
  ...props
}: CyberButtonProps) => {
  const getColorScheme = () => {
    switch (variant) {
      case "danger":
        return {
          background: "rgba(255, 0, 0, 0.1)",
          border: "1px solid rgba(255, 0, 0, 0.2)",
          color: "#ff0000",
          hoverBg: "rgba(255, 0, 0, 0.2)",
          shadow: "rgba(255, 0, 0, 0.3)",
        };
      case "success":
        return {
          background: "rgba(0, 255, 128, 0.1)",
          border: "1px solid rgba(0, 255, 128, 0.2)",
          color: "#00ff80",
          hoverBg: "rgba(0, 255, 128, 0.2)",
          shadow: "rgba(0, 255, 128, 0.3)",
        };
      default:
        return {
          background: "rgba(0, 255, 255, 0.1)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          color: "#00ffff",
          hoverBg: "rgba(0, 255, 255, 0.2)",
          shadow: "rgba(0, 255, 255, 0.3)",
        };
    }
  };

  const colors = getColorScheme();

  return (
    <Button
      {...props}
      sx={{
        background: colors.background,
        border: colors.border,
        color: colors.color,
        fontFamily: "'Inter', monospace",
        display: "flex",
        gap: 1,
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          background: colors.hoverBg,
          boxShadow: `0 0 20px ${colors.shadow}`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${colors.color})`,
          animation: "scanline 2s linear infinite",
        },
        "@keyframes scanline": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        ...props.sx,
      }}
    >
      {icon && <span>{icon}</span>}
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
};

export default CyberButton;
