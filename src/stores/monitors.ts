import create from "zustand";
import * as falso from "@ngneat/falso";

interface Monitor {
    name: string;
    lastRunTimestamp?: number;
}

interface MonitorState {
    monitors?: Monitor[];
}

const useMonitors = create<MonitorState>()((set) => ({
    monitors: falso.randProduct({ length: 4 }).map((product) => ({ name: product.title })),
}));

export default useMonitors;
