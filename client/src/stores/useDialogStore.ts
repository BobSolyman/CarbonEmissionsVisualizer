import { create } from "zustand";

interface DialogStore {
  alertOpen: boolean;
  alertTitle: string;
  alertMessage: string;
  alertType: "warning" | "error" | "info";
  showAlert: (params: {
    title: string;
    message: string;
    type?: "warning" | "error" | "info";
  }) => void;
  closeAlert: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  alertOpen: false,
  alertTitle: "",
  alertMessage: "",
  alertType: "info",
  showAlert: ({ title, message, type = "info" }) =>
    set({
      alertOpen: true,
      alertTitle: title,
      alertMessage: message,
      alertType: type,
    }),
  closeAlert: () => set({ alertOpen: false }),
}));
