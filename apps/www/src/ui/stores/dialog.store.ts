import { create } from "zustand";

type DialogParams = Record<string, unknown> | undefined;

type DialogState = {
  isOpen: boolean;
  params?: DialogParams;
};

type DialogStore = {
  Dialogs: Record<string, DialogState>;
  openDialog: (DialogName: string, params?: DialogParams) => void;
  closeDialog: (DialogName: string) => void;
  closeAllDialogs: () => void;
  getDialogState: (DialogName: string) => boolean;
  getDialogParams: (DialogName: string) => DialogParams | undefined;
};

export const useDialog = create<DialogStore>((set, get) => ({
  Dialogs: {},

  openDialog: (DialogName, params) =>
    set((state) => ({
      Dialogs: {
        ...state.Dialogs,
        [DialogName]: { isOpen: true, params },
      },
    })),

  closeDialog: (DialogName) =>
    set((state) => ({
      Dialogs: {
        ...state.Dialogs,
        [DialogName]: { isOpen: false },
      },
    })),

  closeAllDialogs: () =>
    set((state) => ({
      Dialogs: Object.keys(state.Dialogs).reduce((acc, DialogName) => {
        acc[DialogName] = { isOpen: false };
        return acc;
      }, {} as Record<string, DialogState>),
    })),

  getDialogState: (DialogName) => get().Dialogs[DialogName]?.isOpen ?? false,

  getDialogParams: (DialogName) => get().Dialogs[DialogName]?.params,
}));
