import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366F1",
      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h6: {
      fontWeight: 600,
      marginBottom: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
