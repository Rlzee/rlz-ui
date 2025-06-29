import { create } from "zustand";
import { ButtonVariant } from "@/src/ui/components/button";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  persistent?: boolean;
  type?: ToastType;
  id: string;
  title?: string;
  message?: string;
  duration?: number;
  orientation?: ToastOrientation;
  action?: ToastAction[];
};

export type ToastOrientation =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center";

export type ToastAction = {
  label: string;
  variant?: ButtonVariant;
  onClick: () => void;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
