import { create } from "zustand";

type PortalParams = Record<string, unknown> | undefined;

type PortalState = {
  isOpen: boolean;
  params?: PortalParams;
};

type PortalStore = {
  portals: Record<string, PortalState>;
  openPortal: (portalName: string, params?: PortalParams) => void;
  closePortal: (portalName: string) => void;
  closeAllPortals: () => void;
  getPortalState: (portalName: string) => boolean;
  getPortalParams: (portalName: string) => PortalParams | undefined;
};

export const usePortal = create<PortalStore>((set, get) => ({
  portals: {},

  openPortal: (portalName, params) =>
    set((state) => ({
      portals: {
        ...state.portals,
        [portalName]: { isOpen: true, params },
      },
    })),

  closePortal: (portalName) =>
    set((state) => ({
      portals: {
        ...state.portals,
        [portalName]: { isOpen: false },
      },
    })),

  closeAllPortals: () =>
    set((state) => ({
      portals: Object.keys(state.portals).reduce((acc, portalName) => {
        acc[portalName] = { isOpen: false };
        return acc;
      }, {} as Record<string, PortalState>),
    })),

  getPortalState: (portalName) => get().portals[portalName]?.isOpen ?? false,

  getPortalParams: (portalName) => get().portals[portalName]?.params,
}));
