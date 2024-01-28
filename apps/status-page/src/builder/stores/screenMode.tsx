import { create } from "zustand";

interface ScreenModeState {
  screenMode: "desktop" | "tablet" | "mobile";
  width: number;
  height: number;
}

interface ScreenModeActions {
  setScreenMode: (screenMode: "desktop" | "tablet" | "mobile") => void;
}

const initialState: ScreenModeState = {
  screenMode: "desktop",
  width: 1920,
  height: 1080,
};

const useScreenMode = create<ScreenModeState & ScreenModeActions>((set) => ({
  ...initialState,
  setScreenMode: (screenMode) => {
    let width = 1200;
    let height = 800;

    if (screenMode === "tablet") {
      width = 768;
      height = 1024;
    }

    if (screenMode === "mobile") {
      width = 360;
      height = 640;
    }

    set((state) => ({
      ...state,
      screenMode,
      width,
      height,
    }));
  },
}));

export default useScreenMode;
